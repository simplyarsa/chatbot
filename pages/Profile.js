import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, TextInput , ScrollView, Alert} from 'react-native';
import * as Progress from 'react-native-progress';
import { useAppContext } from '../AppContext';
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';

const ProfilePage = () => {
    const navigation = useNavigation();

    const { user } = useAppContext();

    const [aboutText, setAboutText] = useState(user.about);
    const [createdAt, setCreatedAt] = useState(new Date(user.created_at).toDateString());
    const [progress, setProgress] = useState(user.currentSessionCount / user.totalSessions);

    const getInitial = (name) => user.name.charAt(0).toUpperCase();

    const handleUpdateAbout = () => {
        Alert.alert('Updated', 'Your "About" section has been updated.');
    };


    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            navigation.reset({
                index: 0,  // The index of the new route in the stack (0 means it's the only screen now)
                routes: [{ name: 'Login' }]  // The screen you want to navigate to
            });
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
          <ScrollView>
        <SafeAreaView style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={{
                        uri: 'https://images.unsplash.com/photo-1509803874385-db7c23652552?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2xvdWR8ZW58MHx8MHx8fDA%3D',
                    }}
                    style={styles.cloud}
                />
            </View>
            <View style={styles.content}>
                {/* Profile Header */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>{getInitial(user.name)}</Text>
                    </View>
                    <Text style={styles.username}>{user.name}</Text>
                    <Text style={styles.email}>{user.email}</Text>
                    {/* <TouchableOpacity style={styles.editButton}>
                        <Text style={styles.editButtonText}>Edit profile</Text>
                    </TouchableOpacity> */}
                </View>

                {/* User Stats */}
                <View style={styles.section}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Session Progress</Text>
                        <Progress.Bar
                            progress={progress}
                            width={null}
                            height={8}
                            color="#4CAF50"
                            unfilledColor="#E8E8E8"
                            borderWidth={0}
                        />
                        <Text style={styles.statValue}>
                            {user.sessions_count} / {user.totalSessions} sessions
                        </Text>
                    </View>

                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Member Since</Text>
                        <Text style={styles.statValue}>
                            {createdAt}
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Plan</Text>
                        <Text style={styles.statValue}>
                            Free
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>About</Text>
                        <Text style={styles.statValue}>
                            {user.about}
                        </Text>
                    </View>

                </View>

                {/* Settings */}
                <View style={styles.section}>
                    <TouchableOpacity style={styles.settingsItem} onPress={handleUpdateAbout}>
                        <Text style={styles.settingsLabel}>Update About</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingsItem} onPress={handleLogout}>
                        <Text style={[styles.settingsLabel, { color: '#FF3B30' }] }>Logout</Text>
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
        backgroundColor: '#fff',
    },
    imageContainer: {
        alignItems: 'center',
        // marginBottom: 20,
    },
    cloud: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    content: {
        flex: 1,
        padding: 20,
        marginTop: -60,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    textBox: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E8F5E9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    email: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
    },
    editButton: {
        backgroundColor: '#000',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    editButtonText: {
        color: '#fff',
        fontWeight: '500',
    },
    section: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    statItem: {
        marginBottom: 16,
    },
    statLabel: {
        fontSize: 16,
        fontWeight: '500',
        // marginBottom: 8,
    },
    statValue: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    settingsItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    settingsLabel: {
        fontSize: 16,
    },
    toggle: {
        width: 40,
        height: 24,
        borderRadius: 12,
    },
});

export default ProfilePage;