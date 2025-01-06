// MainContainer.js
import React, { useState } from 'react';
import { Image, TouchableOpacity, View,StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import TasksScreen from './screens/TasksScreen';
import ActivitiesScreen from './screens/ActivitiesScreen';
import FoodScreen from './screens/FoodScreen';
import AccountScreen from './screens/AccountScreen';

const tasksName = 'Görevlerim';
const activitiesName = 'Arama';
const foodName = 'Mesajlar';
const accountName = 'Hesap';

const Tab = createBottomTabNavigator();

export default function MainContainer() {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        initialRouteName={tasksName} // tasksName doğru şekilde burada tanımlı
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === tasksName) {
              iconName = focused ? 'home' : 'home-outline';
            } else if (rn === activitiesName) {
              iconName = focused ? 'search' : 'search-outline';
            } else if (rn === foodName) {
              iconName = focused ? 'mail' : 'mail-outline';
            } else if (rn === accountName) {
              iconName = focused ? 'person-circle' : 'person-circle-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: '#555555',
          tabBarStyle: styles.tabBar,
          headerStyle: styles.headerStyle,
          headerTitleAlign: 'center',
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

});
