import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av'; // For playing audio
import Colors from '../colors';

export default function AudioWaveCircle({play}) {
  const [amplitude, setAmplitude] = useState(1); // Current amplitude of the audio
  const scale = useRef(new Animated.Value(1)).current; // Animated scale value for size

  // Function to play audio and simulate amplitude changes
  const playAudio = async () => {
    try {
    
      // Simulate real-time amplitude changes (Replace this with actual audio analysis if needed)
      const interval = setInterval(() => {
        const randomAmplitude = Math.random() *0.3 + 0.9; // Generate a random amplitude
        setAmplitude(randomAmplitude);
      }, 100);

      return () => clearInterval(interval); // Cleanup interval
    } catch (error) {
      console.error('Error loading or playing audio:', error);
    }
  };

  // Animate the circle size based on the amplitude
  useEffect(() => {
    Animated.timing(scale, {
      toValue: amplitude, // Use the amplitude directly as the scale value
      duration: 100,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
  }, [amplitude]);

  useEffect(() => {
    if (play) {
      playAudio(); // Start audio playback
    } 
  }, [play]);



  return (
    <View style={styles.container}>
      {play ? <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ scale }],
          },
        ]}
      /> : 
       <View style={styles.circle} />
        }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.primary,
  },
});
