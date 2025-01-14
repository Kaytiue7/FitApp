import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, TouchableOpacity,Image,Modal,ScrollView } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';



import { firestore } from '../firebase/firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Timestamp } from 'firebase/firestore';
import * as SecureStore from 'expo-secure-store';

import stylesButton from '../styles/buttons';
import stylesView from '../styles/view';
import stylesInput from '../styles/input';
import stylesText from '../styles/text';
import stylesMedia from '../styles/media';

export default function UserInformationFirst({navigation}) {

  const [isFocusedName, setIsFocusedName] = useState(false);
  const [isFocusedSurName, setIsFocusedSurName] = useState(false);
  const [isFocusedDay, setIsFocusedDay] = useState(false);
  const [isFocusedMonth, setIsFocusedMonth] = useState(false);
  const [isFocusedYear, setIsFocusedYear] = useState(false);
  const [isFocusedGender, setIsFocusedGender] = useState(false);
  const [isFocusedWeight, setIsFocusedWeight] = useState(false);
  const [isFocusedHeight, setIsFocusedHeight] = useState(false);
  const [isFocusedExperience, setIsFocusedExprience] = useState(false);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const [bannerUri, setBannerUri] = useState(null);
  const [profilePictureUri, setProfilePictureUri] = useState(null);
  const [name,setName ] = useState(null);
  const [surname,setSurname ] = useState(null);
  const [day,setDay ] = useState(null);
  const [month,setMonth ] = useState(null);
  const [year,setYear ] = useState(null);
  const [gender,setGender ] = useState(null);
  const [weight,setWeight ] = useState(null);
  const [height,setHeight ] = useState(null);
  const [experience,setExperiance ] = useState(null);

  const [userId,setUserId] = useState(null); 

  useEffect (() => {
    const fetchUserData = async () => {
      const userId = await SecureStore.getItemAsync('userId');
      if(userId){
        setUserId(userId)
        const userDoc = await firestore.collection('Users').doc(userId).get();

        if(userDoc.exists) {
          const userData = userDoc.data();
          setBannerUri(userData.bannerUri || "")
          setProfilePictureUri(userData.profilePictureUri || "")
          setName(userData.name || null)
          setSurname(userData.surname|| null)
          setGender(userData.gender || null)
          setWeight(userData.weight || null)
          setHeight(userData.height || null)
          setExperiance(userData.experience || null)

          if (userData.birthDate) {
            const birthDate = userData.birthDate.toDate(); 
            const day = birthDate.getDate() + 1;
            const month = birthDate.getMonth() + 1; // Ay (0 tabanlı, o yüzden 1 ekliyoruz)
            const year = birthDate.getFullYear(); 

            setDay(day);
            setMonth(month);
            setYear(year);
          }
        }
      }
    };

    fetchUserData();
  }, []);




  const pickImage = async (setImageUri) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: currentImage === 'banner' ? [16, 6] : [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
    setModalVisible(false);
  };

  const handleImagePress = (imageType) => {
    setCurrentImage(imageType);
    setModalVisible(true);
  };

  const handleRemoveImage = () => {
    if (currentImage === 'banner') setBannerUri(null);
    if (currentImage === 'profile') setProfilePictureUri(null);
    setModalVisible(false);
  };

  const calculateBMI = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height) / 100;

    if(!isNaN(weightNum) & !isNaN(heightNum) && heightNum > 0){
      return weightNum / (heightNum * heightNum);
    }
    return null;
  };

  const bmi = calculateBMI();
  let bmiMessage = '';
  let bmiColor = '#000';

  if (bmi) {
    if (bmi < 18.5) {
      bmiMessage = 'Vücüt Kitle Endeksiniz Düşük';
      bmiColor = 'yellow';
    } else if (bmi >= 18.5 && bmi < 24.9) {
      bmiMessage = 'Vücüt Kitle Endeksiniz Normal';
      bmiColor = 'green';
    } else {
      bmiMessage = 'Vücüt Kitle Endeksiniz Yüksek';
      bmiColor = 'red';
    }
  }

  const saveChanges = async () => {
    if (userId) {
      try {
        const updates = {};

        if (day && month && year) {
          const birthDate = new Date(year-1, month - 1, day);
          updates.birthDate = Timestamp.fromDate(birthDate); 
        }
  
        if (bannerUri) {
          const bannerBlob = await fetch(bannerUri).then((res) => res.blob());
          const bannerRef = ref(getStorage(), `_userProfilePictures/${userId}_banner.jpg`);
          await uploadBytes(bannerRef, bannerBlob);
          updates.bannerUri = await getDownloadURL(bannerRef);
        } else {
          updates.bannerUri = null;
        }
  
        if (profilePictureUri) {
          const profileBlob = await fetch(profilePictureUri).then((res) => res.blob());
          const profileRef = ref(getStorage(), `_userProfilePictures/${userId}_profile.jpg`);
          await uploadBytes(profileRef, profileBlob);
          updates.profilePictureUri = await getDownloadURL(profileRef);
        } else {
          updates.profilePictureUri = null; 
        }
  
        updates.name = name;
        updates.surname = surname;
        updates.gender = gender;
        updates.weight = weight;
        updates.height = height;
        updates.experience = experience;
  
        await firestore.collection('Users').doc(userId).update(updates);
        navigation.navigate('MainContainer');
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    }
  };


  return (
    <View style={{flex: 1, backgroundColor: '#2C2C2C', justifyContent: 'center',}}>
      <View style={stylesView.GreenHeader} />
      <ScrollView>
        <View style={{flex:1,paddingTop:36}}>
        <TouchableOpacity activeOpacity={0.5} onPress={() => handleImagePress('banner')}>
          <Image
            style={{ width: '100%', height: 150, backgroundColor: '#246ddd' }}
            source={{ uri: bannerUri || 'https://via.placeholder.com/800x300' }}
          />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} onPress={() => handleImagePress('profile')}>
          <Image
            style={[stylesMedia.ProfilePictureMega, { marginTop: -50, marginLeft: 20,borderColor: '#fff', borderWidth: 1.5,marginBottom:10}]}
            source={{ uri: profilePictureUri || 'https://via.placeholder.com/150' }}
          />
        </TouchableOpacity>
          <View style={{ marginHorizontal: 20, paddingHorizontal: 20,}}>
        
            <Text style={[stylesText.labelNotFocused, isFocusedName && stylesText.labelfocused]}>İsim</Text>
            <View style={[stylesInput.InputNotFocusedBorderStyle, isFocusedName && stylesInput.InputFocusedBorderStyle]}>
              <TextInput
                style={stylesInput.BorderedInputStyle}
                placeholder="İsim"
                placeholderTextColor="#888"
                onFocus={() => setIsFocusedName(true)}
                onBlur={() => setIsFocusedName(false)}
                value={name}
                onChangeText={setName}
                multiline
              />
            </View>

            <Text style={[stylesText.labelNotFocused, isFocusedSurName && stylesText.labelfocused]}>Soyisim</Text>
            <View style={[stylesInput.InputNotFocusedBorderStyle, isFocusedSurName && stylesInput.InputFocusedBorderStyle]}>
              <TextInput
                style={stylesInput.BorderedInputStyle}
                placeholder="Soyisim"
                placeholderTextColor="#888"
                onFocus={() => setIsFocusedSurName(true)}
                onBlur={() => setIsFocusedSurName(false)}
                value={surname}
                onChangeText={setSurname}
                multiline
              />
            </View>

            <View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
            {/* Gün */}
            <View style={{ width: '33%',paddingHorizontal:2}}>
              <Text style={[stylesText.labelNotFocused, isFocusedDay && stylesText.labelfocused]}>
                Gün
              </Text>
              <View
                style={[
                  stylesInput.InputNotFocusedBorderStyle,
                  isFocusedDay && stylesInput.InputFocusedBorderStyle,
                ]}
              >
                <TextInput
                  style={stylesInput.BorderedInputStyle}
                  keyboardType="numeric"
                  placeholder="Gün"
                  placeholderTextColor="#888"
                  onFocus={() => setIsFocusedDay(true)}
                  onBlur={() => setIsFocusedDay(false)}
                  value={day}
                  onChangeText={setDay}
                />
              </View>
            </View>

            {/* Ay */}
            <View style={{ width: '33%',paddingHorizontal:2}}>
              <Text style={[stylesText.labelNotFocused, isFocusedMonth && stylesText.labelfocused]}>
                Ay
              </Text>
              <View
                style={[
                  stylesInput.InputNotFocusedBorderStyle,
                  isFocusedMonth && stylesInput.InputFocusedBorderStyle,
                ]}
              >
                <TextInput
                  style={stylesInput.BorderedInputStyle}
                  keyboardType="numeric"
                  placeholder="Ay"
                  placeholderTextColor="#888"
                  onFocus={() => setIsFocusedMonth(true)}
                  onBlur={() => setIsFocusedMonth(false)}
                  value={month}
                  onChangeText={setMonth}
                />
              </View>
            </View>

            {/* Yıl */}
            <View style={{ width: '33%',paddingHorizontal:2}}>
              <Text style={[stylesText.labelNotFocused, isFocusedYear && stylesText.labelfocused]}>
                Yıl
              </Text>
              <View
                style={[
                  stylesInput.InputNotFocusedBorderStyle,
                  isFocusedYear && stylesInput.InputFocusedBorderStyle,
                ]}
              >
                <TextInput
                  style={stylesInput.BorderedInputStyle}
                  keyboardType="numeric"
                  placeholder="Yıl"
                  placeholderTextColor="#888"
                  onFocus={() => setIsFocusedYear(true)}
                  onBlur={() => setIsFocusedYear(false)}
                  value={year}
                  onChangeText={setYear}
                />
              </View>
            </View>
          </View>

          <Text style={[stylesText.labelNotFocused, isFocusedGender && stylesText.labelfocused]}>Soyisim</Text>
            <View style={[stylesInput.InputNotFocusedBorderStyle, isFocusedGender && stylesInput.InputFocusedBorderStyle]}>
            <Picker
                style={stylesInput.BorderedInputStyle}
                itemStyle={stylesInput.pickerItem}
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}>
                  <Picker.Item label='Cinsiyet Seçin...' value={null} enabled={false}/>
                  <Picker.Item label="Erkek" value="male" />
                  <Picker.Item label="Kadın" value="female" />
            </Picker>
            </View>


            <Text style={[stylesText.labelNotFocused, isFocusedWeight && stylesText.labelfocused]}>Kilo</Text>
            <View style={[stylesInput.InputNotFocusedBorderStyle, isFocusedWeight && stylesInput.InputFocusedBorderStyle]}>
              <TextInput
                style={stylesInput.BorderedInputStyle}
                keyboardType="numeric"
                placeholder="Kilo"
                placeholderTextColor="#888"
                onFocus={() => setIsFocusedWeight(true)}
                onBlur={() => setIsFocusedWeight(false)}
                value={weight}
                onChangeText={setWeight}
                multiline
              />
            </View>


            <Text style={[stylesText.labelNotFocused, isFocusedHeight && stylesText.labelfocused]}>Boy (cm)</Text>
            <View style={[stylesInput.InputNotFocusedBorderStyle, isFocusedHeight && stylesInput.InputFocusedBorderStyle]}>
              <TextInput
                style={stylesInput.BorderedInputStyle}
                keyboardType="numeric"
                placeholder="Boy"
                placeholderTextColor="#888"
                onFocus={() => setIsFocusedHeight(true)}
                onBlur={() => setIsFocusedHeight(false)}
                value={height}
                onChangeText={setHeight}
                multiline
              />
            </View>

            {bmi && (
            <Text style={{ color: bmiColor, fontSize: 14, marginVertical: 10, }}>
              Vücut Kitle İndeksiniz: {bmi.toFixed(1)} ({bmiMessage})
            </Text>
          )}


            <Text style={[stylesText.labelNotFocused, isFocusedExperience && stylesText.labelfocused]}>Deneyim</Text>
            <View style={[stylesInput.InputNotFocusedBorderStyle, isFocusedExperience && stylesInput.InputFocusedBorderStyle]}>
              <Picker
                style={stylesInput.BorderedInputStyle}
                itemStyle={stylesInput.pickerItem}
                selectedValue={experience}
                onValueChange={(itemValue) => setExperiance(itemValue)}>

                <Picker.Item label='Deneyim' value={null} enabled={false}/>
                <Picker.Item label="Engelli" value="Handicapped" />
                <Picker.Item label="Başlangıç" value="Beginner" />
                <Picker.Item label="Orta Düzey" value="Medium" />
                <Picker.Item label="Uzman" value="Expert" />


              </Picker>
            </View>

          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 20,marginVertical: 30}}>
          <TouchableOpacity style={stylesButton.BlueButton}>
            <Text style={{color: '#FFFFFF', fontWeight: 'bold',}}>Geç</Text>
          </TouchableOpacity>
          <TouchableOpacity style={stylesButton.GreenButton} onPress={saveChanges}>
            <Text style={{color: '#FFFFFF', fontWeight: 'bold',}}>Onayla</Text>
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>
      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <TouchableOpacity
          style={stylesView.ModalBackground}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={[stylesView.PopOutModal,{flexDirection:'row', justifyContent:'space-evenly'}]}>
            <View style={{flexDirection: 'column', alignItems: 'center',}}>
              <TouchableOpacity
                style={stylesButton.GreenCirclePickerButtonMega}
                onPress={() => pickImage(currentImage === 'banner' ? setBannerUri : setProfilePictureUri)}
              >
                <Ionicons name="image-outline" size={25} color="#FFF" />
              </TouchableOpacity>
              <Text style={[stylesText.greenSmall,{marginTop:5}]}>Galeriden Seç</Text>
            </View>

            <View style={{flexDirection: 'column', alignItems: 'center',}}>
              <TouchableOpacity style={stylesButton.RedCirclePickerButtonMega} onPress={handleRemoveImage}>
                <Ionicons name="trash-outline" size={25} color="#FFF" />
              </TouchableOpacity>
              <Text style={[stylesText.redSmall,{marginTop:5}]}>Resmi Sil</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

