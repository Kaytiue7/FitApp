// NewScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput,Image,FlatList } from 'react-native';
 
import { firestore } from '../../../firebase/firebaseConfig';
import { serverTimestamp } from 'firebase/firestore';

import Ionicons from 'react-native-vector-icons/Ionicons';

import stylesView from '../../../styles/view';


import Header from './components/Header';
import Tabs from './components/Tabs';
import Tasks from './components/Tasks';
import AddTasks from './components/AddTask';

export default function TasksScreen() { 
  const [activeTab, setActiveTab] = useState('');
  

  return (
    <View style={styles.container}>

      <Header />
 
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab}/>

      <Tasks activeTab={activeTab} setActiveTab={setActiveTab}/>

      <AddTasks activeTab={activeTab} setActiveTab={setActiveTab}/>
 
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 10,
    paddingTop: 60,
    paddingBottom: 100,
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
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },
  dateText: {
    color: "#fff",
    fontSize: 25,
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