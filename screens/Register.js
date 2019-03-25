import React, { Component } from 'react';
import SelectInput from 'react-native-select-input-ios'
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
  Picker,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
import email from 'react-native-email';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Dropdown } from 'react-native-material-dropdown';
export default class HomeScreen extends React.Component {

constructor()
{
  super();
  this.state =
  {
   email: '',
   password: '',
   passwordCheck: '',
   fullname:'',
   name:'',
   surname:'',
   course:'',
   loading: false,
   register: false,
   hall:"Lord Thompson",
   serial:''
 }
}

onSubmitEditing(value1) {
  this.setState({
    value: value1
  })
}

Picker = () =>{
  let data = [
  {value: 'Off-Campus',},
  {value: 'Leonard Horner Hall',},
  {value: 'Lord Thompson Hall',},
  {value: 'Lord Home',},
  {value: 'Robert Bryson Hall',},
  {value: 'George Burnett',},
  {value: 'Christina Miller Hall',},
  {value: 'Muriel Spark Hall',},
  {value: 'Mary Fergusson Hall',},
  {value: 'Anna Macleod Hall',},
];
  return(
  <View>
    <Dropdown containerStyle={styles.dropdown} textColor="white" itemColor="black" selectedItemColor="black" baseColor="white" label='Select Hall' data={data}
    onChangeText = {(value) => this.setState({ hall: value })}/>
  </View>
);
}

TextInputs = () => {
  return(
  <View>
  <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
    <TextInput placeholderTextColor="rgba(255,255,255,0.8)" placeholder="Insert hw.ac.uk e-mail"
    style={styles.placeholder} onChangeText = {(text) => this.setState({ email: text })}/>
    <TextInput secureTextEntry={true} placeholderTextColor="rgba(255,255,255,0.8)" placeholder="Insert Password"
    style={styles.placeholder} onChangeText = {(text) => this.setState({ password: text })}/>
    <TextInput secureTextEntry={true} placeholderTextColor="rgba(255,255,255,0.8)" placeholder="Confirm Password"
    style={styles.placeholder} onChangeText = {(text) => this.setState({ passwordCheck: text })}/>
    <TextInput placeholderTextColor="rgba(255,255,255,0.8)" placeholder="Insert Name"
    style={styles.placeholder} onChangeText = {(text) => this.setState({ name: text })}/>
    <TextInput placeholderTextColor="rgba(255,255,255,0.8)" placeholder="Insert Surname"
    style={styles.placeholder} onChangeText = {(text) => this.setState({ surname: text })}/>
    <TextInput placeholderTextColor="rgba(255,255,255,0.8)" placeholder="Insert Course Name"
    style={styles.placeholder} onChangeText = {(text) => this.setState({ course: text })}/>
    {this.Picker()}
  </KeyboardAvoidingView>
  </View>
);
}

handleEmail = () => {
  this.setState({
    loading: true
  }, () => {
    fetch('http://hwattsup.website/AppBackEnd/ConfirmationEmail.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.email,
        serials: this.state.serial,
      })
    }).then((response) => response.json()).then((responseJson) => {
      if(responseJson=="OK")
        alert("The confirmation email has been sent,\n please also check the spam folder", "me");
      else{
        alert("There was a problem sending the email, \n please try again later")
      }
    }).catch((error) => {
      console.error(error);
    });
  });
}

validateEmail = () => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(this.state.email);
}
validateName = () => {
  var re = /[a-z]{1,10}/;
  return re.test(this.state.name);
}
validateSurname = () => {
  var re = /[a-z']{1,10}/;
  return re.test(this.state.surname);
}
validateCourse = () => {
  var re = /[a-z ]{1,50}/;
  return re.test(this.state.course);
}
validatePassword = () => {
  if(this.state.password==this.state.passwordCheck){
  var re = /(?=.*[0-9])/;
  return re.test(this.state.password);
  }
  else {return false}
}

validateInputs = () => {
  if(!this.validateEmail()){
    alert("Not a valid e-mail");
    return false;
  }
  else if(!this.validatePassword()){
     alert("Not a valid password, valid password need at least 1 numeric character\n also check the passwords match");
     return false;
  }
  else if(!this.validateName()){
     alert("Not a valid name");
     return false;
  }
  else if(!this.validateSurname()){
     alert("Not a valid surname");
     return false;
  }
  else if(!this.validateCourse()){
     alert("Not a valid course name");
     return false;
  }
  else return true
}

Register = () =>
{
  if(this.validateInputs())
  {
    this.setState({ loading: true}, () =>
    {
        fetch('http://hwattsup.website/AppBackEnd/register.php',
        {
            method: 'POST',
            headers:
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
            {
                fullname: this.state.name+" "+this.state.surname,
                course: this.state.course,
                email: this.state.email,
                password: this.state.password,
                Hall: this.state.hall
            })
        }).then((response) => response.json()).then((responseJson) =>
        {
        if(responseJson==="Try again"||responseJson==="meow"){
          alert("Try again","sorry");
        }
        else if(responseJson==="The e-mail appears already in use"){
          alert("Email Already In Use","sorry");
        }
        else if (responseJson==="not valid email"){
          alert("Email domain has to end in hw.ac.uk","sorry");
        }
        else{
          this.setState({serial:responseJson})
          this.handleEmail();
          this.setState({ loading: false});
          const {navigate} = this.props.navigation;
          navigate("Main");
        }
          this.setState({ loading: false});
          }).catch((error) =>
        {
          console.error(error);
          this.setState({ loading: false });
        });
    });
  }
}

confirmButton= () => {
 if(!this.state.loading){
   return(
   <TouchableOpacity onPress={()=>this.Register()}>
     <View>
        <Icon size={70} containerStyle={styles.arrow} color="white" name='ios-arrow-dropright' type='ionicon' />
     </View>
    </TouchableOpacity>
  );
 }
 else{
   return(
     <View>
        <Icon size={70} containerStyle={styles.arrow} color="white" name='ios-arrow-dropright' type='ionicon' />
     </View>
   );
 }
}

render() {
return (
<View style={styles.container2}>
 <ImageBackground source={ require('../assets/images/Register.png') } style={{width: '100%', height: '90%'}} resizeMode='cover'>
  <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
   <View>
      <View style={{marginTop:15}}>
        {this.TextInputs()}
      </View>
   </View>
  </ScrollView>
  {this.confirmButton()}
   </ImageBackground>
 </View>
    );
  }
}

const styles = StyleSheet.create({
center:{
  alignItems:'center',
},
container2: {
  backgroundColor:"#9edd94",
  height:hp("100%"),
  width:wp("100%"),
},
container: {
  height:hp("100%"),
  width:wp("100%"),
},
contentContainer: {
  paddingTop: 30,
},
welcomeContainer: {
  alignItems: 'center',
  marginTop: 10,
  marginBottom: 20,
},
welcomeImage: {
  width: "100%",
  height: "100%",
  resizeMode: 'contain',
  marginTop: 3,
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
helpLink: {
  marginTop:-50,
  width:wp("100%"),
},
helpLinkText: {
  marginTop:50,
  fontWeight:"bold",
  marginRight:15,
  fontSize: 32,
  color: 'white',
},
arrow:{
 left:("35%"),
 marginBottom:25
},
placeholder:{
  borderBottomWidth:1,
  borderBottomColor:"rgba(255,255,255,0.8)",
  textAlign:'left',
  margin:15,
  fontSize:20,
  color:"white"
  },
dropdown:{
  marginLeft:15,
  marginRight:15,
  marginTop:-13.5,
}
});
