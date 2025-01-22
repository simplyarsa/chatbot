// // Install only:
// // expo install @react-native-voice/voice

// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import Voice from '@react-native-voice/voice';

// const VoiceRecognition = () => {
//   const [isListening, setIsListening] = useState(false);
//   const [recognizedText, setRecognizedText] = useState('');
//   const [error, setError] = useState('');

//   useEffect(() => {
//     // Initialize voice event listeners
//     Voice.onSpeechStart = () => setIsListening(true);
//     Voice.onSpeechEnd = () => setIsListening(false);
//     Voice.onSpeechResults = (e) => {
//       setRecognizedText(e.value[0]);
//     };
//     Voice.onSpeechError = (e) => {
//       setError(e.error?.message || 'Error occurred');
//       setIsListening(false);
//     };

//     // Cleanup
//     return () => {
//       Voice.destroy().then(Voice.removeAllListeners);
//     };
//   }, []);

//   const startListening = async () => {
//     try {
//       await Voice.start('en-US');
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const stopListening = async () => {
//     try {
//       await Voice.stop();
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <TouchableOpacity
//         onPress={isListening ? stopListening : startListening}
//         style={{
//           padding: 16,
//           backgroundColor: isListening ? '#ff4444' : '#4444ff',
//           borderRadius: 8,
//         }}
//       >
//         <Text style={{ color: 'white', fontSize: 16 }}>
//           {isListening ? 'Stop Listening' : 'Start Listening'}
//         </Text>
//       </TouchableOpacity>

//       {recognizedText ? (
//         <Text style={{ marginTop: 20 }}>
//           Recognized: {recognizedText}
//         </Text>
//       ) : null}

//       {error ? (
//         <Text style={{ marginTop: 20, color: 'red' }}>
//           Error: {error}
//         </Text>
//       ) : null}
//     </View>
//   );
// };

// export default VoiceRecognition;