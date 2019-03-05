import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  TextInput
} from 'react-native';
import { Icon } from 'react-native-elements';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class HomeScreen extends React.Component {

  static navigationOptions = {
    title: "Change Password",
  };

  constructor()
  {
      super();
      this.state = {  password: '',passwordCheck: '',loading:false }
  }

ChangePassword = () => {
  if (this.state.password === this.state.passwordCheck && this.state.passwordCheck.length > 5) {
    this.setState({
      loading: true
    }, () => {
      fetch('http://gladiator1924.com/a/ChangePassword.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: global.userid,
          password: this.state.password,
        })

      }).then((response) => response.json()).then((responseJson) => {
        alert(responseJson, "");
        this.props.navigation.navigate("Links");
        this.setState({loading: false});
      }).catch((error) => {
        console.error(error);
      });
    });
  } else {
    alert("the passwords do not match or your password is too short", "");
  }
}

button = () => {
  if(!this.state.loading){
    return(
    <TouchableOpacity onPress={() => this.ChangePassword()} style={styles.button}>
      <Text style={styles.header}>Change Password</Text>
      <Icon containerStyle={styles.icon} size={25} color="white" name='ios-arrow-dropright' type='ionicon' />
    </TouchableOpacity>
    );
  }
  else{
    return(
    <View style={styles.button}>
      <Text style={styles.header}>Change Password</Text>
      <Icon containerStyle={styles.icon} size={25} color="white" name='ios-arrow-dropright' type='ionicon' />
    </View>
    );
  }
}

render() {
  return (
  <View style={styles.container}>
    <TextInput secureTextEntry={true} placeholderTextColor="white" placeholder="New Password" style={styles.placeholder} onChangeText={(text)=> this.setState({ password: text })}/>
      <TextInput secureTextEntry={true} placeholderTextColor="white" placeholder="Confirm Password" style={styles.placeholder} onChangeText={(text)=> this.setState({ passwordCheck: text })}/>
        {this.button()}
  </View>
  );
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
    paddingTop:5,
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
    padding:5,
    fontSize:20,
    color:"white",
  },
  icon:{
    alignItems:"flex-end",
    paddingRight:10,
    marginTop:-27.5,
  },
});
