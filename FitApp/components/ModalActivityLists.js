import React, { useEffect, useState } from "react";
import { View, Modal, TouchableOpacity, Text, StyleSheet, FlatList,TextInput } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { firestore } from "../firebase/firebaseConfig";
import { serverTimestamp } from "firebase/firestore";

import * as SecureStore from 'expo-secure-store';

import stylesView from "../styles/view";

export default function ModalActivityLists({ toggleActivityGroupModal }) {
  const [days, setDays] = useState([
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi",
    "Pazar"

  ]);

  const [list,setList] = useState(null);
  
  const [userId,setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await SecureStore.getItemAsync('userId');
      if (storedUserId) {
        const userDoc = await firestore.collection('Users').doc(storedUserId).get(); 
        if (userDoc.exists) {
          setUserId(userDoc.id);
        } else {
          console.error('User document not found.');
        }
      } else {
        console.error('No userId in SecureStore.');
      }
    };
    fetchUserId();
  }, []);



  const handleRemove = (day) => {
    
  };

  const handleSave = async () => {
        if (list.trim() && userId) {
          try {
            await firestore.collection('Lists').add({
              userId: userId,
              text: list.trim(),
              createdAt: serverTimestamp(),
            });
      
            console.log('List saved');
            setList(''); 
          } catch (error) {
            console.error('Error saving list:', error);
          }
        } else {
          console.error('List text or userId is missing.');
        }
    
  };
  
  
  const handleAddDays = async () => {
    if (userId) {
      try {
        for (const [index, day] of days.entries()) {
          const docRef = firestore.collection('Lists').doc(); 
  
          await new Promise((resolve) => setTimeout(resolve, index * 1000)); 
  
          await docRef.set({
            userId: userId,
            text: day,
            createdAt: serverTimestamp(),
          });
  
          console.log(`${day} kaydedildi.`);
        }
        console.log('Tüm günler başarıyla kaydedildi.');
      } catch (error) {
        console.error('Günler kaydedilirken bir hata oluştu:', error);
      }
    } else {
      console.error('userId eksik.');
    }
  };
  

  return (
    <Modal transparent animationType="slide" onPress={toggleActivityGroupModal}>
      <View style={stylesView.ModalBackground} onPress={toggleActivityGroupModal}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleAddDays} style={styles.iconContainer}>
              <Ionicons name="calendar" size={24} color="white" />
              <Text style={styles.iconText}>Gün Ekle</Text>
            </TouchableOpacity>
            <Text style={styles.title}>AKTİVİTE LİSTELERİ</Text>
            <TouchableOpacity onPress={toggleActivityGroupModal} style={styles.iconContainer}>
              <Ionicons name="refresh" size={24} color="white" />
              <Text style={styles.iconText}>Sıfırla</Text>
            </TouchableOpacity>
          </View>

           
 
          <FlatList
            data={days}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={styles.dayItem}>
                <Text style={styles.dayText}>{item}</Text>
                <View style={styles.trashView}>
                  <TouchableOpacity onPress={() => handleRemove(item)}>
                    <Ionicons name="trash" size={20} color="white" />
                  </TouchableOpacity>
                </View>
                
              </View>
            )}
          />

          <View style={stylesView.GreenBorderVertical}>
            <TouchableOpacity onPress={handleSave}>
              <Ionicons name="add-outline" size={24} color="#7EDB13" style={{ marginRight: 8 }} />
            </TouchableOpacity>            
            <TextInput 
              style={styles.input} 
              placeholder="Liste Ekle" 
              placeholderTextColor="#7EDB13" 
              value={list}
              onChangeText={setList}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    minHeight: 200,
    backgroundColor: "#222",
    borderRadius: 10,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"space-between",
    marginBottom: 20,
    paddingHorizontal:10,
  },
  title: {
    color: "#7EDB13",
    fontSize: 20,
    fontWeight: "bold",
    alignSelf:"center",
    justifyContent:"center"
  },
  refreshButton: {
    right:10,
  },
  dayItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: '#807070',
    borderWidth:2,
    borderRadius: 20,
    padding: 8,
    marginBottom: 8,
  },
  dayText: {
    color: "white",
    fontSize: 16,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 8,
    justifyContent: "center",
  },
  addText: {
    color: "green",
    marginLeft: 10,
    fontSize: 16,
  },
  trashView: {
    borderColor: '#807070',
    borderWidth:2,
    borderRadius: 100,
    padding: 10,
  },
  input: {
    flex: 1,
    color: "#7EDB13",
    fontSize: 16,
    marginLeft: 10,
  },
  iconContainer: {
    alignItems: 'center', // İkon ve metni ortalamak için
  },
  iconText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5, // İkon ile metin arasındaki boşluk
  },
});
