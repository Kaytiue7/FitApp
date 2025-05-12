import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';

import MainContainer from './navigation/MainContainer';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import UserInformationFirst from './pages/UserInformationFirst';

import { firestore } from './firebase/firebaseConfig';

const Stack = createStackNavigator();

global.userId = null;  

export default function App() {
    const [initialRouteName, setInitialRouteName] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInitialRoute = async () => {
            try {

                //await AsyncStorage.clear();
                const userId = await SecureStore.getItemAsync('userId');
                global.userId = userId; // GLOBAL'A ATADIK
                if (!userId) {
                    setInitialRouteName('Login');
                    setLoading(false);
                    return;
                }
                const userDoc = await firestore.collection('Users').doc(userId).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    if (userData.validity !== false) {
                        setInitialRouteName('MainContainer');
                    } else {
                        setInitialRouteName('Login');
                    }
                } else {
                    setInitialRouteName('Login');
                }
            } catch (error) {
                console.error("Hata oluştu:", error);
                setInitialRouteName('Login');
            }
            setLoading(false);
        };

        fetchInitialRoute();
    }, []);

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={initialRouteName}>
                <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={RegisterPage} options={{ headerShown: false }} />
                <Stack.Screen name="UserInformationFirst" component={UserInformationFirst} options={{ headerShown: false }} />
                <Stack.Screen name="MainContainer" component={MainContainer} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

function LoadingScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#000" />
        </View>
    );
}
