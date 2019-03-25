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
Easing,
PixelRatio
} from 'react-native';
import moment from "moment";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { ListItem, Icon } from 'react-native-elements';
import { Permissions, Calendar } from 'expo';
import { MonoText } from '../components/StyledText';
var iconsmargin;
var timeMargin;
var iconsize;
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

componentDidMount(){
  if(PixelRatio.get()<=2){
    iconsize=50;
    iconsmargin=30;
    timeMargin=100;
  }
  else{
    iconsize=60;
    iconsmargin=20;
    timeMargin=150;
  }
}
_onRefresh = (eventid) =>
{
this.setState({refreshing: true});
fetch('https://hwattsup.website/AppBackEnd/Users.php',
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
  fetch('https://hwattsup.website/AppBackEnd/Users.php', {
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

sendNotification = (To,Title) =>
{
let response = fetch('https://exp.host/--/api/v2/push/send',{
  method: 'POST',
  headers :
 {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  },
  body: JSON.stringify(
  {
   to : To,
   sound : "default",
   title : "Event Notification",
   body: "Someone joined your event "+Title
  })
});
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

faceSwap = (EventId,Title) => {
  this.setState({
  loading: true
  });
  if (this.state.face == "ios-sad") {
  fetch('https://hwattsup.website/AppBackEnd/JoinEvent.php', {
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
  if (responseJson != "NO") {
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
    if(responseJson != "YES"){
      this.sendNotification(responseJson,Title);
    }
  }
  }).catch((error) => {
    console.error(error);
  });
  }
  else {
  fetch('https://hwattsup.website/AppBackEnd/UnjoinEvent.php', {
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
      <View style={{flexDirection: 'row', marginLeft:timeMargin}}>
        <Icon containerStyle={{justifyContent:"flex-end",marginRight:wp("2%")}} size={35} color="#4a4b4c" name='ios-clock' type='ionicon' />
        <Text style={ {
          color: "#4a4b4c",
          fontSize: 22,
          fontWeight: 'bold',
          marginTop: wp("1.5%"),
        }}>{Time}</Text>
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
    <TouchableOpacity onPress={()=>navigate("UserOnEvent",{ID: this.usersNumber()>1 ? this.state.data["ID"][i] : this.state.data["ID"]})}>
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
      id: this.state.data["ID"],

    })
  } else {
    for (let i = 0; i < this.state.data["FullName"].length; i++) {
      list.push({
        name: this.state.data["FullName"][i],
        avatar_url: this.state.data["Image"][i],
        subtitle: this.state.data["Course"][i],
        id: this.state.data["ID"],
      })
    }
  }
  return list
}

faceButton = (EventId,Title) => {
  if(!this.state.loading){
    return(
      <TouchableOpacity style={{height:85}} onPress={()=> this.faceSwap(EventId,Title)} >
        <Icon containerStyle={{left:("40%"),marginTop:iconsmargin}} size={iconsize} color="white" name={this.state.face} type='ionicon' />
      </TouchableOpacity>
    );
    }
  else{
      return(
        <View style={{height:85}}>
          <Icon containerStyle={{left:("40%"),marginTop:iconsmargin}} size={iconsize} color="white" name={this.state.face} type='ionicon' />
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
      <ImageBackground source={ require('../assets/images/coolcool2.png') } style={{width: '100%', height: '97%'}} resizeMode='cover'>
        {this.body()}
        {this.faceButton(EventId,Title)}
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
    fontSize: 34,
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
  width:"100%",
  flex:1,
  flexDirection: 'row',
  margin:10,
  }
});
