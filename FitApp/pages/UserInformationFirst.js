import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity,Image } from 'react-native';


import stylesButton from '../styles/buttons';
import stylesView from '../styles/view';
import stylesInput from '../styles/input';
import stylesText from '../styles/text';
import stylesMedia from '../styles/media';

export default function UserInformationFirst() {

  const [isFocusedName, setIsFocusedName] = useState(false);
  const [isFocusedSurName, setIsFocusedSurName] = useState(false);
  const [isFocusedDay, setIsFocusedDay] = useState(false);
  const [isFocusedMonth, setIsFocusedMonth] = useState(false);
  const [isFocusedYear, setIsFocusedYear] = useState(false);


  const [modalVisible, setModalVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const handleImagePress = (imageType) => {
    setCurrentImage(imageType);
    setModalVisible(true);
  };


  return (
    <View style={styles.container}>
      <View style={stylesView.GreenHeader} />
      <View style={{flex:1,paddingTop:36}}>
      <TouchableOpacity activeOpacity={0.5} onPress={() => handleImagePress('banner')}>
        <Image
          style={{ width: '100%', height: 150, backgroundColor: '#246ddd' }}
          source={{ uri:'https://via.placeholder.com/800x300' }}
        />
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.8} onPress={() => handleImagePress('profile')}>
        <Image
           style={[stylesMedia.ProfilePictureMega, { marginTop: -50, marginLeft: 20,borderColor: '#fff', borderWidth: 1.5,}]}
          source={{ uri: 'https://via.placeholder.com/150' }}
        />
      </TouchableOpacity>
        <View style={styles.form}>
      
          <Text style={[stylesText.labelNotFocused, isFocusedName && stylesText.labelfocused]}>İsim</Text>
          <View style={[stylesInput.InputNotFocusedBorderStyle, isFocusedName && stylesInput.InputFocusedBorderStyle]}>
            <TextInput
              style={stylesInput.BorderedInputStyle}
              placeholder="İsim"
              placeholderTextColor="#888"
              onFocus={() => setIsFocusedName(true)}
              onBlur={() => setIsFocusedName(false)}
              //value={bio}
              //onChangeText={setBio}
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
              //value={bio}
              //onChangeText={setBio}
              multiline
            />
          </View>

          <View>

        <Text style={[stylesText.labelNotFocused, { textAlign: 'center',marginTop:5 }]}>Doğum Tarihi</Text>
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
              />
            </View>
          </View>
        </View>
      </View>
      </View>
      <View style={[styles.buttons]}>
        <TouchableOpacity style={stylesButton.BlueButton}>
          <Text style={styles.buttonText}>Geç</Text>
        </TouchableOpacity>
        <TouchableOpacity style={stylesButton.GreenButton}>
          <Text style={styles.buttonText}>Onayla</Text>
        </TouchableOpacity>
      </View>
      </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2C2C',
    justifyContent: 'center',
  },
  header: {
    height: 36,
    backgroundColor: '#8BC34A',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1000, 
  },
  form: {
    marginHorizontal: 20,
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#8BC34A',
    marginBottom: 25,
    color: '#FFFFFF',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginTop: 30,
  },
  skipButton: {
    backgroundColor: '#2C7C97',
    padding: 15,
    borderRadius: 80,
    alignItems: 'center',
    width: 150,
  },
  confirmButton: {
    backgroundColor: '#65A61B',
    padding: 15,
    borderRadius: 80,
    alignItems: 'center',
    width: 150,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
