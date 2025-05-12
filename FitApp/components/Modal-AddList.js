import React, { useEffect, useState } from "react";
import { View, Modal, TouchableOpacity, Text, StyleSheet, FlatList, TextInput, Dimensions } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as SecureStore from 'expo-secure-store';
import stylesView from "../styles/view";

const { height } = Dimensions.get('window');

export default function ModalAddList({ toggleActivityGroupModal }) {
  const [days, setDays] = useState([
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi",
    "Pazar"
  ]);

  const [list, setList] = useState(""); 
  const [lists, setLists] = useState([]);

  // Listeyi SecureStore'dan al
  const fetchLists = async () => {
    try {
      const stored = await SecureStore.getItemAsync("lists");
      const parsed = stored ? JSON.parse(stored) : [];
      setLists(parsed);
    } catch (error) {
      console.error("Liste verisi alınamadı:", error);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  // Listeyi kaydet
  const handleSave = async () => {
    if (list.trim()) {
      try {
        const stored = await SecureStore.getItemAsync("lists");
        const parsedStored = stored ? JSON.parse(stored) : [];

        const newList = {
          text: list.trim(),
          createdAt: new Date().toISOString(),
        };

        await SecureStore.setItemAsync("lists", JSON.stringify([...parsedStored, newList]));
        setLists([...parsedStored, newList]);

        setList("");
        console.log("Liste SecureStore ile kaydedildi");
      } catch (error) {
        console.error("SecureStore ile kaydederken hata:", error);
      }
    } else {
      console.error("Liste metni boş.");
    }
  };

  // Günleri ekle
  const handleAddDays = async () => {
    try {
      const stored = await SecureStore.getItemAsync("lists");
      const parsed = stored ? JSON.parse(stored) : [];

      const newEntries = days.map((day) => ({
        text: day,
        createdAt: new Date().toISOString(),
      }));

      await SecureStore.setItemAsync("lists", JSON.stringify([...parsed, ...newEntries]));
      setLists([...parsed, ...newEntries]);

      console.log("Günler SecureStore ile kaydedildi.");
    } catch (error) {
      console.error("Günleri kaydederken hata:", error);
    }
  };

  // Listeyi sil
  const handleRemove = async (itemToRemove) => {
    try {
      const stored = await SecureStore.getItemAsync("lists");
      const parsed = stored ? JSON.parse(stored) : [];

      // Silme işlemi
      const updated = parsed.filter((item) => item.text !== itemToRemove.text);

      await SecureStore.setItemAsync("lists", JSON.stringify(updated));
      setLists(updated);

      console.log(`${itemToRemove.text} silindi.`);
    } catch (error) {
      console.error("Silme sırasında hata oluştu:", error);
    }
  };

  return (
    <Modal transparent animationType="slide" >
      <View style={styles.modalBackground} >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
           
            <TouchableOpacity onPress={toggleActivityGroupModal} style={styles.iconContainer}>
              <Ionicons name="close" size={32} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>AKTİVİTE LİSTELERİ</Text>
            <TouchableOpacity onPress={handleAddDays} style={styles.iconContainer}>
              <Ionicons name="calendar" size={24} color="white" />
              <Text style={styles.iconText}>Gün Ekle</Text>
            </TouchableOpacity>
          </View>

          {/* Listeyi göster */}
          <FlatList
            data={lists}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.dayItem}>
                <Text style={styles.dayText}>{item.text}</Text>
                <TouchableOpacity onPress={() => handleRemove(item)} style={styles.trashView}>
                  <Ionicons name="trash" size={20} color="white" />
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={styles.listContent}
          />

          <View style={[stylesView.GreenBorderVertical, styles.inputContainer]}>
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
    justifyContent: "flex-end",
  },
  modalContainer: {
    width: "100%",
    height: height * 0.7,
    backgroundColor: "#222",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(126, 219, 19, 0.3)",
  },
  title: {
    color: "#7EDB13",
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
  },
  iconContainer: {
    alignItems: "center",
  },
  iconText: {
    color: "white",
    fontSize: 12,
    marginTop: 5,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  dayItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#807070",
    borderWidth: 2,
    borderRadius: 20,
    padding: 8,
    marginBottom: 8,
  },
  dayText: {
    color: "white",
    fontSize: 16,
  },
  trashView: {
    padding: 8,
  },
  inputContainer: {
    marginTop: 'auto',
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    color: "#7EDB13",
    fontSize: 16,
    marginLeft: 10,
  },
});
