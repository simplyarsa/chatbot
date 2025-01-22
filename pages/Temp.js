import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, ScrollView } from 'react-native';
import { Audio } from 'expo-av';
// import io from 'socket.io-client';
import { Buffer } from 'buffer';
import { useAppContext } from '../AppContext';
import { Ionicons } from '@expo/vector-icons';
import AudioWaveCircle from './AudioWaveCircle';

const NUM_BARS = 15;
const BAR_WIDTH = 4;
const BAR_GAP = 8;
const MAX_BAR_HEIGHT = 40;
const UPDATE_INTERVAL = 100;
const SILENCE_THRESHOLD = -95;
const SILENCE_DURATION = 2000; // 2 seconds in milliseconds

const AudioPlayer = () => {
    const [recording, setRecording] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);
    const silenceStartRef = useRef(null);
    const audioBufferRef = useRef([]);
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('');
    const { user, session, setSession, loading } = useAppContext();
     const audioChunksRef = useRef([])

    const barAnimations = useRef(
        [...Array(NUM_BARS)].map(() => new Animated.Value(2))
    ).current;

    const meterValues = useRef([...Array(NUM_BARS)].fill(0));
    const currentMeterIndex = useRef(0);

    const [play, setPlay] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [sound, setSound] = useState(null);


    // Socket initialization
    useEffect(() => {
        if (!loading) {
            const session="fcbc57c7-b5e9-4bda-8049-198d7ec2971f";
            console.log('User:', user, session); 
            const newSocket = io(`http://192.168.1.11:4000/?user_id=${user.user_id}&session_id=${session}`, {
                transports: ['websocket'],
            });
            setSocket(newSocket);

            // Emit the playAudio event to start streaming
            newSocket.on('ready', () => {
                console.log('Socket connected:', socket.id);
                // socket.emit('startSession', user_id);
            });


            // Listen for incoming audio chunks
            newSocket.on('audioChunk', (chunk) => {
                const bufferChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
                audioChunksRef.current.push(bufferChunk); // Push to ref directly
            });

            // When the server signals the end of the audio stream, play the audio automatically
            newSocket.on('audioEnd', async () => {
                await playAudio();
            });

            // Listen for metadata (e.g., text message)
            newSocket.on('audioMeta', (data) => {
                setMessage(data.message);
            });

            newSocket.on('sessionEnd', async () => {
                console.log('Session ended');
                await playAudio();
            })

            // Handle socket disconnection
            newSocket.on('disconnect', async () => {
                console.log('Socket disconnected');
                await playAudio();
                // setSocket(null);
                setSession(null);
            });


            return () => {
                newSocket.disconnect();
                setSession(null);
            };
        }
    }, [loading]);

    const playAudio = async () => {
            if (!audioChunksRef.current.length) return;
            console.log('Playing audio...', audioChunksRef.current.length);
            // setSound(null);
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
                audioChunksRef.current = []; // Clear chunks after playback
                console.log('Audio playback took:', Date.now() - start, 'ms');
            } catch (error) {
                console.error('Error playing audio:', error);
            }
        };
    
        const onPlaybackStatusUpdate = (status) => {
            if (status.didJustFinish) {
                setPlay(false);
                // setIsPlaying(false);
                audioChunksRef.current = []; // Clear chunks after playback
            }
        };
    

    const sendAudioData = async (currentRecording) => {
        if (socket && currentRecording) {
            try {
                await currentRecording.stopAndUnloadAsync();
                const audioData = await currentRecording.getURI();
                const response = await fetch(audioData);
                const audioBuffer = await response.arrayBuffer();
                socket.emit('test', audioBuffer);
                audioBufferRef.current = [];
                return true;
            } catch (error) {
                console.error('Error sending audio data:', error);
                return false;
            }
        }
        return false;
    };

    const detectSilence = async (metering) => {
        if (metering <= SILENCE_THRESHOLD) {
            if (silenceStartRef.current === null) {
                silenceStartRef.current = Date.now();
            } else if (Date.now() - silenceStartRef.current >= SILENCE_DURATION) {
                // Store current recording before stopping
                const currentRecording = recording;
                
                // Reset recording state
                setRecording(null);
                setIsRecording(false);
                silenceStartRef.current = null;

                const sent = await sendAudioData(currentRecording);
                // Send the current audio data
                
                // Start new recording only if the previous one was sent successfully
                if (sent) {
                    await startRecording();
                }
            }
        } else {
            silenceStartRef.current = null;
        }
    };

    useEffect(() => {
        if (isRecording && recording) {
            const interval = setInterval(async () => {
                try {
                    const status = await recording.getStatusAsync();
                    if (status.isRecording) {
                        setAudioLevel(status.metering);
                        updateWaveform(status);
                        await detectSilence(status.metering);
                    }
                } catch (error) {
                    console.error('Error getting recording status:', error);
                }
            }, UPDATE_INTERVAL);

            return () => clearInterval(interval);
        }
    }, [isRecording, recording]);

   

const startRecording = async () => {
    
    try {
        await Audio.requestPermissionsAsync();
        // Configure audio session for recording
        
        const newRecording = new Audio.Recording();
        await newRecording.prepareToRecordAsync(
            Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );

        await newRecording.startAsync();
        setRecording(newRecording);
        setIsRecording(true);
        audioBufferRef.current = [];
        return true;
    } catch (error) {
        console.error('Failed to start recording:', error);
        return false;
    }
};

    const stopRecording = async () => {
        if (recording) {
            try {
                const currentRecording = recording;
                setRecording(null);
                setIsRecording(false);
                silenceStartRef.current = null;
                await sendAudioData(currentRecording);
            } catch (error) {
                console.error('Failed to stop recording:', error);
            }
        }
    };

    // ... rest of the component (updateWaveform and render) remains the same ...

    const updateWaveform = (status) => {
        if (status.metering) {
            const normalizedValue = (status.metering + 160) / 160;
            const height = Math.max(2, normalizedValue * MAX_BAR_HEIGHT);

            meterValues.current[currentMeterIndex.current] = height;
            currentMeterIndex.current = (currentMeterIndex.current + 1) % NUM_BARS;

            barAnimations.forEach((animation, index) => {
                const valueIndex = (currentMeterIndex.current - index + NUM_BARS) % NUM_BARS;
                Animated.timing(animation, {
                    toValue: meterValues.current[valueIndex],
                    duration: UPDATE_INTERVAL,
                    useNativeDriver: false,
                }).start();
            });
        }
    }


    return (
        <View style={styles.container}>
            <Text>
                Audio Level: {audioLevel !== null && !isNaN(audioLevel) ? audioLevel.toFixed(2) : 'N/A'}
            </Text>
            <Text>Status: {audioLevel <= SILENCE_THRESHOLD ? 'Silent' : 'Speech detected'}</Text>

            <View style={styles.header} />
            <AudioWaveCircle play={isRecording} />

            <ScrollView style={styles.messageContainer} contentContainerStyle={{ flexGrow: 1 }}>
                <Text style={styles.message}>{message}</Text>
            </ScrollView>

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

            <TouchableOpacity
                style={[styles.micButton, { backgroundColor: isRecording ? "green" : "red" }]}
                onPress={isRecording ? stopRecording : startRecording}
            >
                <Ionicons name="mic" size={28} color="white" />
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        height: 60,
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
    messageContainer: {
        height: Dimensions.get("window").height / 5,
        marginHorizontal: 20,
        marginVertical: 40,
    },
    message: {
        fontSize: 16,
        lineHeight: 24,
        color: "#333",
    },
    micButton: {
        alignSelf: "center",
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
});

export default AudioPlayer;