import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  View,
  Button,
  TextInput
} from 'react-native';
import { Icon } from 'react-native-elements';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class HomeScreen extends React.Component {

  static navigationOptions = {
    title: "Password Recovery",
  };

  constructor()
  {
      super();
      this.state = {  email: '', serial:'', loading:false  }
  }

  handleEmail = () => {

    fetch('http://hwattsup.website/AppBackEnd/PasswordReset.php',
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
            serials : this.state.serial,
        })
    }).then((response) => response.json()).then((responseJson) =>
      {
      if(responseJson=="OK")
        alert("Your new password has been sent,\n please also check the spam folder", "me");
      else{
        alert("There was a problem sending the email, \n please try again later")
      }
      this.setState({ loading: false });
      }).catch((error) =>
      {
          console.error(error);
      });

  }

  ResetPass = () => {
    if (this.state.email.length > 0) {
      Alert.alert(
        'Reset Password?',
        'Are you sure you want to reset your password?? \n a new password will be sent to you by email',
        [{
            text: 'Yes',
            onPress: () => {
              this.setState({ loading: true}, () =>
              {
              fetch('https://hwattsup.website/AppBackEnd/NewPass.php', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: this.state.email,
                })

              }).then((response) => response.json()).then((responseJson) => {
                if (responseJson === "FALSE") {
                  alert("internet error,check connection and  try again later")
                    this.setState({ loading: false });
                } else if (responseJson === "EMAIL") {
                  alert("Are you sure you have an account with that email? try again")
                    this.setState({ loading: false });
                } else {
                  this.setState({
                    serial: responseJson
                  });
                  this.handleEmail();
                }
              }).catch((error) => {
                console.error(error);
              });
            });
          }
        },
          {
            text: 'No',
            onPress: () => console.log('OK Pressed'),
            style: 'cancel'
          },
        ], {
          cancelable: false
        }
      )
    } else {
      alert("Make sure you insert your email in the form")
    }
  }

render() {
  if(this.state.loading){
return (
  <View style={styles.center}>
    <Image style={styles.loader} source={require('../assets/images/giffy.gif')}/>
  </View>
);
  }
  else
  {
    return (
    <View style={styles.container}>
      <TextInput placeholderTextColor="white" placeholder="Your E-mail Address"
      style={styles.placeholder}
      onChangeText = {(text) => this.setState({ email: text })}/>
      <TouchableOpacity onPress={() => this.ResetPass()} style={styles.button}>
        <Text style={styles.header}>Recover Password</Text>
        <Icon
        containerStyle={styles.icon}
        size={25}
        color="white"
        name='ios-arrow-dropright'
        type='ionicon' />
      </TouchableOpacity>
    </View>
    );
 }
  }
}

const styles = StyleSheet.create({
placeholder:{
  borderBottomWidth:1,
  borderBottomColor:"rgba(255,255,255,0.8)",
  textAlign:'left',
  margin:15,
  fontSize:20,
  color:"white"
},
container: {
  paddingTop:40,
  height:hp("100%"),
  width:wp("100%"),
  backgroundColor:'#0067b1',
},
button:{
  margin:10,
  height:40,
  backgroundColor:"#9edd94",
},
header:{
  margin:5,
  fontSize:20,
  color:"white",
},
icon:{
  alignItems:"flex-end",
  marginRight:5,
  marginTop:-27.5,
},
center:{
    alignItems:'center',
},
loader:{
  flex: 1,
  position: 'absolute',
  width: 120,
  justifyContent: 'center',
  borderRadius:10,
  top:20,
}
});
