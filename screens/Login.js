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
  AsyncStorage,
} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
export default class HomeScreen extends React.Component {
static navigationOptions = {
  header: null,
  navigation : null,
};

constructor()
{
  super();
  this.state = { email: '', password: '', loading: false, register: false}
}

body= () =>{
const {navigate} = this.props.navigation;
if(!this.state.loading){
return (
<View>
  <TextInput style={styles.placeholder} placeholder="E-mail" placeholderTextColor="rgba(255,255,255,0.8)" onChangeText={(text)=> this.setState({ email: text })}/>
    <TextInput secureTextEntry={true} style={styles.placeholder} placeholder="Password" placeholderTextColor="rgba(255,255,255,0.8)" onChangeText={(text)=> this.setState({ password: text })}/>
      <View style={styles.separator}>
        <View style={styles.forgotPassword}>
          <Button onPress={()=> navigate("Password")}
            title="Password Forgot?"
            color="black"
            />
        </View>
      </View>
      <View style={styles.bottom}>
        <TouchableOpacity onPress={()=> navigate("Register")} style={styles.registerButton}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> this.login()} style={styles.loginButton}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
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

login = () =>
{
this.setState({ loading: true}, () =>
{
  fetch('http://hwattsup.website/AppBackEnd/login.php',
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
        style={styles.welcomeImage}
      />
    {this.body()}
    </View>
  </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
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
    marginBottom:hp("25%")
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
   height:hp("100%"),
   width:wp("100%"),
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
bottom:{
  flex: 1,
  flexDirection: 'row',
  alignItems: 'stretch',
  justifyContent: 'center',
   },
loginButton:{
  alignItems:"center",
  paddingTop:15,
  width:200,
  backgroundColor:'#9edd94'
},
registerButton:{
  alignItems:"center",
  paddingTop:15,
  width:200,
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
