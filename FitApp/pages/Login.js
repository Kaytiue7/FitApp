import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Keyboard,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback
} from 'react-native';
import { firestore } from '../firebase/firebaseConfig.js';
import * as SecureStore from 'expo-secure-store';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import crypto from 'crypto-js';
import { MotiView } from 'moti';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import stylesButton from '../styles/buttons.js';
import stylesInput from '../styles/input.js';

const { width } = Dimensions.get('window');

const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity);

export default function LoginPage({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const buttonScale = useSharedValue(1);
  const formPosition = useSharedValue(width);
  const titlePosition = useSharedValue(-100);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    formPosition.value = withSpring(0, {
      damping: 15,
      stiffness: 90,
    });

    titlePosition.value = withSpring(0, {
      damping: 12,
      stiffness: 80,
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleLogin = useCallback(async () => {
    Keyboard.dismiss();
    if (!username || !password) {
      setError('Kullanıcı adı ve şifre gerekli!');
      setShowError(true);
      buttonScale.value = withSequence(
        withSpring(0.95),
        withSpring(1)
      );
      setTimeout(() => setShowError(false), 5000);
      return;
    }

    setIsLoading(true);
    buttonScale.value = withSequence(
      withSpring(0.9),
      withSpring(1.1),
      withSpring(1)
    );

    try {
      const hashedPassword = crypto.SHA256(password).toString(crypto.enc.Hex);

      const userSnapshot = await firestore
        .collection('Users')
        .where('username', '==', username.trim())
        .get();

      if (userSnapshot.empty) {
        setError('Kullanıcı bulunamadı.');
        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
        return;
      }

      let userId;
      let isValid = false;

      userSnapshot.forEach(doc => {
        const userData = doc.data();
        if (userData.password === hashedPassword) {
          userId = doc.id;
          isValid = userData.validity !== false;
        }
      });

      if (userId && isValid) {
        await SecureStore.setItemAsync('userId', userId);
        navigation.navigate('MainContainer');
      } else if (!isValid) {
        setError('Hesabınız geçerli değil. Lütfen yöneticinizle iletişime geçin.');
        setShowError(true);
      } else {
        setError('Şifre yanlış.');
        setShowError(true);
      }
    } catch (error) {
      console.error('Giriş hatası:', error);
      setError('Giriş sırasında bir hata oluştu.');
      setShowError(true);
    } finally {
      setIsLoading(false);
      setTimeout(() => setShowError(false), 5000);
    }
  }, [username, password, navigation]);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: formPosition.value }],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: titlePosition.value }],
  }));

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ImageBackground
          source={require('../assets/greenbg2.png')}
          style={styles.background}
        >
          <StatusBar style="light" />

          <Animated.Text style={[styles.title, titleAnimatedStyle]}>
            Daha sağlıklı bir yaşam için sen de bir adım at
          </Animated.Text>

          <Animated.View style={[
            styles.formContainer, 
            formAnimatedStyle,
            keyboardVisible && styles.formContainerKeyboardVisible
          ]}>
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', duration: 1000 }}
            >
              <BlurView intensity={60} style={styles.blurContainer}>
                <View style={styles.inputWrapper}>
                  <MaterialCommunityIcons
                    name="account-outline"
                    size={24}
                    color="#65A61B"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Kullanıcı Adı"
                    placeholderTextColor="#65A61B"
                    value={username}
                    onChangeText={(text) => {
                      setUsername(text);
                      setError('');
                    }}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <MaterialCommunityIcons
                    name="lock-outline"
                    size={24}
                    color="#65A61B"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Şifre"
                    placeholderTextColor="#65A61B"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setError('');
                    }}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <MaterialCommunityIcons
                      name={showPassword ? "eye-off" : "eye"}
                      size={24}
                      color="#65A61B"
                    />
                  </TouchableOpacity>
                </View>

                <AnimatedButton
                  style={[styles.loginButton, buttonAnimatedStyle]}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Giriş Yap</Text>
                  )}
                </AnimatedButton>

                <MotiView
                  from={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: 'timing', duration: 1000, delay: 500 }}
                >
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Register')}
                    style={styles.registerButton}
                  >
                    <Text style={styles.footerText}>
                      Hesabın yok mu?{' '}
                      <Text style={styles.registerHighlight}>Kayıt Ol</Text>
                    </Text>
                  </TouchableOpacity>
                </MotiView>
              </BlurView>
            </MotiView>
          </Animated.View>

          {showError && (
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: 20 }}
              style={styles.errorContainer}
            >
              <Text style={styles.errorText}>{error}</Text>
            </MotiView>
          )}
        </ImageBackground>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fbfbfb',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20%',
    paddingHorizontal: 40,
  },
  formContainer: {
    width: '90%',
    position: 'absolute',
    bottom: 60,
  },
  formContainerKeyboardVisible: {
    bottom: 20,
  },
  blurContainer: {
    borderRadius: 25,
    overflow: 'hidden',
    padding: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 55,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    height: '100%',
  },
  eyeIcon: {
    padding: 10,
  },
  loginButton: {
    backgroundColor: '#65A61B',
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#4f870f',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#7a7a7d',
    fontSize: 14,
  },
  registerHighlight: {
    color: '#65A61B',
    fontWeight: 'bold',
  },
  errorContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  errorText: {
    color: '#ff4444',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 10,
    fontSize: 14,
  },
});