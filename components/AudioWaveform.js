import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text } from 'react-native';
import { Audio } from 'expo-av';

const NUM_BARS = 15;
const BAR_WIDTH = 4;
const BAR_GAP = 8;
const MAX_BAR_HEIGHT = 40;
const UPDATE_INTERVAL = 100; // Update frequency in ms

export default function AudioWaveform() {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const barAnimations = useRef(
    [...Array(NUM_BARS)].map(() => new Animated.Value(2))
  ).current;
  
  // Circular buffer to store the last NUM_BARS metering values
  const meterValues = useRef([...Array(NUM_BARS)].fill(0));
  const currentMeterIndex = useRef(0);

//   useEffect(() => {
//     return () => {
//       if (recording) {
//         recording.unloadAsync();
//       }
//     };
//   }, [recording]);

  const updateWaveform = (status) => {
    if (status.metering) {
      // Convert dB metering value to a height value (dB typically ranges from -160 to 0)
      const normalizedValue = (status.metering + 160) / 160; // Normalize to 0-1
      const height = Math.max(2, normalizedValue * MAX_BAR_HEIGHT);

      // Update circular buffer
      meterValues.current[currentMeterIndex.current] = height;
      currentMeterIndex.current = (currentMeterIndex.current + 1) % NUM_BARS;

      // Animate all bars with their corresponding values
      barAnimations.forEach((animation, index) => {
        const valueIndex = (currentMeterIndex.current - index + NUM_BARS) % NUM_BARS;
        Animated.timing(animation, {
          toValue: meterValues.current[valueIndex],
          duration: UPDATE_INTERVAL,
          useNativeDriver: false,
        }).start();
      });
    }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync({
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        android: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
          enableMetering: true,
        },
        ios: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
          enableMetering: true,
        },
      });

      // Set up metering updates
      newRecording.setOnRecordingStatusUpdate(updateWaveform);
      await newRecording.setProgressUpdateInterval(UPDATE_INTERVAL);
      
      await newRecording.startAsync();
      setRecording(newRecording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      setIsRecording(false);
      setRecording(null);
      
      // Reset bar heights and meter values
      barAnimations.forEach(animation => animation.setValue(2));
      meterValues.current = [...Array(NUM_BARS)].fill(0);
      currentMeterIndex.current = 0;
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.waveformContainer}>
        {barAnimations.map((animation, index) => (
          <Animated.View
            key={index}
            style={[
              styles.bar,
              {
                height: animation,
                backgroundColor: index === NUM_BARS / 2 ? '#000' : '#666',
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: MAX_BAR_HEIGHT,
    marginBottom: 20,
  },
  bar: {
    width: BAR_WIDTH,
    backgroundColor: '#666',
    marginHorizontal: BAR_GAP / 2,
    borderRadius: BAR_WIDTH / 2,
  },
  button: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonRecording: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

