import React from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
    navigation : null,
  };

render() {
const {navigate} = this.props.navigation;
global.userid=1;
return (
<TouchableOpacity onPress={() => navigate("Then")} >
  <ImageBackground source={require('../assets/images/giphy.gif')}
  style={{width: '100%', height: '100%'}} resizeMode='cover'>
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
      <Image source={require('../assets/images/hwlogo.png')} style={styles.welcomeImage}/>
      </View>
    </View>
  </ImageBackground>
</TouchableOpacity>
    );
  }

}

const styles = StyleSheet.create({
welcomeContainer: {
  alignItems: 'center',
  marginTop: 90,
},
welcomeImage: {
  width: 320,
  height: 500,
  resizeMode: 'contain',
},
});
