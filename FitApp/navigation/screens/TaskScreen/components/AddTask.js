import React, { useState,useEffect } from 'react';

import { View, TextInput, TouchableOpacity,StyleSheet } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { firestore } from '../../../../firebase/firebaseConfig';

import { serverTimestamp } from 'firebase/firestore';

import SecureStore from 'expo-secure-store';

export default function AddTasks({activeTab, setActiveTab}) {

  const [task, setTask] = useState('');
  const [userId,setUserId] = useState(global.userId);
 
  const saveTask = async () => {
    if (task.trim()) {
      try {
        await firestore.collection('Tasks').add({
          userId: userId,
          text: task.trim(),
          category: activeTab,
          createdAt: serverTimestamp(),
          time: 0,
          isCompleted: false,
        });
   
        console.log('Task saved');
        setTask(''); 
      } catch (error) {
        console.error('Error saving data:', error);
      }
    } else {
      console.error('Task text or userId is missing.');
    }
  };

  return(
      <>
        <View style={styles.GreenBorder}>
          <TouchableOpacity onPress={saveTask}>
            <Ionicons name="add-outline" size={24} color="#7EDB13" style={{ marginRight: 8 }} />
          </TouchableOpacity>
          
          <TextInput 
            style={styles.input} 
            placeholder="Görev Ekle" 
            placeholderTextColor="#7EDB13" 
            value={task}
            onChangeText={setTask}
          />
        </View>
      </>
  )
}

const styles = {
  GreenBorder: {
    alignSelf: 'center',
    width: '90%', 
    borderColor: '#7EDB13',
    borderWidth: 2,
    borderRadius: 20,
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  
  input: {
    flex: 1,
    color: "#7EDB13",
    fontSize: 16,
    marginLeft: 5,
  },
};