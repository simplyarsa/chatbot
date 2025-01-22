import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const SessionPage = () => {
    const navigation = useNavigation();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('SessionWithButton')}>
            <Text style={styles.buttonText} >Session Page</Text>
        </TouchableOpacity>

        <TouchableOpacity  style={styles.startButton} onPress={() => navigation.navigate('SessionCall')}>
            <Text style={styles.buttonText} >Temp</Text>
        </TouchableOpacity>
        <Text>* Beta phase (Use headphones and operate in a quiet place)</Text>
    </View>
  )
}

export default SessionPage

const styles = StyleSheet.create({
    startButton: {
        backgroundColor: '#075eec',
        borderRadius: 30,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        width: 200
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
})