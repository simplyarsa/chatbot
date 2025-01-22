import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
// import { AudioRecorder } from 'react-native-audio-recorder'; // Replace this with an appropriate library for React Native
import axios from 'axios';
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import AudioPlayer from './AudioPlayer';
// import { name } from '../constants';
import { useAppContext } from '../AppContext';
import AudioWaveCircle from './AudioWaveCircle';
import Colors from '../colors';
import HomePage from './HomePage';
import SessionPage from './SessionPage';


const name = "Therapy App";

const Home = () => {

    
    const { user, setUser, session, setSession, loading } = useAppContext();
    console.log("Home", session);


    return (
        <SafeAreaView style={styles.container}>
            {!session ?
                <HomePage /> : <SessionPage />}
        </SafeAreaView>
    );
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        // alignItems: 'center',
    },
    sidebar: {
        width: 250,
        backgroundColor: '#fff',
        borderRightWidth: 1,
        borderColor: '#ccc',
        padding: 10,
    },
    sidebarTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    sidebarItem: {
        fontSize: 16,
        marginBottom: 10,
    },
    sidebarFooter: {
        marginTop: 'auto',
        paddingTop: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    planBadge: {
        fontSize: 14,
        color: '#555',
    },
    sessionCount: {
        fontSize: 12,
        color: '#999',
    },
    upgradeButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    logoutButton: {
        marginTop: 10,
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#17a2b8',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
    },
    sessionButton: {
        padding: 10,
        backgroundColor: Colors.primary,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    toggleButton: {
        position: 'absolute',
        left: 0,
        top: '50%',
        padding: 10,
        backgroundColor: '#ccc',
        borderRadius: 5,
    },
});