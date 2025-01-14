// MainContainer.js
import React, { useState } from 'react';
import { Image, TouchableOpacity, View,StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import TasksScreen from './screens/TasksScreen';
import ActivitiesScreen from './screens/ActivitiesScreen';
import FoodScreen from './screens/FoodScreen';
import AccountScreen from './screens/AccountScreen';

import stylesView from '../styles/view';

const tasksName = 'Görevlerim';
const activitiesName = 'Aktiviteler';
const foodName = 'Food Body';
const accountName = 'Hesap';

const Tab = createBottomTabNavigator();

export default function MainContainer() {
  return (
    <View style={styles.container}>
     <Tab.Navigator
      initialRouteName={tasksName}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;

          if (rn === tasksName) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (rn === activitiesName) {
            iconName = focused ? 'reader' : 'reader-outline';
          } else if (rn === foodName) {
            iconName = focused ? 'fast-food' : 'fast-food-outline';
          } else if (rn === accountName) {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#555555',
        tabBarStyle: styles.tabBar,
        headerStyle: styles.headerStyle,
        tabBarIconStyle: styles.tabBarIconStyle,
        headerTitleAlign: 'center',
        tabBarItemStyle: styles.tabBarItem,
        tabBarHideOnKeyboard: true, // Klavye açıldığında TabBar sabit kalır
      })}
      >
        <Tab.Screen name={tasksName} component={TasksScreen} options={{ headerShown: true }} />
        <Tab.Screen name={activitiesName} component={ActivitiesScreen} options={{ headerShown: true }} />
        <Tab.Screen name={foodName} component={FoodScreen} options={{ headerShown: true }} />
        <Tab.Screen name={accountName} component={AccountScreen} options={{ headerShown: true }} />
      </Tab.Navigator>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Ana arka plan rengi
  },
  tabBar: {
    position: 'absolute',
    bottom: 25, 
    backgroundColor: '#7EDB13', 
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    borderCurve: 'continuous',
    shadowColor: '#7EDB13',
    shadowOffset: {width: 0, height: 10},
    shadowRadius: 10,
    shadowOpacity: 0.2,
    elevation: 5,
    
  },
  headerStyle: {
    backgroundColor: '#fff',
    shadowOpacity: 1,
    shadowColor: '#000',
    elevation: 10,
    height:32,
  },
});