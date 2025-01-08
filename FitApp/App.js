import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator, ImageBackground } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';

import MainContainer from './navigation/MainContainer';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import UserInformationFirst from './pages/UserInformationFirst';



import { firestore } from './firebase/firebaseConfig';

const Stack = createStackNavigator();

export default function App() {
    const [initialRouteName, setInitialRouteName] = useState(null);
    

    useEffect(() => {
        

        const fetchInitialRoute = async () => {
            try {
                const userId = await SecureStore.getItemAsync('userId');
                console.log("userId: ", userId);
                if (!userId) {
                    setInitialRouteName('Login');
                    return;
                }

                const userDoc = await firestore.collection('Users').doc(userId).get();

                if (userDoc.exists) {
                    const userData = userDoc.data();
                    if (userData.validity !== false ) {
                        setInitialRouteName('MainContainer');
                    } else {
                        setInitialRouteName('Login');
                        console.log("validity false ise UserLoginType'a yönlendir: ", userId);
                    }
                } else {
                    setInitialRouteName('Login');
                    console.log("Kullanıcı verisi bulunamazsa UserLoginType'a yönlendir: ", userId);
                }
            } catch (error) {
                console.error("Hata oluştu:", error);
                setInitialRouteName('Login'); 
                console.log("Hata durumunda  Login'a yönlendir: ", userId);
            }
        };

        fetchInitialRoute();
    }, []);


    return (
       <NavigationContainer>
            <Stack.Navigator initialRouteName={initialRouteName}>  
                <Stack.Screen
                    name="Login"
                    component={LoginPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Register"
                    component={RegisterPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="UserInformationFirst"
                    component={UserInformationFirst}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="MainContainer"
                    component={MainContainer}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

function LoadingScreen() {
    return (
        <View style={{flex: 1, justifyContent: 'space-around',  alignItems: 'center', flexDirection:'column' }}>  
        <View></View>
            
            <ActivityIndicator size="large" color="#000"/>
        </View>
    );
}
//<ImageBackground style={{width:200,height:200,}}source={require('./assets/icon.png')}></ImageBackground>