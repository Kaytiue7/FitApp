import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

    GreenButton: {
        backgroundColor: '#65A61B',
        padding: 15,
        borderRadius: 80,
        alignItems: 'center',
        width: 150,
      },
      GreenButtonLong: {
        backgroundColor: '#65A61B',
        padding: 15,
        borderRadius: 80,
        alignItems: 'center',
        width: 350,
        shadowColor:'#000',
        elevation:5,
      },
    
      BlueButton: {
        backgroundColor: '#2C7C97',
        padding: 15,
        borderRadius: 80,
        alignItems: 'center',
        width: 150,
      },







      GreenCirclePickerButtonMega: {
        width: 60,
        height: 60,
        borderRadius: 40,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowRadius: 10,
        elevation: 10,
      },

      RedCirclePickerButtonMega: {
        width: 60,
        height: 60,
        borderRadius: 40,
        backgroundColor: '#FF1700',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowRadius: 10,
        elevation: 10,
      },
});

export default styles;
