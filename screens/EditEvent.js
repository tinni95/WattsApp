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
Easing,
KeyboardAvoidingView
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
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <TextInput
        {...this.props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
        editable = {true}
        maxLength = {300}
      />
      </KeyboardAvoidingView>
    );
  }
}


export default class LinksScreen extends React.Component {
  static navigationOptions = ({
      navigation
    }) => {
      return {
        headerRight: ( <
          Button onPress = {
            () => {
              Alert.alert(
                'Remove Event?',
                'Are you sure you want the event to be removed??',
                [{
                    text: 'Yes',
                    onPress: () => {
                      console.log(navigation.getParam('ID', 'NO-ID'));
                      fetch('https://hwattsup.website/AppBackEnd/RemoveEvent.php', {
                        method: 'POST',
                        headers: {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          eid: navigation.getParam('ID', 'NO-ID'),
                        })

                      }).then((response) => response.json()).then((responseJson) => {

                        alert(responseJson, "apo");
                        navigation.navigate("Links");
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
          }
          title = "Remove Event" /
          >
        ),
      };
  };
  constructor()
  {
      super();
      this.state =
      {
        isDatePickerVisible: false,
        isTimePickerVisible: false,
        description:"",
        date:"Date",
        time:"Time",
        location:"",
        title:"",
        eventId:""
      }
  }
  _showDatePicker = () => this.setState({ isDatePickerVisible: true });

  _hideDatePicker = () => this.setState({ isDatePickerVisible: false });

  _handleDatePicked = (dates) => {
    console.log('A date has been picked: ', dates);
    this._hideDatePicker();
    this.setState({date:moment(dates).format("YYYY-MM-DD")});

  };

  _showTimePicker = () => this.setState({ isTimePickerVisible: true });

  _hideTimePicker = () => this.setState({ isTimePickerVisible: false });

  _handleTimePicked = (dates) => {
    console.log('A date has been picked: ', dates);
    this._hideTimePicker();
    this.setState({time:moment(dates).format("HH:mm")});
  };

  submit = (EventId) => {
    if (this.state.description == "" || this.state.location == "" || this.state.date == "Date" || this.state.time == "Time" || this.state.title == "") {
      alert("All the Entry are Mandatory, please Fill in all of them and try again");
    } else {
      this.setState({
        loading: true
      }, () => {
        fetch('https://hwattsup.website/AppBackEnd/EditEvent.php', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: this.state.title,
            description: this.state.description,
            time: this.state.time,
            date: this.state.date,
            location: this.state.location,
            id: global.userid,
            eid: EventId,
          })
        }).then((response) => response.json()).then((responseJson) => {
          alert(responseJson, "apo");
          this.setState({
            loading: false
          });
        }).catch((error) => {
          console.error(error);
          this.setState({
            loading: false
          });
        });
      });
    }
  }

  submitButton=() => {
    if(!this.state.loading){
      return(
      <TouchableOpacity onPress={()=>this.submit(this.state.eventId)}>
        <Icon containerStyle={{left:"40%"}} size={50} color="white" name='ios-arrow-forward' type='ionicon' />
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
  const Title= navigation.getParam('Title', 'NO-ID');
  const Location= navigation.getParam('Location', 'NO-ID');
  const Date= navigation.getParam('Date', 'NO-ID');
  const Time= navigation.getParam('Time', 'NO-ID').substring(0,5);
  const Description= navigation.getParam('Description', 'NO-ID');
  const EventId= navigation.getParam('ID', 'NO-ID');
  this.setState({title:Title,location:Location,description:Description,time:Time,date:Date,eventId:EventId});
}

render() {
const { MAX_LENGTH } = 300;
const { navigation } = this.props;
return (
<View style={{backgroundColor:"#9edd94",height:"100%"}}>
  <ImageBackground source={require('../assets/images/Register.png')} style={{width: '100%', height: '98%'}} resizeMode='cover'>
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View>
        <View>
          <TextInput placeholderTextColor="rgba(255,255,255,0.8)" value={this.state.title} style={styles.title} onChangeText={(text)=> this.setState({ title: text })}/>
            <TouchableOpacity onPress={this._showTimePicker}>
              <View style={{flexDirection:"row"}}>
                <Icon containerStyle={{margin:10}} size={40} color="white" name='ios-clock' type='ionicon' />
                <Text style={styles.Time}>{this.state.time}</Text>
              </View>
            </TouchableOpacity>
            <DateTimePicker isVisible={this.state.isTimePickerVisible} onConfirm={this._handleTimePicked} onCancel={this._hideTimePicker} mode="time" />
            <TouchableOpacity onPress={this._showDatePicker}>
              <View style={{flexDirection:"row"}}>
                <Icon containerStyle={{margin:12}} size={40} color="white" name='ios-calendar' type='ionicon' />
                <Text style={styles.Date}>{this.state.date.substring(8,10)+"/"+this.state.date.substring(5,7)}</Text>
              </View>
            </TouchableOpacity>
            <DateTimePicker isVisible={this.state.isDatePickerVisible} onConfirm={this._handleDatePicked} onCancel={this._hideDatePicker} />
            <TextInput placeholderTextColor="rgba(255,255,255,0.8)" value={this.state.location} style={styles.Location} onChangeText={(text)=> this.setState({ location: text })}/>
              <UselessTextInput multiline={true} numberOfLines={6} placeholderTextColor="rgba(255,255,255,0.8)" value={this.state.description} style={styles.Description} onChangeText={(text)=> this.setState({ description: text })}/>
                <View style={styles.bottom}>
                  <Text style={styles.Counter}>{this.state.description.length}/300</Text>
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
  height:hp("15%"),
  marginTop:hp("5%"),
  fontSize:15,
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
