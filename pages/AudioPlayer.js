import React, { useState, useEffect, useRef } from 'react';
import { View, Button, Text, StyleSheet, PermissionsAndroid, Platform, TouchableOpacity, Animated } from 'react-native';
import { Audio } from 'expo-av';
// import io from 'socket.io-client';
import { Buffer } from 'buffer';
import { useAppContext } from '../AppContext';
import { MaterialIcons } from '@expo/vector-icons';
import AudioWaveCircle from './AudioWaveCircle';


const NUM_BARS = 15;
const BAR_WIDTH = 4;
const BAR_GAP = 8;
const MAX_BAR_HEIGHT = 40;
const UPDATE_INTERVAL = 100;


const AudioPlayer = () => {
    const [socket, setSocket] = useState(null);
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [play, setPlay] = useState(false);
    const audioChunksRef = useRef([]); // Use ref to store chunks
    const [message, setMessage] = useState(`Mujhe samajh aaya, yaar. Ajkal ke busy life mein, akelepan ka ehsaas hona bahut hi aam hai. Lekin tumhare liye kuch cheezein karne ke liye hain jo tumhe thoda better feel karane mein madad kar sakti hain:

1. **Doston aur parivaar se sampark mein rahein**: Apne doston aur parivaar walon se baat karein, unke saath samay bitayein. Yeh aapko akelepan se bahar nikalne mein madad karega.`);
    const [recording, setRecording] = useState(null);
    // const [loading, setLoading] = useState(false);


    const [isRecording, setIsRecording] = useState(false);
    const barAnimations = useRef(
        [...Array(NUM_BARS)].map(() => new Animated.Value(2))
    ).current;

    // Circular buffer to store the last NUM_BARS metering values
    const meterValues = useRef([...Array(NUM_BARS)].fill(0));
    const currentMeterIndex = useRef(0);


    const { user, session, setSession, loading } = useAppContext();
    const [showWaveform, setShowWaveform] = useState(false);

    useEffect(() => {
        if (!loading) {
            const user_id = user.user_id;
            const socket = io(`http://192.168.1.11:4000/?user_id=${user.user_id}&session_id=${session}`, {
                transports: ['websocket'],
            });
            setSocket(socket);

            // Emit the playAudio event to start streaming
            socket.on('ready', () => {
                console.log('Socket connected:', socket.id);
                // socket.emit('startSession', user_id);
            });

            socket.on('audiotest', async (audioChunk) => {
                try {
                    // Convert the audio chunk to a playable format
                    const { sound: newSound } = await Audio.Sound.createAsync(
                        { uri: `data:audio/mp3;base64,${Buffer(audioChunk).toString('base64')}` }, // Use appropriate data format
                        { shouldPlay: true }
                    );
                    // Play the sound
                    await newSound.playAsync();
                } catch (error) {
                    console.error('Error playing audio:', error);
                }
            });

            // Listen for incoming audio chunks
            socket.on('audioChunk', (chunk) => {
                console.log('Received audio chunk:');
                const bufferChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
                audioChunksRef.current.push(bufferChunk); // Push to ref directly
            });

            // When the server signals the end of the audio stream, play the audio automatically
            socket.on('audioEnd', async () => {
                await playAudio();
            });

            // Listen for metadata (e.g., text message)
            socket.on('audioMeta', (data) => {
                setMessage(data.message);
            });

            socket.on('sessionEnd', async () => {
                console.log('Session ended');
                await playAudio();
            })

            // Handle socket disconnection
            socket.on('disconnect', async () => {
                console.log('Socket disconnected');
                await playAudio();
                // setSocket(null);
                setSession(null);
            });

            return () => {
                setSession(null);
                // socket.disconnect();
            };
        }
    }, [loading]);

    const playAudio = async () => {
        if (!audioChunksRef.current.length) return;
        console.log('Playing audio...', audioChunksRef.current.length);

        try {
            let start = Date.now();
            // Concatenate all received audio chunks into a single buffer
            const audioData = Buffer.concat(audioChunksRef.current);
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: `data:audio/mp3;base64,${audioData.toString('base64')}` },
                { shouldPlay: true },
                onPlaybackStatusUpdate
            );
            setPlay(true);
            setSound(newSound);
            setIsPlaying(true);
            console.log('Audio playback took:', Date.now() - start, 'ms');
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    };

    const onPlaybackStatusUpdate = (status) => {
        if (status.didJustFinish) {
            setPlay(false);
            setIsPlaying(false);
            audioChunksRef.current = []; // Clear chunks after playback
        }
    };


    async function startRecording() {
        audioChunksRef.current = []; // Clear chunks before recording
        if (sound) {
            console.log('Unloading Sound');
            await sound.unloadAsync();
            setSound(null);
        }
        setShowWaveform(true);
        setPlay(false);
        try {
            const perm = await Audio.requestPermissionsAsync();
            if (perm.status === "granted") {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true
                });
                const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
                setRecording(recording);
                recording.setOnRecordingStatusUpdate(updateWaveform);
                await recording.setProgressUpdateInterval(UPDATE_INTERVAL);
            }
        } catch (error) {
            console.error('Failed to start recording:', error);
        }
    }

    const handleClick = () => {
        socket.emit('test')
    }

    const stopRecording = async () => {
        setRecording(false);
        setMessage('');
        setShowWaveform(false);
        try {
            if (recording) {
                await recording.stopAndUnloadAsync();
                const uri = recording.getURI();
                const response = await fetch(uri);
                const audioBuffer = await response.arrayBuffer();
                // Reset bar heights and meter values
                barAnimations.forEach(animation => animation.setValue(2));
                meterValues.current = [...Array(NUM_BARS)].fill(0);
                currentMeterIndex.current = 0;
                // Send audio buffer to backend
                if (socket) {
                    socket.emit('generateAudio', audioBuffer, user.user_id, session);
                }
            }
        } catch (error) {
            console.error('Failed to stop recording:', error);
        }
    };

    const updateWaveform = (status) => {
        if (status.metering) {
            // Convert dB metering value to a height value (dB typically ranges from -160 to 0)
            const normalizedValue = (status.metering + 160) / 160; // Normalize to 0-1
            const height = Math.max(2, normalizedValue * MAX_BAR_HEIGHT);

            // Update circular buffer
            meterValues.current[currentMeterIndex.current] = height;
            currentMeterIndex.current = (currentMeterIndex.current + 1) % NUM_BARS;

            // Animate all bars with their corresponding values
            barAnimations.forEach((animation, index) => {
                const valueIndex = (currentMeterIndex.current - index + NUM_BARS) % NUM_BARS;
                Animated.timing(animation, {
                    toValue: meterValues.current[valueIndex],
                    duration: UPDATE_INTERVAL,
                    useNativeDriver: false,
                }).start();
            });
        }
    };


    return (
        <View style={styles.container}>
            <AudioWaveCircle play={play} />
            <View>
                {message !== '' && <Text style={styles.message}>{message}</Text>}
            </View>
            <View style={styles.waveformContainer}>
                {barAnimations.map((animation, index) => (
                    <Animated.View
                        key={index}
                        style={[
                            styles.bar,
                            {
                                height: animation,
                                backgroundColor: index === NUM_BARS / 2 ? '#000' : '#666',
                            },
                        ]}
                    />
                ))}
            </View>

            {!recording ? (
                <TouchableOpacity style={[styles.button, { borderColor: 'red' }]} onPress={startRecording} >
                    <MaterialIcons name="mic" size={24} color="#000" />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={[styles.button, { borderColor: 'green' }]} onPress={stopRecording} >
                    <MaterialIcons name="mic-off" size={24} color="#000" />
                </TouchableOpacity>
            )}

            {/* <Button title="Test" onPress={handleClick} /> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    waveformContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: MAX_BAR_HEIGHT,
        marginBottom: 20,
    },
    bar: {
        width: BAR_WIDTH,
        backgroundColor: '#666',
        marginHorizontal: BAR_GAP / 2,
        borderRadius: BAR_WIDTH / 2,
    },
    button: {
        backgroundColor: '#3498db',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    buttonRecording: {
        backgroundColor: '#e74c3c',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },

    message: {
        fontSize: 16,
        marginHorizontal: 20,
        marginVertical: 20,
        textAlign: 'left',
    },
    button: {
        width: 60, // Adjust the size of the button
        height: 60,
        borderWidth: 3, // Add a border
        borderRadius: 30, // Half of width/height for a perfect circle
        backgroundColor: '#ffffff', // White background
        justifyContent: 'center',
        borderColor: 'green',
        alignItems: 'center',
        elevation: 5, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },

});

export default AudioPlayer;
