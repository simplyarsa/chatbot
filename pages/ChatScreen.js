import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, ImageBackground, Alert } from 'react-native';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAppContext } from '../AppContext';
import { supabase } from '../lib/supabase';

const Avatar = ({ isUser }) => (
    <View style={[styles.avatar, isUser ? styles.userAvatar : styles.botAvatar]}>
        <Text style={styles.avatarText}>{isUser ? 'You' : 'AI'}</Text>
    </View>
);

const MessageBubble = ({ content, isUser }) => (
    <View style={[styles.messageBubble, isUser ? styles.userMessage : styles.botMessage]}>
        <Text style={[styles.messageText, isUser && styles.userMessageText]}>{content}</Text>
    </View>
);

const ChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const scrollViewRef = useRef();

    const {user}=useAppContext();

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);


    useEffect(()=>{
        const getMessages = async () => {
            try {
                const {data} =await supabase.from('Messages').select('user, assistant').eq('user_id',user.user_id).range(0, 9)
                data.forEach((message)=>{
                    setMessages((prevMessages) => [...prevMessages, { user: message.user, bot: message.assistant }]);
                }
                )
            } catch (error) {
                console.log(error)
            }
        }
        getMessages()
    }
    ,[])

    const handleSend = async () => {
        try {
            if (inputText.trim() === '') return;

            const userMessage = { user: inputText, bot: null };
            setMessages((prevMessages) => [...prevMessages, userMessage]);
            setInputText('');

            const response = await axios.post('http://192.168.1.11:5000/api/chat', { user_id: user.user_id, session_id: '4169dcda-7a5b-4e53-bbeb-cdd8eb2f4924', message: inputText })

            const botResponse = {
                user: null,
                bot: response.data.message,
            };
            setMessages((prevMessages) => [...prevMessages, botResponse]);

        } catch (err) {
            console.log(err)
            Alert.alert('Error', 'Failed to send message');
        }
    };

    return (
        <ImageBackground source={{ uri: 'https://www.health.com/thmb/6atKRBrmnbX5qCGA2Io_6is5H0c=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/sean-oulashin-KMn4VEeEPR8-unsplash-2000-fb7d5ae8c3054db98ac35663eb0148e1.jpg' }} style={{ flex: 1,  justifyContent: 'center' }}>
            {/* <KeyboardAwareScrollView
                style={styles.container}
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                extraScrollHeight={Platform.OS === 'ios' ? 50 : 0} // Adjust extra scroll height for better view
            > */}
                <SafeAreaView style={styles.safeArea}>
                    <ScrollView
                        ref={scrollViewRef}
                        style={styles.chatContainer}
                        contentContainerStyle={styles.chatContent}
                        keyboardShouldPersistTaps="handled"

                    >
                        {messages.map((message, index) => (
                            <React.Fragment key={index}>
                                {message.user && (
                                    <View style={styles.userMessageContainer}>
                                        <MessageBubble content={message.user} isUser={true} />
                                        <Avatar isUser={true} />
                                    </View>
                                )}
                                {message.bot && (
                                    <View style={styles.botMessageContainer}>
                                        <Avatar isUser={false} />
                                        <MessageBubble content={message.bot} isUser={false} />
                                    </View>
                                )}
                            </React.Fragment>
                        ))}
                    </ScrollView>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="Type your message..."
                            multiline
                        />
                        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                            <Text style={styles.sendButtonText}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            {/* </KeyboardAwareScrollView> */}
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    safeArea: {
        flex: 1,
    },
    chatContainer: {
        flex: 1,
    },
    chatContent: {
        padding: 16,
    },
    userMessageContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 12,
    },
    botMessageContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 12,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userAvatar: {
        backgroundColor: '#3498db',
        marginLeft: 8,
    },
    botAvatar: {
        backgroundColor: '#95a5a6',
        marginRight: 8,
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
    },
    userMessage: {
        backgroundColor: '#3498db',
    },
    botMessage: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    messageText: {
        fontSize: 14,
        color: '#333333',
    },
    userMessageText: {
        color: '#FFFFFF',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 8,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    input: {
        flex: 1,
        backgroundColor: '#F0F0F0',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 8,
        fontSize: 16,
        maxHeight: 100, // Limit the height of the input
    },
    sendButton: {
        backgroundColor: '#3498db',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ChatScreen;

