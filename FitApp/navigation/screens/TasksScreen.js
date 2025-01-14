// NewScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput,Image } from 'react-native';

import * as SecureStore from 'expo-secure-store';

import { firestore } from '../../firebase/firebaseConfig';
import { serverTimestamp } from 'firebase/firestore';

import Ionicons from 'react-native-vector-icons/Ionicons';

import stylesView from '../../styles/view';

export default function TasksScreen() {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [task, setTask] = useState('');

  const [userId, setUserId] = useState('');
  
  const [name,setName]= useState('');
  const [surname,setSurname]= useState('');
  const [profilePictureUri,setProfilePictureUri]= useState('');

  const [date, setDate] = useState('');

  

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await SecureStore.getItemAsync('userId');
      if (storedUserId) {
        const userDoc = await firestore.collection('Users').doc(storedUserId).get(); 
        if (userDoc.exists) {
          setUserId(userDoc.id);
          setName(userDoc.data().name);
          setSurname(userDoc.data().surname);
          setProfilePictureUri(userDoc.data().profilePictureUri);

        } else {
          console.error('User document not found.');
        }
      } else {
        console.error('No userId in SecureStore.');
      }
    };
    fetchUserId();
  }, []);


  useEffect(() => {
    const fetchTabs = async () => {
      try {
        const snapshot = await firestore.collection('Days').get();
        const fetchedTabs = snapshot.docs.map((doc) => doc.data().activityName);
        setTabs(fetchedTabs.slice(0, 5));
        if (fetchedTabs.length > 0) setActiveTab(fetchedTabs[0]);
      } catch (error) {
        console.error('Error fetching tabs:', error);
      }
    };

    fetchTabs();
  }, []);

  useEffect(() => {

    const currentDate = new Date(); 
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('tr-TR', options).format(currentDate);
    setDate(formattedDate);
  }, []);

  const handleNext = () => {
    if (tabs.length > 0) {
      const newTabs = [...tabs.slice(1), tabs[0]];
      setTabs(newTabs);
      setActiveTab(newTabs[0]);
    }
  };

  const handlePrevious = () => {
    if (tabs.length > 0) {
      const newTabs = [tabs[tabs.length - 1], ...tabs.slice(0, -1)];
      setTabs(newTabs);
      setActiveTab(newTabs[0]);
    }
  };

  const saveTask = async () => {
    if (task.trim() && userId) {
      try {
        await firestore.collection('Tasks').add({
          userId: userId,
          text: task.trim(),
          createdAt: serverTimestamp(),
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

  return (
    <View style={styles.container}>
    <View style={styles.profileContainer}>
        <Image
          source={{
            uri: profilePictureUri,
          }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{name} {surname}</Text>
        <TouchableOpacity style={styles.navButtonGrayBiger}>
          <Ionicons name="filter-outline" size={24} color="#fff" style={styles.filterIcon} />
        </TouchableOpacity>
      </View>


      <View style={{justifyContent:'space-around',flexDirection:'row'}}>
        <TouchableOpacity style={styles.navButton} onPress={handlePrevious}>
          <Ionicons name="arrow-back-outline" size={16} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.dateText}>{date}</Text>

        <TouchableOpacity style={styles.navButton} onPress={handleNext}>
          <Ionicons name="arrow-forward-outline" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Navigasyon Bölgesi */}
      <View style={styles.navigationContainer}>
        <View style={styles.tabContainer}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={styles.tabItem}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
              {activeTab === tab && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.navButtonGray}>
          <Ionicons name="settings-outline" size={14} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={stylesView.GreenBorder}>
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

     
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 10,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 20,
  },
  profileName: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  dateText: {
    color: "#fff",
    fontSize: 22,
    marginBottom: 10,
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  tabContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  tabItem: {
    alignItems: "center",
    flex: 1,
  },
  tabText: {
    color: "#888",
    fontSize: 14,
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  activeIndicator: {
    width: "60%",
    height: 2,
    backgroundColor: "#65A61B",
    marginTop: 5,
  },
  navButtonGray: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#24292e",
    borderWidth: 1.5,
    borderRadius: 20,
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
  navButton: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#65A61B",
    borderWidth: 1,
    borderRadius: 20,
  },
  addTaskContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F1F1F",
    borderRadius: 5,
    padding: 10,
  },
  input: {
    flex: 1,
    color: "#7EDB13",
    fontSize: 16,
    marginLeft: 10,
  },
});