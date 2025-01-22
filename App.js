import React, {useEffect, useState} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerItem, DrawerContentScrollView } from '@react-navigation/drawer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Auth from './pages/Auth';
import AudioPlayer from './pages/AudioPlayer';
import { AppProvider, useAppContext } from './AppContext';
import 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

import { supabase } from './lib/supabase';
import DrawerComponent from './components/DrawerComponent';
// import PlanPage from './pages/Planpage';
import ProfilePage from './pages/Profile';
import About from './pages/About';
import Temp from './pages/Temp';

import { Session } from '@supabase/supabase-js'
import DrawerNavigator from './components/DrawerNavigator';
import AppNavigator from './components/AppNavigator';
// import io from 'socket.io-client';


export default function App() {

  const [session, setSession] = useState(null)
  const [route, setRoute] = useState("Login")
  // const [loading, setLoading] = useState(true)


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // console.log("session", session)
        setSession(session)
        setRoute("Drawer")
      }
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setRoute(session ? "Drawer" : "Login")
    })
  }, [])

  console.log("session", session?.user?.id, route)

  return (
    <View style={{flex: 1, // Make the view take the full screen
      justifyContent: 'center', // Center items vertically
      alignItems: 'center', // Center items horizontally
      backgroundColor: 'red',}}>
      <Text>App</Text>
      <Text>session: {session?.user?.id}</Text>
    </View>
    // <AppProvider>
    //   <NavigationContainer>
    //       <AppNavigator initialRoute={route} user_id={session?.user?.id} />
    //   </NavigationContainer>
    // </AppProvider>

  );
}

