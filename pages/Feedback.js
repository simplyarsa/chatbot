import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const FeedbackScreen = () => {
  const [feedback, setFeedback] = useState('');
  const maxCharacters = 300;

  const handleSubmit = () => {
    if (feedback.trim().length === 0) {
      Alert.alert('Error', 'Feedback cannot be empty!');
    } else {
      Alert.alert('Thank You!', 'Your feedback has been submitted.');
      setFeedback(''); // Clear the input
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>We value your feedback!</Text>

      {/* Feedback Input */}
      <TextInput
        style={styles.textInput}
        placeholder="Enter your feedback here..."
        multiline
        maxLength={maxCharacters}
        value={feedback}
        onChangeText={(text) => setFeedback(text)}
      />

      {/* Character Counter */}
      <Text style={styles.characterCounter}>
        {feedback.length} / {maxCharacters} characters
      </Text>

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      {/* Horizontal Rule */}
      <View style={styles.horizontalRule} />

      {/* Contact Details */}
      <Text style={styles.contactText}>
        For more details, contact us at: <Text style={styles.email}>support@example.com</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    height: 100, // Ensures only 5 lines are visible (assuming lineHeight = 20)
    lineHeight: 20, // Adjust the line height for consistent spacing
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9',
  },
  characterCounter: {
    textAlign: 'right',
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  horizontalRule: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  contactText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  email: {
    fontWeight: 'bold',
    color: '#007BFF',
  },
});

export default FeedbackScreen;
