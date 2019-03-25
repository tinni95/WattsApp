import React, { Component } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Picker,
  Button,
  Alert,
  TouchableHighlight,
  AsyncStorage,
} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import { Permissions, Notifications, Location, TaskManager } from 'expo';

const LOCATION_TASK_NAME = 'background-location-task';
export default class Login extends React.Component {
  static navigationOptions = {
    header: null,
    navigation : null,
  };

  constructor()
  {
    super();
    this.state = { email: '', password: '', loading: false, register: false}
  }

  componentWillUnmount() {
  this.listener && this.listener.remove();
  }
  componentDidMount(){
  this._retrieveData();
  }
  _retrieveData = async () => {
    const {navigate} = this.props.navigation;
      try {
        const value = await AsyncStorage.getItem('userid');
        if (value !== null) {
          // We have data!!
          global.userid=value;
          navigate("Then");
          console.log(value);
        }
        else{
          navigate("Login");
        }
      } catch (error) {
      console.log(error);
      }
    }

  handleNotification = ({ origin, data }) => {
    console.log(
      `Push notification ${origin} with data: ${JSON.stringify(data)}`,
    );
  };



  registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    console.log("something");
    let finalStatus = existingStatus;
    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }
    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();

    fetch('https://hwattsup.website/AppBackEnd/Push.php',
    {
        method: 'POST',
        headers:
        {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
        {
            id: global.userid,
            Push: token
        })
    }).then((response) => response.json()).then((responseJson) =>
    {
    if(responseJson==="NO"){

    }
    else{
    }
      this.setState({ loading: false});
      }).catch((error) =>
    {
      console.error(error);
      this.setState({ loading: false });
    });
  };


  body= () => {
  const {navigate} = this.props.navigation;
  if(!this.state.loading){
  return (
  <View>
    <TextInput style={styles.placeholder} placeholder="E-mail" placeholderTextColor="rgba(255,255,255,0.8)" onChangeText={(text)=> this.setState({ email: text })}/>
      <TextInput secureTextEntry={true} style={styles.placeholder} placeholder="Password" placeholderTextColor="rgba(255,255,255,0.8)" onChangeText={(text)=> this.setState({ password: text })}/>
        <View style={styles.separator}>
          <View style={styles.forgotPassword}>
            <Button onPress={()=> navigate("Password")} title="Password Forgot?" color="black"/>
          </View>
        </View>
        <View style={styles.bottom}>

        </View>
  </View>
  );
  }
  else{
  return (
  <View style={styles.center}>
    <Image style={styles.loader} source={require('../assets/images/giffy.gif')}/>
  </View>
    );
  }
    }

  _storeData = async () => {
    try {
      await AsyncStorage.setItem('userid', global.userid);
    } catch (error) {
      // Error saving data
    }
  }

login = () =>
{
this.setState({ loading: true}, () =>
{
  fetch('https://hwattsup.website/AppBackEnd/login.php',
  {
      method: 'POST',
      headers:
      {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(
      {
          email: this.state.email,
          password: this.state.password
      })

  }).then((response) => response.json()).then((responseJson) =>
  {
  if(responseJson==="Try again"||responseJson==="meow" ){
    alert("Oops, something went wrong \n please try again","sorry");
  }
  else if(responseJson =="You Have to confirm your e-mail first"){
    alert("accept your email","sorry");
  }
  else {
  global.userid=responseJson;
  this._storeData();
  this.registerForPushNotificationsAsync();
  this.listener = Expo.Notifications.addListener(this.handleNotification);
  const {navigate} = this.props.navigation;
  navigate("Then");
  }
      this.setState({ loading: false});
  }).catch((error) =>
  {
      console.error(error);
      this.setState({ loading: false });
  });
  });
  }


  render() {
  const {navigate} = this.props.navigation;
  return (
  <View style={styles.container}>
    <View style={styles.welcomeContainer}>
      <Image source={require('../assets/images/heriot-watt.png')}
        style={styles.welcomeImage}/>
    </View>
    {this.body()}
  <TouchableHighlight onPress={()=> navigate("Register")} style={styles.registerButton}>
    <Text style={styles.buttonText}>Register</Text>
  </TouchableHighlight>
  <TouchableOpacity onPress={()=> this.login()} style={styles.loginButton}>
    <Text style={styles.buttonText}>Login</Text>
  </TouchableOpacity>
  </View>
    );
  }
}

const styles = StyleSheet.create({
  center:{
    alignItems:"center",
    flex: 1,
    justifyContent: 'center'
  },
  forgotPassword:{
    backgroundColor:'#rgba(255, 255, 255, 0.6)',
    width:200,
    borderRadius:50,
    marginBottom:hp("20%")
  },
  placeholder:{
    borderBottomWidth:1,
    borderBottomColor:"rgba(255,255,255,0.8)",
    textAlign:'center',
    margin:6,
    fontSize:30,
    color:"white"
  },
  separator:{
      marginTop:25,
      alignItems: 'center',
  },
  center:{
      alignItems:'center',
  },
  centertwo:{
     flex: 1,
     flexDirection: 'column',
     justifyContent: 'space-between',
  },
  container: {
   height:("100%"),
   backgroundColor:'#0067b1',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeImage: {
    marginTop:hp("10%"),
    height: hp("30%"),
    width:wp("70%"),
    marginLeft: -10,
  },
  navigationFilename: {
    marginTop: 20,
  },
  helpContainer: {
    marginTop: 25,
    alignItems: 'center',
      borderRadius: 25,
  },
loginButton:{
  alignItems:"center",
  position: 'absolute',
  bottom:-10,
  right:0,
  width:"50%",
  height:100,
  paddingTop:20,
  backgroundColor:'#9edd94'
},
registerButton:{
  alignItems:"center",
  height:100,
  paddingTop:20,
  position: 'absolute',
  bottom:-10,
  left:0,
  width:"50%",
  backgroundColor:'#ef4572'
},
buttonText:{
  color:"white",
  fontSize:22,
},
loader:{
  flex: 1,
  position: 'absolute',
  width: 120,
  justifyContent: 'center',
  borderRadius:10,
  top:20,
}
}
);
