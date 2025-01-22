import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../pages/Home';
import PlanPage from '../pages/PlanPage';
import Auth from '../pages/Auth';
import DrawerComponent from './DrawerComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAppContext } from '../AppContext';
import { supabase } from '../lib/supabase';
import ChatHistoryComponent, { ChatHistory } from '../pages/ChatHistory';
import ChatScreen from '../pages/ChatScreen';
import { SafeAreaView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProfilePage from '../pages/Test';
import App from '../pages/Temp';
import SessionHistory from '../pages/SessionHistory';
import FeedbackScreen from '../pages/Feedback';
import Temp from '../pages/Temp';

const Drawer = createDrawerNavigator();

const Avatar = ({ user }) => (
    <View style={[styles.avatar, styles.userAvatar]}>
        <Text style={styles.avatarText}>A</Text>
    </View>
);

const CustomHeaderWrapper = (ScreenComponent) => (props) => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                {/* Custom Header */}
                <View style={styles.customHeader}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Ionicons name="menu" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <Avatar />
                    </TouchableOpacity>
                </View>

                {/* Main Screen Content */}
                <ScreenComponent {...props} />
            </View>
        </SafeAreaView>
    );
};



const DrawerNavigator = ({ route }) => {

    const { user_id } = route.params || {};
    console.log("yes", user_id,)

    const [loading, setLoading] = useState(true);
    const { user, setUser, session } = useAppContext();

    useEffect(() => {
        async function fetchUser() {
            try {
                const { data: userData } = await supabase.from('Users').select().eq('user_id', user_id)
                console.log("fetchuser called ")
                setUser(userData[0]);
                setLoading(false);
            } catch (err) {
                console.log(err)
            }
        }
        fetchUser();
    }, []);

    return (
        <>
            {loading ? <Text>Loading...</Text> : (
                <Drawer.Navigator
                    initialRouteName="Home"
                    drawerContent={(props) => <DrawerComponent {...props} />}
                    screenOptions={({ navigation }) => ({
                        // remove the header
                        headerShown: true,
                        // headerTitle: "", // Hide the title
                        // headerLeft: () => (
                        //   <TouchableOpacity
                        //     style={styles.drawerButton}
                        //     onPress={() => navigation.openDrawer()}
                        //   >
                        //     <Ionicons name="menu" size={24} color="black" />
                        //   </TouchableOpacity>
                        // ),
                        headerStyle: {
                            elevation: 0, // Remove shadow for Android
                            shadowOpacity: 0, // Remove shadow for iOS
                            borderBottomWidth: 0, // Remove border at the bottom
                        },
                        headerRight: () => (
                            <TouchableOpacity
                                style={styles.notificationButton}
                                onPress={() => navigation.navigate('Profile')}
                            >
                                <Avatar user={user} />
                            </TouchableOpacity>
                        ),
                        drawerStyle: {
                            width: 250, // Adjust the drawer width here
                        },
                    })}
                >
                    <Drawer.Screen name="Home" component={CustomHeaderWrapper(Home)} options={{ headerShown: false }} />
                    {/* <Drawer.Screen name="Auth" component={Auth} /> */}
                    <Drawer.Screen name="History" component={SessionHistory} />
                    <Drawer.Screen name="Chat" component={ChatScreen} />
                    <Drawer.Screen name="Feedback" component={FeedbackScreen} />
                    <Drawer.Screen name="Plans" component={PlanPage} />
                    <Drawer.Screen name="Temp2" component={Temp} />

                </Drawer.Navigator>)
            }
        </>
    );
}

export default DrawerNavigator;

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
    drawerContainer: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#f5f5f5'
    },
    userInfoContainer: {
        alignItems: 'center',
        marginBottom: 20
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
    username: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    logoutButton: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        padding: 15,
        backgroundColor: '#03cffc',  // You can customize the color
        alignItems: 'center',
        // borderRadius: 5
    },
    logoutText: {
        color: '#fff',
        fontSize: 16
    },
    notificationButton: {
        marginRight: 15,
    },
});

