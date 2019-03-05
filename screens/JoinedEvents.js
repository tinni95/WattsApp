import React from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  TextInput,
  RefreshControl,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { MonoText } from '../components/StyledText';
import moment from "moment";
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Container, Header, Content, Button } from 'native-base';
export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    header : null,
  };

constructor()
{
    super();
    this.state = { loaded:false, refreshing: false, data:[]}
}

componentDidMount(){
     this.PopEvents();
}


_onRefresh = () => {
  this.setState({refreshing: true});
  fetch('http://gladiator1924.com/a/JoinedEvents.php',
  {
    method: 'POST',
    headers:
    {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
    {
      id:global.userid,
    })
  }).then((response) => response.json()).then((responseJson) =>
  {
    this.setState({ data:responseJson});
  }).catch((error) =>
  {
    console.error(error);
  }).then(() => {
    this.setState({refreshing: false});
  }).catch((error) =>
  {
    console.error(error);
  });
}

refreshEvents = () =>
{
   this.PopEvents();
   this.renderEvents();
}

PopEvents = () =>
{
  fetch('http://gladiator1924.com/a/JoinedEvents.php', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: global.userid,
    })
  }).then((response) => response.json()).then((responseJson) => {
    this.setState({
      loaded: true,
      data: responseJson
    });
  }).catch((error) => {
    console.error(error);
  });
}
CalculateEntry = (entry,counter,i) =>
{
if(counter==1){
  return entry;
}
else{
  return entry[i];
}
}

renderEvents = () =>{
  const {navigate} = this.props.navigation;
  let events = [];
  var counter;
  if(this.state.data["Title"][0].length==1){
    counter=1;
  }
  else{
    counter=this.state.data["Title"].length;
  }
  for (let i = 0; i < counter; i++) {
    events.push(<TouchableOpacity onPress = { () => navigate("EventPage",{
    Title:this.CalculateEntry(this.state.data["Title"],counter,i),
    Location:this.CalculateEntry(this.state.data["Location"],counter,i),
    Date:this.CalculateEntry(this.state.data["Date"],counter,i),
    Time:this.CalculateEntry(this.state.data["Time"],counter,i),
    Description:this.CalculateEntry(this.state.data["Description"],counter,i),
    ID:this.CalculateEntry(this.state.data["EID"],counter,i),
  })
}>
<View style={styles.DiscoverContainer}>
  <Image style={styles.DiscoverImage} source={ require('../assets/images/mamma.jpg') } />
  <Image style={styles.UserImage} source={{uri:this.CalculateEntry(this.state.data["Image"],counter,i)}} />
  <Text style={styles.Title}> {this.CalculateEntry(this.state.data["Title"],counter,i)}</Text>
  <Text style={styles.Owner}> Hosted By: {this.CalculateEntry(this.state.data["FullName"],counter,i)}</Text>
  <View style={styles.footer}>
    <Text style={styles.Location}>@
    {
      this.CalculateEntry(this.state.data["Location"],counter,i).length>25 ?
      this.CalculateEntry(this.state.data["Location"],counter,i).substring(0,25)+"..":
      this.CalculateEntry(this.state.data["Location"],counter,i)
    }
    </Text>
    <View style={styles.DateAndTime}>
      <View style={{flexDirection:"row"}}>
        <Icon containerStyle={{marginRight:14, marginTop:-6}} size={35} color="black" name='ios-calendar' type='ionicon' />
        <Text style={styles.Date}>{(this.CalculateEntry(this.state.data["Date"],counter,i).substring(8,10))+"/"+(this.CalculateEntry(this.state.data["Date"],counter,i).substring(5,7))}</Text>
      </View>
      <View style={{flexDirection:"row"}}>
        <Icon containerStyle={{marginTop:-6}} size={35} color="black" name='ios-clock' type='ionicon' />
        <Text style={styles.Time}>{this.CalculateEntry(this.state.data["Time"],counter,i).substring(0,5)}</Text>
      </View>
    </View>
  </View>
</View>
</TouchableOpacity>
  );
}
return events
}

