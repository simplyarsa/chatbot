import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Signup from '../pages/Signup';
import Login from '../pages/Login';
import DrawerNavigator from './DrawerNavigator';
import ProfilePage from '../pages/Profile';
import Temp from '../pages/Temp';
import { useAppContext } from '../AppContext';
import ChatHistoryComponent from '../pages/ChatHistory';
import { SafeAreaView, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { Linking } from 'expo-linking';
import SessionWithButton from '../pages/SessionWithButton';
import SessionCall from '../pages/SessionCall';


const Stack = createStackNavigator();

const ConfirmEmailScreen = ({ route }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Confirm Email Screen</Text>
      <Text>Email Token: {route.params?.token || 'No token provided'}</Text>
  </View>
);

const linking = {
  prefixes: ['https://arsalan-portfolio-web.netlify.app/'], // Define your scheme here
  config: {
      screens: {
          Home: '',
          ConfirmEmail: 'confirm-email/:token', // Match your dynamic route
      },
  },
};

const AppNavigator = ({ initialRoute, user_id }) => {

  const CustomHeaderWrapper = (ScreenComponent) => (props) => {
    const navigation = useNavigation();

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {/* Custom Header */}
          <View style={styles.customHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Main Screen Content */}
          <ScreenComponent {...props} />
        </View>
      </SafeAreaView>
    );
  };



  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="About" component={Temp} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Login" component={Login} />

      <Stack.Screen name="Drawer" component={DrawerNavigator} initialParams={{ user_id }} />
      <Stack.Screen name="Profile" component={CustomHeaderWrapper(ProfilePage)} />
      <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} />
      <Stack.Screen name="Chathistory" component={CustomHeaderWrapper(ChatHistoryComponent)} />
      <Stack.Screen name="SessionWithButton" component={CustomHeaderWrapper(SessionWithButton)} />
      <Stack.Screen name="SessionCall" component={CustomHeaderWrapper(SessionCall)} />
      
    </Stack.Navigator>
  );
}

export default AppNavigator;

const styles = StyleSheet.create({
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    position: 'absolute', // Make the header float above the content
    top: 36,
    left: 0,
    right: 5,
    zIndex: 10, // Ensure it stays on top
    backgroundColor: 'transparent', // Allow content behind it to show
  },

});