import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { supabase } from '../lib/supabase';
import axios from 'axios';


const SignupPage = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const [error, setError] = useState(null);

  const signUpWithEmail = async () => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
      });

      if (error) {
        console.error("Error:", error.message);
        setError(error.message);
        Alert.alert('Error', error.message);
        return
      }

      let response = await axios.post('http://192.168.1.11:5000/api/signup', { uid: data.user.id, email: email, name: name })
      console.log(response)

      setError("Click on the link sent to your email to verify your account")
      Alert.alert('Success', 'Click on the link sent to your email to verify your account');
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    // <KeyboardAwareScrollView    >
    <ImageBackground
      source={{ uri: 'https://preview.redd.it/nature-phone-4k-wallpaper-download-link-in-bio-and-comments-v0-j8zgulpj3hed1.jpeg?width=1080&crop=smart&auto=webp&s=b0efad98daf5fcf51ae8e77c1cb3296455c2e8b1' }}
      style={styles.background} // resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Ionicons name="leaf-outline" size={40} color="#fff" />
            </View>
          </View>

          <Text style={styles.title}>Create an account</Text>

          {/* Form */}
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#rgba(255,255,255,0.8)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#rgba(255,255,255,0.8)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#rgba(255,255,255,0.8)"
              value={name}
              onChangeText={setName}
              keyboardType='text'
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={styles.signInButton}
            onPress={signUpWithEmail}
          // disabled={loading}
          >
            <Text style={styles.signInButtonText}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          {/* <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View> */}

          {/* Google Sign In */}
          {/* <TouchableOpacity style={styles.googleButton}>
            <Ionicons name="logo-google" size={20} color="#000" />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity> */}

          {/* Terms */}
          <Text style={styles.terms}>
            By continuing, you agree to Privacy Policy and{'\n'}Terms & Conditions
          </Text>

          {/* Login Link */}
            <TouchableOpacity
              style={styles.signupContainer}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.signupText}>Have an account?  </Text>
              <Text style={styles.signupLink}>Log in</Text>
            </TouchableOpacity> 
        </View>
      </SafeAreaView>
    </ImageBackground>
    //  </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    minHeight: "100%"
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  signInButton: {
    backgroundColor: '#075eec',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '600',
  },
  form: {
    marginBottom: 20,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dividerText: {
    color: '#fff',
    paddingHorizontal: 10,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    height: 50,
    paddingHorizontal: 20,
    marginBottom: 15,
    color: '#fff',
    fontSize: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
  },
  googleButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  terms: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 20,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
  },
  loginLink: {
    color: '#fff',
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  signupText: {
    color: '#fff',
    fontSize: 15,
  },
  signupLink: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default SignupPage;