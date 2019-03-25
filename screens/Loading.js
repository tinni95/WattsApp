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
  AsyncStorage
} from 'react-native';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {

  static navigationOptions = {
    header: null,
    navigation : null,
  };

  constructor()
  {
    super();
    this.state = {timePassed:false};
  }

  componentDidMount(){
    setTimeout(() => {this.setState({timePassed: true})}, 4000);
  }


  render() {
  const {navigate} = this.props.navigation;
  if(this.state.timePassed){

  }
  return (
  <View>
    <ImageBackground source={require('../assets/images/giphy.gif')}
    style={{width: '100%', height: '100%'}} resizeMode='cover'>
      <View style={styles.container}>
        <View style={styles.welcomeContainer}>
        <Image source={require('../assets/images/hwlogo.png')} style={styles.welcomeImage}/>
        </View>
      </View>
    </ImageBackground>
  </View>
      );
    }
  }

  const styles = StyleSheet.create({
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  welcomeImage: {
    width: 280,
    height: 500,
    resizeMode: 'contain',
  },
  });
