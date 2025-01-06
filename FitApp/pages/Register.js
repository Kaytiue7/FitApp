import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground,StyleSheet } from 'react-native';
import { firestore } from '../firebase/firebaseConfig.js'; // Firestore bağlantısını doğru yapın
import { serverTimestamp } from 'firebase/firestore';
import * as SecureStore from 'expo-secure-store';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import crypto from 'crypto-js';

export default function RegisterPage({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);
    const [confirm, setConfirm] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
  
    const handleInputChange = (text, type) => {
      const regex = /^[a-zA-Z0-9_.]+$/;
  
      if (regex.test(text) || text === '') {
        if (type === 'username') {
          setUsername(text);
        } else if (type === 'password') {
          setPassword(text);
        }
      }
    };
  
    const handleRegister = async () => {
      if (!username || !password) {
        setError('Kullanıcı adı ve şifre gerekli!');
        setShowError(true);
        setTimeout(() => setShowError(false), 5000); 
        return;
      }
  
      const usernameRegex = /^[a-zA-Z0-9_.]+$/;
      if (!usernameRegex.test(username)) {
        setError('Kullanıcı adı veya şifre geçersiz karakter içeriyor.');
        setShowError(true);
        setTimeout(() => setShowError(false), 5000); 
        return;
      }
  
      try {
        const usernameSnapshot = await firestore
        .collection('Users')
        .where('username', '==', username)
        .get();
  
      if (!usernameSnapshot.empty) {
        setError('Bu kullanıcı adı zaten alınmış.');
        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
        return;
      }
        const hashedPassword = crypto.SHA256(password).toString(crypto.enc.Hex);
  
        const userDoc = await firestore.collection('Users').add({
          username: username.trim(),
          password: hashedPassword,
          createdAt: serverTimestamp(),
          validity: true,
        });
  
        await SecureStore.setItemAsync('userId', userDoc.id);
  
        setError('');  
        setShowError(false);
        setConfirm('Kayıt Başarılı!');
        setShowConfirm(true);
        setTimeout(() => {
          navigation.navigate('MainContainer'); 
        }, 3000); 
      } catch (error) {
        console.error('Kayıt hatası:', error);
        setError('Kayıt sırasında bir hata oluştu.');
        setShowError(true);
        setTimeout(() => setShowError(false), 5000); 
      }
    };

  return (
    <ImageBackground
      source={require('../assets/greenbg2.png')}
      style={styles.background}
    >
      <Text style={styles.title}>Sağlıklı bir yaşamın ilk adımları</Text>

      <View style={styles.overlay}>
        <BlurView intensity={50} style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Kullanıcı Adı"
            placeholderTextColor="#fff"
            value={username}
          onChangeText={(text) => handleInputChange(text, 'username')} 
          />
        </BlurView>

        <BlurView intensity={50} style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Şifre"
            placeholderTextColor="#fff"
            secureTextEntry
            value={password}
          onChangeText={(text) => handleInputChange(text, 'password')} 
          />
        </BlurView>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Kayıt Ol  →</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Zaten bir hesabın var mı?{' '}
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Giriş Yap</Text>
          </TouchableOpacity>
        </Text>
      </View>

      <StatusBar style="light" />
      {showConfirm && <Text style={styles.confirmText}>{confirm}</Text>}
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
  },
  confirmText: {
    color: '#8bc34a',
    fontWeight: 'bold',
    position: 'absolute',
    bottom: "5%",
    left: 20,
    right: 20,
    textAlign: 'center',
  },
});