render() {
const {navigate} = this.props.navigation;
if (!this.state.loaded)
{
return(
<View style={{alignItems:"center",flex: 1,justifyContent: 'center'}}>
 <Image style={styles.loader} source={require('../assets/images/giffy.gif')}/>
</View>
);
}
else if(!this.state.data["Title"]){
return (
<View style={styles.container}>
<ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh}/>}
style={styles.container} contentContainerStyle={styles.contentContainer}>
    <View style={styles.welcomeContainer}>
      <Image source={require('../assets/images/heriot-watt-opac.png')} style={styles.welcomeImage}/>
    </View>
    <View style={styles.getStartedContainer}>
      <Text style={styles.getStartedText}>The events you join will appear on this page</Text>
    </View>
    <View style={styles.helpContainer}>
    </View>
  </ScrollView>
  <View style={styles.tabBarInfoContainer}>
    <Text style={styles.tabBarInfoText}>Go to Discover to find and join new events</Text>
  </View>
</View>
);
}
else{
return (
<View style={styles.container}>
 <ScrollView refreshControl={
      <RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={this._onRefresh}
      />
    }
      style={styles.container} contentContainerStyle={styles.contentContainer}>
     <View style={styles.headerContainer}>
     <Text style={styles.header}>Coming Up For You..</Text>
     </View>
    {this.renderEvents()}
 </ScrollView>
</View>
  );
}
}
}
const styles = StyleSheet.create({
UserImage:{
  width:100,
  height:100,
  position:"absolute",
  right:10,
  borderRadius:50,
  top:95,
},
DiscoverImage:{
  backgroundColor: '#ccc',
  flex: 1,
  position: 'absolute',
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  borderRadius:10,
},
container: {
  flex: 1,
  zIndex:999,
},
contentContainer:{
  paddingTop:15,
},
headerContainer: {
  margin:15,
},
DiscoverContainer: {
  margin:10,
  height:300,
  borderRadius:10,
  borderWidth: 1,
  borderColor: 'gray',
  backgroundColor:'blue',
},
header: {
  fontSize:32,
  margin:10,
  fontWeight:'bold',
},
Title: {
  fontSize:30,
  margin:10,
  fontWeight:'bold',
  color:'white',
},
Owner: {
  fontSize:17,
  marginLeft:12.5,
  color:'white',
},
Location: {
  fontSize:22,
  marginLeft:10,
  marginBottom:5,
  color:'black',
  fontWeight:'bold',
},
Time: {
  fontSize:22,
  color:'black',
  marginLeft:15,
  marginRight:10,
  marginBottom:5,
  fontWeight:'bold',
},
Date:{
  fontSize:22,
  color:'black',
  fontWeight:'bold',
},
footer:{
  marginTop:135,
},
container: {
  flex: 1,
  backgroundColor: '#fff',
},
contentContainer: {
  paddingTop: 30,
},
welcomeContainer: {
  alignItems: 'center',
  marginTop: 50,
  marginBottom: 20,
},
welcomeImage: {
  width: 200,
  height: 160,
  resizeMode: 'contain',
  marginTop: 3,
  marginLeft: -10,
},
getStartedContainer: {
  alignItems: 'center',
  marginHorizontal: 50,
},
getStartedText: {
  fontSize: 17,
  color: 'rgba(96,100,109, 1)',
  lineHeight: 24,
  textAlign: 'center',
},
tabBarInfoContainer: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  ...Platform.select({
    ios: {
     shadowColor: 'black',
     shadowOffset: { height: -3 },
     shadowOpacity: 0.1,
     shadowRadius: 3,
    },
    android: {
     elevation: 20,
    },
  }),
  alignItems: 'center',
  backgroundColor: '#fbfbfb',
  paddingVertical: 20,
},
tabBarInfoText: {
  fontSize: 17,
  color: 'rgba(96,100,109, 1)',
  textAlign: 'center',
},
helpContainer: {
  marginTop: 15,
  alignItems: 'center',
},
DateAndTime: {
  flexDirection: 'row',
  paddingLeft:10,
  paddingTop:15,
  justifyContent:'space-between'
}
});
