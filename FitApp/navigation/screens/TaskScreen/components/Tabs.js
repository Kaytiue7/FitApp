import { useEffect, useState } from "react";

import { StyleSheet, View, Text, TouchableOpacity, FlatList} from "react-native";

import Ionicons from 'react-native-vector-icons/Ionicons';
 

import * as SecureStore from 'expo-secure-store';

 


export default function Main({activeTab, setActiveTab}) {

    const [tabs, setTabs] = useState([]); 

    const [userId,setUserId] = useState(global.userId);

    const [localLists, setLocalLists] = useState([]);

    const [date, setDate] = useState('');

    //Anlık tarih
    useEffect(() => {
        const currentDate = new Date(); 
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        const formattedDate = new Intl.DateTimeFormat('tr-TR', options).format(currentDate);
        setDate(formattedDate);
      }, []);

    //Tab'ları çekme
    useEffect(() => {
      const fetchLocalLists = async () => {
        try {
          const stored = await SecureStore.getItemAsync('lists');
          const parsed = stored ? JSON.parse(stored) : [];
          setLocalLists(parsed);
        } catch (error) {
          console.error('SecureStore verileri alınırken hata:', error);
        }

        console.log('localLists: ',localLists)
      };
    
      fetchLocalLists();
    }, [global.isActivityTabsModalVisible]);
 
    //Tab render fonksiyonu
    const renderTab = ({ item }) => (
        <TouchableOpacity
            key={item.id}
            style={styles.tabItem}
            onPress={() => setActiveTab(item.id)}
          >
            <Text style={[styles.tabText, activeTab === item.id && styles.activeTabText]}> 
              {item.text} 
            </Text>
            {activeTab === item.id && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
    );

    return(
      <>
        <View style={{justifyContent:'space-around',flexDirection:'row'}}>
          <TouchableOpacity style={styles.navButton} >
            <Ionicons name="arrow-back-outline" size={16} color="#fff" />
          </TouchableOpacity>
         
          <Text style={styles.dateText}>{date}</Text>
         
          <TouchableOpacity style={styles.navButton} >
            <Ionicons name="arrow-forward-outline" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.navigationContainer}>
          <View style={styles.tabsContainer}>
            <FlatList
              horizontal
              data={localLists}
              renderItem={renderTab}
              keyExtractor={(item, index) => index.toString()}
              showsHorizantalScrollIndicator={false}
            />
          </View>
        </View>
      </>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 10,
  }, 
  dateText: {
    color: "#fff",
    fontSize: 25,
    marginBottom: 10,
  },
  navigationContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  }, 
  tabsContainer: {
    flexDirection: "row",
    width: "full",
    justifyContent: "space-between",
    gap: 4,
  }, 
  tabItem: {
    alignItems: "center",
    flex: 1,
    minWidth: 80,
  },
  tabText: {
    color: "#888",
    fontSize: 16,
    paddingHorizontal: 5,
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "semibold",
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
  navButton: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#65A61B",
    borderWidth: 1,
    borderRadius: 20,
  },  
});