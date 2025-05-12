// MainContainer.js
import React, { useState, useCallback } from 'react';
import { Image, TouchableOpacity, View, StyleSheet, Dimensions, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  interpolate,
  useSharedValue
} from 'react-native-reanimated';

import TasksScreen from './screens/TaskScreen/TasksScreen';
import ActivitiesScreen from './screens/ActivitiesScreen';
import FoodScreen from './screens/FoodScreen';
import AccountScreen from './screens/AccountScreen';

import stylesView from '../styles/view';

const { width, height } = Dimensions.get('window');

const tasksName = 'Görevlerim';
const activitiesName = 'Aktiviteler';
const foodName = 'Food Body';
const accountName = 'Hesap';

const Tab = createBottomTabNavigator();

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function MainContainer() {
  const tabBarHeight = useSharedValue(60);
  const tabBarOpacity = useSharedValue(1);

  const tabBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: tabBarHeight.value,
      opacity: tabBarOpacity.value,
    };
  });

  const getTabBarIcon = useCallback((route, focused, color, size) => {
    let iconName;

    switch (route.name) {
      case tasksName:
        iconName = focused ? 'home' : 'home-outline';
        break;
      case activitiesName:
        iconName = focused ? 'reader' : 'reader-outline';
        break;
      case foodName:
        iconName = focused ? 'fast-food' : 'fast-food-outline';
        break;
      case accountName:
        iconName = focused ? 'person-circle' : 'person-circle-outline';
        break;
      default:
        iconName = 'home-outline';
    }

    return (
      <Animated.View>
        <Ionicons name={iconName} size={size} color={color} />
      </Animated.View>
    );
  }, []);

  return (
    <View style={styles.container}>
      <Tab.Navigator
        initialRouteName={tasksName}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => getTabBarIcon(route, focused, color, size),
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
          tabBarStyle: styles.tabBar,
          headerStyle: styles.headerStyle,
          tabBarIconStyle: styles.tabBarIconStyle,
          headerTitleAlign: 'center',
          tabBarItemStyle: styles.tabBarItem,
          // tabBarHideOnKeyboard: true,
          tabBarBackground: () => (
            <AnimatedBlurView
              intensity={80}
              tint="dark"
              style={[styles.tabBarBackground, tabBarAnimatedStyle]}
            />
          ),
        })}
      >
        <Tab.Screen 
          name={tasksName} 
          component={TasksScreen} 
          options={{ 
            headerShown: false, 
          }} 
        />
        <Tab.Screen 
          name={activitiesName} 
          component={ActivitiesScreen} 
          options={{ 
            headerShown: false, 
          }} 
        />
        <Tab.Screen 
          name={foodName} 
          component={FoodScreen} 
          options={{ 
            headerShown: false,  
          }} 
        />
        <Tab.Screen 
          name={accountName} 
          component={AccountScreen} 
          options={{ 
            headerShown: false,  
          }} 
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  tabBar: {
    position: 'absolute',
    backgroundColor: 'transparent',
    margin: 20,
    borderRadius: 25,
    borderCurve: 'continuous',
    shadowColor: '#7EDB13',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 50,
    shadowOpacity: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 60,
    elevation: 5,
    overflow: 'hidden',
  },
  tabBarBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(126, 219, 19, 1)',
    
  },
  headerStyle: {
    height: 0,
  },  
  tabBarItem: {
    padding: 0,
  },
  tabBarIconStyle: {
    marginTop: 5,
    alignSelf: 'center',
  },
});