import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, StatusBar, ImageBackground, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../AppContext';


const sampleData = [
  { user: "Hello", bot: "Hello! How are you doing today?" },
  { user: "I'm feeling a bit anxious", bot: "I'm sorry to hear that you're feeling anxious. Can you tell me more about what's causing your anxiety?" },
  { user: "I have a big presentation coming up at work", bot: "It's understandable to feel anxious about a big presentation. Let's talk about some strategies to help you feel more prepared and confident." },
  { user: "That would be helpful, thank you", bot: "You're welcome. First, let's start with some deep breathing exercises to help calm your nerves. Then, we can discuss ways to prepare for your presentation that might help reduce your anxiety." }
];

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

export const ChatHistory = ({ data }) => {
  const scrollViewRef = useRef();

  useEffect(() => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, [data]);

  return (
    <ScrollView 
      ref={scrollViewRef}
      style={styles.chatContainer}
      contentContainerStyle={styles.chatContent}
    >
      {data.map((message, index) => (
        <React.Fragment key={index}>
          <View style={styles.userMessageContainer}>
            <MessageBubble content={message.user} isUser={true} />
            <Avatar isUser={true} />
          </View>
          <View style={styles.botMessageContainer}>
            <Avatar isUser={false} />
            <MessageBubble content={message.bot} isUser={false} />
          </View>
        </React.Fragment>
      ))}
    </ScrollView>
  );
};

export default function ChatHistoryComponent({route}) {
  const { session_id } = route.params;

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await supabase.from('Messages').select('user, assistant').eq('session_id',session_id)
        data.forEach((message)=>{
            setData((prevData) => [...prevData, { user: message.user, bot: message.assistant }]);
        }
        )
      }
      catch (error) {
        console.log(error)
        Alert.alert('Error', 'Failed to fetch messages');
      }
    }
    fetchData()
  }
  ,[])

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar barStyle="dark-content" /> */}
      <ImageBackground source={{ uri: 'https://www.health.com/thmb/6atKRBrmnbX5qCGA2Io_6is5H0c=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/sean-oulashin-KMn4VEeEPR8-unsplash-2000-fb7d5ae8c3054db98ac35663eb0148e1.jpg' }} style={{ flex: 1, resizeMode: 'cover', justifyContent: 'center' }}>
      <View style={{marginVertical: 40}} />
      <ChatHistory data={data} />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    // backgroundColor: '#FFFFFF',
    marginTop: 20,
    // padding: 16,
    // borderBottomWidth: 1,
    // borderBottomColor: '#E0E0E0',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
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
});

