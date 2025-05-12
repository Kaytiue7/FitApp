// Header.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { firestore } from '../../../../firebase/firebaseConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ModalActivityGroup from '../../../../components/Modal-AddList';

export default function Header() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [profilePictureUri, setProfilePictureUri] = useState('');
  const [userId, setUserId] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleActivityGroupModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await SecureStore.getItemAsync('userId');
        if (storedUserId) {
          const userDoc = await firestore.collection('Users').doc(storedUserId).get();
          if (userDoc.exists) {
            setUserId(userDoc.id);
            setName(userDoc.data().name);
            setSurname(userDoc.data().surname);
            setProfilePictureUri(userDoc.data().profilePictureUri ? userDoc.data().profilePictureUri : 'https://i.pinimg.com/736x/f9/01/3a/f9013aa26f5631336afbc4f44c7105b1.jpg');  
          } else {
            console.error('User document not found.');
          }
        } else {
          console.error('No userId in SecureStore.');
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };
    fetchUserId();
  }, []);

  return (
    <View style={styles.profileContainer}>
      <Image
        source={{ uri: profilePictureUri}} 
        style={styles.profileImage}
      />
      <Text style={styles.profileName}>{name} {surname}</Text>
      <TouchableOpacity 
        style={styles.navButtonGrayBiger} 
        onPress={toggleActivityGroupModal}
      >
        <Ionicons name="settings-outline" size={24} color="#fff" />
      </TouchableOpacity>

      {isModalVisible && (
        <ModalActivityGroup 
          toggleActivityGroupModal={toggleActivityGroupModal}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    width: "100%",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 20,
  },
  profileName: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },
  navButtonGrayBiger: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#24292e",
    borderWidth: 2,
    borderRadius: 25,
  },
});
