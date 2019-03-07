import React from 'react';
import {
Alert,
Image,
ImageBackground,
Platform,
ScrollView,
StyleSheet,
Text,
TouchableOpacity,
View,
TextInput,
RefreshControl,
Easing
} from 'react-native';
import moment from "moment";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { ListItem, Icon } from 'react-native-elements';
import { Permissions, Calendar } from 'expo';
import { MonoText } from '../components/StyledText';


export default class LinksScreen extends React.Component {

constructor()
{
super();
this.state =
{
   loading:false,
   refreshing:false,
   loaded: false,
   loaded2: false,
   data:'',
   face:"ios-sad",
   color:"#4b4f4d",
   id:""
 };
}

_onRefresh = (eventid) =>
{
this.setState({refreshing: true});
fetch('http://gladiator1924.com/a/Users.php',
{
    method: 'POST',
    headers:
    {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
    {
      id : eventid,
    })
}).then((response) => response.json()).then((responseJson) =>
{
    this.setState({refreshing:false, data:responseJson});
}).catch((error) =>
{
    console.error(error);
});
}

PopUsers = (eventid) => {
  fetch('http://gladiator1924.com/a/Users.php', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: eventid,
    })
  }).then((response) => response.json()).then((responseJson) => {
    this.setState({
      data: responseJson
    });
    this.setState({
      loaded2: true
    });
  }).catch((error) => {
    console.error(error);
  });
}
usersNumber = () =>
{
if (this.state.data=="EMPTY"){
  return 0;
}
else if(this.state.data["FullName"][0].length==1){
  return 1;
}
else {
  return this.state.data["FullName"].length;}
}

PopFace = (eventid) =>
{
fetch('http://gladiator1924.com/a/isJoined.php',
{
    method: 'POST',
    headers:
    {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    },
    body: JSON.stringify(
    {
     Userid : global.userid,
     Eventid : eventid,
    })

}).then((response) => response.json()).then((responseJson) =>
{
    if(responseJson==="YES"){
      this.setState({face:"ios-happy"});
      this.setState({color:"#72ffba"});
    }
    else{
      this.setState({face:"ios-sad"});
      this.setState({color:"#4b4f4d"});
    }
    this.setState({loaded:true});
}).catch((error) =>
{
    console.error(error);
});
}

faceSwap = (EventId) => {
this.setState({
loading: true
});
if (this.state.face == "ios-sad") {
fetch('http://gladiator1924.com/a/JoinEvent.php', {
method: 'POST',
headers: {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
},
body: JSON.stringify({
  Userid: global.userid,
  Eventid: EventId,
})
}).then((response) => response.json()).then((responseJson) => {
if (responseJson === "YES") {
  this.setState({
    face: "ios-happy"
  });
  this.setState({
    color: "#72ffba"
  });
  this.setState({
    loading: false
  });
  alert("event joined", "");
}
}).catch((error) => {
  console.error(error);
});
}
else {
fetch('http://gladiator1924.com/a/UnjoinEvent.php', {
method: 'POST',
headers: {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
},
body: JSON.stringify({
  Userid: global.userid,
  Eventid: EventId,
})

}).then((response) => response.json()).then((responseJson) => {
if (responseJson === "NO") {
  this.setState({
    face: "ios-sad"
  });
  this.setState({
    color: "#4b4f4d"
  });
  this.setState({
    loading: false
  });
  alert("Event left", "");
}
}).catch((error) => {
console.error(error);
});
}
}

DateAndTime= (Time,Date) => {
  return(
    <View style={styles.DateAndTime}>
      <View style={{flexDirection: 'row'}}>
        <Icon containerStyle={{marginRight:wp("2%")}} size={35} color="#4a4b4c" name='ios-calendar' type='ionicon' />
        <Text style={styles.Date}>{moment(Date).format("DD/MM")}</Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Icon containerStyle={{marginLeft:wp("40%")}} size={35} color="#4a4b4c" name='ios-clock' type='ionicon' />
        <Text style={styles.Time}>{Time}</Text>
      </View>
    </View>
  );
}

attending= ()=>{
  const {navigate} = this.props.navigation;
  const list = this.renderUsers();
  return(
  <ScrollView style={styles.Attending} >
  {
    list.map((l, i) => (
    <TouchableOpacity onPress={()=>navigate("UserOnEvent",{ID:this.state.data["ID"][i]})}>
      <ListItem titleStyle={{color:"#4a4b4c"}} subtitleStyle={{color:"#4a4b4c"}} containerStyle={{ borderBottomColor: '#4a4b4c' }} chevronColor="#4a4b4c" key={i} avatar={<Image source={{uri:l.avatar_url}}
        style={{width:50,height:50,borderRadius:25}} />}
      title={l.name}
      subtitle={l.subtitle}
      />
    </TouchableOpacity>
    ))
  }
  </ScrollView>
  );
}

