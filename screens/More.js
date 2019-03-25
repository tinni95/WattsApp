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
  ImageBackground,
  Alert
} from 'react-native';
import { Icon } from 'react-native-elements';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
export default class HomeScreen extends React.Component {

deleteAccount = () => {
  const {navigate} = this.props.navigation;
  Alert.alert(
    'Delete Account?',
    'Are you sure you want to remove the account??',
    [{
        text: 'Yes',
        onPress: () => {
          fetch('https://hwattsup.website/AppBackEnd/RemoveAccount.php', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: global.userid,
            })

          }).then((response) => response.json()).then((responseJson) => {
            alert(responseJson, "apo");
            navigate("Login");
          }).catch((error) => {
            console.error(error);
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
  }


  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={()=> navigate("ChangeDetails")} style={styles.ChangeDetails}>
          <Icon size={50} color="white" name='ios-build' type='ionicon' />
          <Text style={styles.heading}>Change Details</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> navigate("ChangePassword")} style={styles.ChangePassword}>
          <Icon size={50} color="white" name='ios-lock' type='ionicon' />
          <Text style={styles.heading}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={ ()=> this.deleteAccount()} style={styles.DeleteAccount}>
          <Icon size={50} color="white" name='ios-close-circle-outline' type='ionicon' />
          <Text style={styles.heading}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    height:hp("100%"),
    width:wp("100%"),
    backgroundColor:'#0067b1',
  },
  heading:{
    marginLeft:20,
    fontSize:30,
    color:"white",
  },
  ChangeDetails:{
    flex: 1, flexDirection: 'row',
    justifyContent: 'center',
    alignItems: "center",
    height:200,
    backgroundColor:'#0067b1'
  },
  ChangePassword:{
    flex: 1, flexDirection: 'row',
    justifyContent: 'center',
    alignItems: "center",
    height:175,
    backgroundColor:'#9edd94'
  },
  DeleteAccount:{
    flex: 1, flexDirection: 'row',
    justifyContent: 'center',
    alignItems: "center",
    height:175,
    backgroundColor:'#ef4572'
  }
});
