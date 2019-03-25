import React from 'react';
import {
Alert,
Button,
Image,
ImageBackground,
Platform,
ScrollView,
StyleSheet,
Text,
TouchableOpacity,
View,
TextInput,
Animated,
RefreshControl,
Easing
} from 'react-native';
import moment from "moment";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { ListItem, Icon } from 'react-native-elements';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
import DateTimePicker from 'react-native-modal-datetime-picker';

class UselessTextInput extends React.Component {

  render() {
    return (
      <TextInput
        {...this.props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
        editable = {true}
        maxLength = {60}
      />
    );
  }
}

export default class LinksScreen extends React.Component {


  constructor()
  {
      super();
      this.state =
      {
        EventId:'',
        Title:'',
        description:'',
      }
  }

  submit = (EventId) => {
      this.setState({
        loading: true
      }, () => {
        fetch('https://hwattsup.website/AppBackEnd/Users2.php', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: this.state.EventId,
          })
        }).then((response) => response.json()).then((responseJson) => {
        if(responseJson["PushToken"][0].length==1||responseJson["PushToken"].length==0){
          alert("not enough people joined your event");
          return;
        }
        for (let i = 0; i < responseJson["PushToken"].length; i++){
          fetch('https://exp.host/--/api/v2/push/send',{
          method: 'POST',
          headers :
         {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          },
          body: JSON.stringify(
          {
           to : responseJson["PushToken"][i],
           sound : "default",
           title : "Notification for "+this.state.Title,
           body: this.state.description
         })
       });
     }
     alert("Sent");
        }).catch((error) => {
          console.error(error);
          this.setState({
            loading: false
          });
        });
      });

  }

  submitButton=() => {
    if(!this.state.loading){
      return(
      <TouchableOpacity onPress={()=>this.submit()}>
        <Icon containerStyle={{left:"40%"}} size={60} color="white" name='ios-arrow-forward' type='ionicon' />
      </TouchableOpacity>
      );
    }
    else{
      return(
        <View>
          <Icon containerStyle={{left:"40%"}} size={50} color="white" name='ios-arrow-forward' type='ionicon' />
        </View>
      );
    }
  }

componentDidMount(){
  const { navigation } = this.props;
  const Title=navigation.getParam('Title', 'NO-title');
  const EventId= navigation.getParam('ID', 'NO-ID');
  this.setState({EventId:EventId,Title:Title});
}

render() {
const { MAX_LENGTH } = 300;
const { navigation } = this.props;
return (
<View style={{backgroundColor:"#0067b1",height:"100%"}}>
  <ImageBackground source={require('../assets/images/notify.png')} style={{width: '100%', height: '98%'}} resizeMode='cover'>
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View>
        <View>
              <UselessTextInput multiline={true} numberOfLines={6} placeholder="Insert notification here.." placeholderTextColor="rgba(255,255,255,0.8)" value={this.state.description} style={styles.Description} onChangeText={(text)=> this.setState({ description: text })}/>
                <View style={styles.bottom}>
                  <Text style={styles.Counter}>{this.state.description.length}/60</Text>
                </View>
        </View>
      </View>
    </ScrollView>
    {this.submitButton()}
  </ImageBackground>
</View>
);
}
}
const styles = StyleSheet.create({
bottom:{
  position:"absolute",
  top:400,
  left:-90,
},
container: {
  flex: 1,
  height:2000
},
title: {
  fontSize:38,
  margin:10,
  fontWeight:'bold',
  color:'white',
},
Location: {
  fontSize:25,
  margin:10,
  fontWeight:'bold',
  color:'white',
},
Description:{
  textAlign:"center",
  color:'white',
  fontWeight:'bold',
  height:hp("30%"),
  marginTop:hp("5%"),
  fontSize:40,
  margin:5
},
Time: {
  margin:15,
  fontWeight:'bold',
  color:"white",
  fontSize:25
},
Date: {
  margin:15,
  fontWeight:'bold',
  color:"white",
  fontSize:25
},
Counter: {

  margin:10,
  marginLeft:100,
  fontWeight:'bold',
  color:"white",
  fontSize:18
},
});
