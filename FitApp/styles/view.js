import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

    GreenHeader: {
        height: 36,
        backgroundColor: '#8BC34A',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000, 
        shadowOpacity: 1,
        shadowColor: '#000',
        elevation: 10,
      },
      WhiteHeader: {
        backgroundColor: '#fff',
        shadowOpacity: 1,
        shadowColor: '#000',
        elevation: 10,
        height:36,
      },
      ModalBackground:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      PopOutModal: {
        backgroundColor: '#222',
        padding: 20,
        width:'90%',
        borderRadius: 15,
        shadowColor: '#3d3d3d',
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 10,
      },
      GreenBorder: {
        position: 'absolute',
        bottom: 80, 
        alignSelf: 'center',
        width: '90%', 
        height: 55,
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 20,
        flexDirection: 'row', // Yatay hizalama
        alignItems: 'center', // Dikey ortalama
        paddingHorizontal: 10, // Sağ ve sol boşluk
      }
});

export default styles;
