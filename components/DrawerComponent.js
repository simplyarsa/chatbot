import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { supabase } from '../lib/supabase';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';
import { useAppContext } from '../AppContext';

const DrawerComponent = (props) => {

  const { user } = useAppContext();

  const progress = user?.sessions_count / 3; // Example progress value (2 out of 3)

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContainer}
    >
      {/* User Info Section */}
      <View style={styles.userInfoContainer}>
        <Text style={styles.username}>Arsa</Text>
      </View>

      {/* Navigation Items */}
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => props.navigation.navigate('Home')} >
        <Ionicons name="home-outline" size={20} color="#333" style={styles.icon} />
        <Text style={styles.drawerItemText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => props.navigation.navigate('History')} >
        <Ionicons name="lock-closed-outline" size={20} color="#333" style={styles.icon} />
        <Text style={styles.drawerItemText}>Chat History</Text>
      </TouchableOpacity>


      {/* <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => props.navigation.navigate('Auth')}
      >
        <Ionicons name="lock-closed-outline" size={20} color="#333" style={styles.icon} />
        <Text style={styles.drawerItemText}>Auth</Text>
        </TouchableOpacity> */}


      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => props.navigation.navigate('Chat')} >
        <Ionicons name="lock-closed-outline" size={20} color="#333" style={styles.icon} />
        <Text style={styles.drawerItemText}>Chat</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => props.navigation.navigate('Feedback')} >
        <Ionicons name="lock-closed-outline" size={20} color="#333" style={styles.icon} />
        <Text style={styles.drawerItemText}>Feedback</Text>
      </TouchableOpacity>


        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('Plans')} >
          <Ionicons name="information-circle-outline" size={20} color="#333" style={styles.icon} />
          <Text style={styles.drawerItemText}>Plans</Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => props.navigation.navigate('Temp2')}
      >
        <Ionicons name="lock-closed-outline" size={20} color="#333" style={styles.icon} />
        <Text style={styles.drawerItemText}>Auth</Text>
        </TouchableOpacity>


      {/* Progress Bar Section */}
      <View style={styles.progressContainer}>
        <View style={styles.progressLabelContainer}>
          <Text style={styles.progressLabel}>{user?.plan}</Text>
          <Text style={styles.progressLabel}>{user?.sessions_count}/3 sessions</Text>
        </View>
        <Progress.Bar
          progress={progress}
          width={200}
          color="#03cffc"
          unfilledColor="#ddd"
          borderWidth={0}
          height={10}
        />
      </View>

    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 24,
  },
  userInfoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 0, // Remove border radius
  },
  drawerItemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  progressContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  progressLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginBottom: 5,
  },
  progressLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: '#03cffc',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
});

export default DrawerComponent;