body= ()=>{
const { navigation } = this.props;
const {navigate} = this.props.navigation;
const EventId= navigation.getParam('ID', 'NO-ID');
const Title= navigation.getParam('Title', 'NO-ID');
const Location= navigation.getParam('Location', 'NO-ID');
const Date= navigation.getParam('Date', 'NO-ID');
const Time= navigation.getParam('Time', 'NO-ID').substring(0,5);
const Description= navigation.getParam('Description', 'NO-ID');
return(
<ScrollView refreshControl={ <RefreshControl refreshing={this.state.refreshing} onRefresh={()=> this._onRefresh(EventId)}/>}>
  <View>
    <Text style={styles.Title}>{Title}</Text>
    <View style={styles.separation}>
      <Text style={styles.Location}>@{Location}</Text>
      {this.DateAndTime(Time,Date)}
      <Text style={styles.Description}>{Description}</Text>
      <View>
        <View style={styles.attendingHeader}>
          <Icon size={35} color="#72ffba" containerStyle={{marginTop:-4,marginRight:2}} name='ios-people' type='ionicon' />
          <Text style={styles.AttendingText}>{this.usersNumber()} People Attending</Text>
        </View>
        {this.attending()}
      </View>
    </View>
  </View>
</ScrollView>);
}

renderUsers = () => {
  let list = [];
  if (this.state.data == "EMPTY" || this.state.data == "") {
    return list
  } else if (this.state.data["FullName"][0].length == 1) {
    list.push({
      name: this.state.data["FullName"],
      avatar_url: this.state.data["Image"],
      subtitle: this.state.data["Course"],
      id: this.state.data["id"],
    })
  } else {
    for (let i = 0; i < this.state.data["FullName"].length; i++) {
      list.push({
        name: this.state.data["FullName"][i],
        avatar_url: this.state.data["Image"][i],
        subtitle: this.state.data["Course"][i],
        id: this.state.data["id"],
      })
    }
  }
  return list
}

faceButton = (EventId) => {
  if(!this.state.loading){
    return(
      <TouchableOpacity style={{height:85}} onPress={()=> this.faceSwap(EventId)} >
        <Icon containerStyle={{left:("40%"),marginTop:20}} size={60} color="white" name={this.state.face} type='ionicon' />
      </TouchableOpacity>
    );
    }
  else{
      return(
        <View style={{height:85}}>
          <Icon containerStyle={{left:("40%"),marginTop:20}} size={60} color="white" name={this.state.face} type='ionicon' />
        </View>
      );
    }
  }

  render() {
  const {navigation} = this.props;
  const EventId = navigation.getParam('ID', 'NO-ID');
  const Title = navigation.getParam('Title', 'NO-ID');
  if (!this.state.loaded || !this.state.loaded2) {
    this.PopFace(EventId);
    this.PopUsers(EventId);
    return (
      <View style={ styles.loaderContainer }>
        <Image style={ styles.loader } source={ require('../assets/images/giffy.gif') } />
      </View>
    )
  }
  return (
    <View style={{backgroundColor:this.state.color,height:"100%"}}>
      <ImageBackground source={ require('../assets/images/coolcool.png') } style={{width: '100%', height: '97%'}} resizeMode='cover'>
        {this.body()}
        {this.faceButton(EventId)}
      </ImageBackground>
    </View>
  );
  }
  }

const styles = StyleSheet.create({
  headerContainer: {
    margin: 15,
  },
  DiscoverContainer: {
    height: 375,
    backgroundColor: 'white',
    borderBottomColor: 'grey',
    borderBottomWidth: 0.5,
  },
  helpLink: {
    paddingVertical: 15,
    alignItems: 'center'
  },
  Discover: {
    fontSize: 32,
    fontWeight: 'bold',
    color: "#4a4b4c"
  },
  Title: {
    fontSize: 38,
    margin: 10,
    fontWeight: 'bold',
    color: "#4a4b4c"
  },
  AttendingText: {
    color: "#72ffba",
    fontSize: 22,
    margin: 5,
    fontWeight: "bold"
  },
  attendingHeader:{
    flexDirection: 'row',
    marginLeft:10,
    marginRight:10,
    paddingLeft:20,
    backgroundColor:"#4a4b4c",
    alignItems:"center"
  },
  Attending:{
    marginLeft:10,
    marginRight:10,
  },
  Location: {
    color: "#4a4b4c",
    fontSize: 22,
    marginLeft: 10,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  DescriptionTitle: {
    color: "#4a4b4c",
    fontSize: 22,
    textAlign: "center",
    fontWeight: 'bold',
    margin: 5,
  },
  Description: {
    color: "#4a4b4c",
    textAlign: "left",
    fontSize: 18,
    margin: 10,
  },
  Time: {
    color: "#4a4b4c",
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: wp("1.5%"),
    marginLeft: wp("1.5%"),
  },
  Date: {
    fontSize: 22,
    color: "#4a4b4c",
    marginTop: wp("1.5%"),
    fontWeight: 'bold',
  },
  separation: {
    marginTop: 10,
  },
  loaderContainer:{
     alignItems: "center",
     flex: 1,
     justifyContent: 'center'
  },
  loader:{
   backgroundColor: '#ccc',
   flex: 1,
   position: 'absolute',
   width: 120,
   justifyContent: 'center',
   borderRadius:10,
  },
  DateAndTime:{
  flex:1,
  flexDirection: 'row',
  justifyContent: 'space-between',
  margin:10,
  }
});
