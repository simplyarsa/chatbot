import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, SafeAreaView, Image } from 'react-native';
import axios from 'axios';
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import AudioPlayer from './AudioPlayer';
// import { name } from '../constants';
import { useAppContext } from '../AppContext';
import AudioWaveCircle from './AudioWaveCircle';
import Colors from '../colors';
import { LinearGradient } from 'expo-linear-gradient';

const HomePage = () => {

    const navigation = useNavigation();

    const { user, setUser, session, setSession, loading } = useAppContext();

    const handleStartSession = async () => {
        try {
            const response = await axios.post('http://192.168.1.11:5000/api/sessions/start', { user_id: user.user_id });

            // Assuming response.data is an array and contains session details
            if (response.status === 200 && response.data.length > 0) {
                setSession(response.data[0].session_id);
                console.log("Session started:", response.data[0].session_id);
            } else if (response.status === 406) {
                // Handle specific status code
                Alert.alert("Unable to start session", "Please check the requirements.");
            } else {
                // Handle unexpected response
                Alert.alert("Unexpected response", "Failed to start session.");
            }
        } catch (error) {
            console.error('Error starting session:', error);
            // Check if error.response exists for server errors
            if (error.response) {
                Alert.alert('Error', `${error.response.data.message || error.response.status}`);
            } else if (error.request) {
                Alert.alert('Error', 'No response received from the server.');
            } else {
                Alert.alert('Error', error.message);
            }
        }
    };


    const handleNavigateToChat = () => {
        navigation.navigate('Chat');
    }


    supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_OUT') {
            navigation.navigate('Login');
        }
    });


    return (
        <ScrollView>
            <SafeAreaView style={styles.container}>
                <View style={styles.mainContent}>
                    <Image
                        source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbcCdmYBtHC-SE6-nX_wYJfYNA_Ix1CgSCgA&s' }}
                        style={styles.backgroundImage}
                    />

                    <LinearGradient
                        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.5)']}
                        style={styles.overlay}
                    >
                        <Text style={styles.questionText}>How are you feeling today?</Text>
                    </LinearGradient>

                    <View style={styles.profileSection}>

                        <Text style={styles.welcomeText}>
                            Welcome to AI Therapy,{'\n'}your personal guide to mental well-being
                        </Text>
                        <Text style={styles.descriptionText}>
                            Our AI is here to help you navigate through life's challenges. Start a session to talk to our AI and discover the tools and resources to manage your mental health.
                        </Text>

                        <TouchableOpacity style={styles.startButton} onPress={handleStartSession}>
                            <Text style={styles.buttonText}>Start Session</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.scheduleButton} onPress={handleNavigateToChat}>
                            <Text style={styles.scheduleButtonText}>Chat with AI</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    settingsButton: {
        padding: 8,
    },
    settingsIcon: {
        width: 24,
        height: 24,
    },
    headerText: {
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 16,
    },
    mainContent: {
        flex: 1,
        position: 'relative',
    },
    backgroundImage: {
        width: '100%',
        height: 240,
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 240,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    questionText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    profileSection: {
        padding: 20,
        alignItems: 'center',
    },
    avatarImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 16,
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
    },
    descriptionText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    startButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 8,
        width: '100%',
        marginBottom: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    scheduleButton: {
        paddingVertical: 16,
    },
    scheduleButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default HomePage;