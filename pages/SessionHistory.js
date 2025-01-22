import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAppContext } from "../AppContext";
import { supabase } from "../lib/supabase";
import moment from "moment";

const sessions = [
    { id: 1, createdAt: "2025-01-10 10:00 AM" },
    { id: 2, createdAt: "2025-01-11 03:15 PM" },
    { id: 3, createdAt: "2025-01-12 07:30 PM" },

    // Add more sessions as needed
];

const SessionHistory = () => {

    const navigation = useNavigation();

    const { user } = useAppContext();
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        // Fetch user's session history

        const fetchSessions = async () => {
            try {
                const { data } = await supabase.from('Session').select('*').eq('user_id', user.user_id);
                
                setSessions(data);
            } catch (error) {
                console.log(error);
                Alert.alert('Error', 'Failed to fetch sessions');
            }
        }
        fetchSessions();
    }, []);

    const handleClick = (id) => {
        navigation.navigate('Chathistory', {session_id: id} );
    }

    const renderSession = ({ item, index }) => (
        <TouchableOpacity style={styles.row} onPress={()=>handleClick(item.session_id)}>
            <Text style={styles.sessionNumber}>Session {index+1}</Text>
            <Text style={styles.sessionDate}>{moment(item.created_at).fromNow()}</Text>
            <Ionicons name="arrow-forward" size={24} color="#555" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={sessions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderSession}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 10,
    },
    list: {
        paddingBottom: 20,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 15,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
    },
    sessionNumber: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    sessionDate: {
        fontSize: 14,
        color: "#777",
    },
});

export default SessionHistory;
