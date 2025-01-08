import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

    //Blur TextBox

    BlurViewContainer: {
      width: 350,
      height: 55,
      marginBottom: 15,
      borderRadius: 20,
      overflow: 'hidden', 
      
    },
    BlurInputContainer: {
      width: '100%',
      height: '100%',
      paddingHorizontal: 15,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: 'rgba(0, 0, 0, 0.7)',
      fontSize: 16,
      
    },


    //focus input

    BorderedInputStyle: {
      backgroundColor: 'transparent',
      color: '#FFF',
      padding: 12,
      borderRadius: 8,
      fontSize: 16,
      
    },
    InputNotFocusedBorderStyle: {
      borderWidth: 2,
      borderColor: '#65A61B',
      borderRadius: 8,
      marginBottom: 10,
    },
    InputFocusedBorderStyle: {
      borderColor: '#246DDD',
    },
});

export default styles;
