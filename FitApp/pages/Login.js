import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground,StyleSheet } from 'react-native';
import { firestore } from '../firebase/firebaseConfig.js'; // Firestore bağlantısını doğru yapın
import * as SecureStore from 'expo-secure-store';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import crypto from 'crypto-js';

export default function LoginPage({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  const [showError, setShowError] = useState(false); 

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Kullanıcı adı ve şifre gerekli!');
      setShowError(true);
      setTimeout(() => setShowError(false), 5000); 
      return;
    }
  
    try {
      // Girilen şifreyi hashle
      const hashedPassword = crypto.SHA256(password).toString(crypto.enc.Hex);
      console.log("Hashlenmiş şifre (kayıt ve girişteki şifre):", hashedPassword);
  
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
        setTimeout(() => setShowError(false), 5000);
      } else {
        setError('Şifre yanlış.');
        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
      }
    } 
    catch (error) {
      console.error('Giriş hatası:', error);
      setError('Giriş sırasında bir hata oluştu.');
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/greenbg2.png')}
      style={styles.background}
    >
      <Text style={styles.title}>Daha sağlıklı bir yaşam için sen de bir adım at</Text>

      <View style={styles.overlay}>
        <BlurView intensity={50} style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Kullanıcı Adı"
            placeholderTextColor="#fff"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setError('');
            }}
          />
        </BlurView>

        <BlurView intensity={50} style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Şifre"
            placeholderTextColor="#fff"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError('');
            }}
          />
        </BlurView>

        

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Giriş Yap  →</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Hesabın yok mu?{' '}
          <TouchableOpacity ıd="registerButton" onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerText}>Kayıt Ol</Text>
          </TouchableOpacity>
        </Text>
      </View>

      <StatusBar style="light" />
      {showError && <Text style={styles.errorText}>{error}</Text>}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    position: 'absolute', 
    bottom: 0,  
    marginBottom: 80,
  },
  title: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
    marginBottom: '20%',
    paddingHorizontal: 40,
  },
  inputContainer: {
    width: 350,
    height: 55,
    marginBottom: 15,
    borderRadius: 20,
    overflow: 'hidden', 
  },
  input: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: 16,
  },
  button: {
    width: 350,
    height: 55,
    backgroundColor: '#0ae02c',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    color: 'rgba(0, 0, 0, 0.6)',
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    position: 'absolute',
    bottom: 10, // Sayfanın altına yerleştirmek için
    width: '100%',
  }
});
