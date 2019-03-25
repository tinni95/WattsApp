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
  PixelRatio
} from 'react-native';
import { Icon } from 'react-native-elements';
import { MonoText } from '../components/StyledText';
import moment from "moment";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
var size;
export default class SettingsScreen extends React.Component {

  constructor()
  {
      super();
      this.state = { loaded:false, refreshing: false, data:[],empty:false}
  }

componentDidMount(){
  if(PixelRatio.get()<=2){
    size=60;
  }
  else{
    size=80
  }
     this.PopEvents();
}

  _onRefresh = () => {
    this.setState({
      refreshing: true
    });
    fetch('https://hwattsup.website/AppBackEnd/UserEvents.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: global.userid
      })

    }).then((response) => response.json()).then((responseJson) => {
      this.setState({
        data: responseJson
      });
    }).catch((error) => {
      console.error(error);
    }).then(() => {
      this.setState({
        refreshing: false
      });
      this.renderEvents();
    }).catch((error) => {
      console.error(error);
    });
  }

  refreshEvents = () =>
  {
     this.PopEvents();
     this.renderEvents();
  }

  PopEvents = () => {
    fetch('http://gladiator1924.com/a/UserEvents.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: global.userid
      })

    }).then((response) => response.json()).then((responseJson) => {
      if (responseJson == "EMPTY") {
        this.setState({
          loaded: true,
          data: responseJson,
          empty: true
        });
      } else {
        this.setState({
          loaded: true,
          data: responseJson,
          empty: false
        });
      }
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
  var counter;
  let events = [];
  if(this.state.data["Title"][0].length==1){
    counter=1;
  }
  else{
    counter=this.state.data["Title"].length;
  }
  for (let i = 0; i < counter; i++) {
    events.push(

    <View style={styles.DiscoverContainer}>
      <Image style={styles.Discover} source={ require('../assets/images/mamma.jpg') } />
      <View style={styles.Eventsheader}>
      <Text style={styles.Title}> {this.CalculateEntry(this.state.data["Title"],counter,i)}</Text>
      <TouchableOpacity style={{width:size,height:size,position:"absolute",top:80,right:10}} onPress={ ()=> navigate("EditEvent",{
        Title:this.CalculateEntry(this.state.data["Title"],counter,i),
        Location:this.CalculateEntry(this.state.data["Location"],counter,i),
        Date:this.CalculateEntry(this.state.data["Date"],counter,i),
        Time:this.CalculateEntry(this.state.data["Time"],counter,i),
        Description:this.CalculateEntry(this.state.data["Description"],counter,i),
        ID:this.CalculateEntry(this.state.data["EID"],counter,i),
        })
        }>
      <Image style={{width:size,height:size}} source={ require('../assets/images/ulisse.png') } />
      </TouchableOpacity>
      <TouchableOpacity style={{width:size+5,height:size+5,position:"absolute",right:87.5,top:100}}  onPress={ ()=> navigate("Notify",{
        Title:this.CalculateEntry(this.state.data["Title"],counter,i),
        ID:this.CalculateEntry(this.state.data["EID"],counter,i),
        })
        }>
      <Image style={{width:size+5,height:size+5}} source={ require('../assets/images/Notification.png') } />
      </TouchableOpacity>
      <TouchableOpacity style={{width:size+10,height:size+10,position:"absolute",right:175,top:120}} onPress={ ()=> navigate("EventPage",{
        Title:this.CalculateEntry(this.state.data["Title"],counter,i),
        Location:this.CalculateEntry(this.state.data["Location"],counter,i),
        Date:this.CalculateEntry(this.state.data["Date"],counter,i),
        Time:this.CalculateEntry(this.state.data["Time"],counter,i),
        Description:this.CalculateEntry(this.state.data["Description"],counter,i),
        ID:this.CalculateEntry(this.state.data["EID"],counter,i),
        })
        }>
      <Image style={{width:size+10,height:size+10}} source={ require('../assets/images/file.png') } />
      </TouchableOpacity>
      </View>
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
            <Icon containerStyle={{marginRight:14,marginTop:-6}} size={35} color="black" name='ios-calendar' type='ionicon' />
            <Text style={styles.Date}>{(this.CalculateEntry(this.state.data["Date"],counter,i).substring(8,10))+"/"+(this.CalculateEntry(this.state.data["Date"],counter,i).substring(5,7))}</Text>
          </View>
          <View style={{flexDirection:"row"}}>
            <Icon containerStyle={{marginTop:-6}} size={35} color="black" name='ios-clock' type='ionicon' />
            <Text style={styles.Time}>{this.CalculateEntry(this.state.data["Time"],counter,i).substring(0,5)}</Text>
          </View>
        </View>
      </View>
    </View>

    );
  }
  return events
}

render() {
  const {navigate} = this.props.navigation;
  if (!this.state.loaded) {
    return(
      <View style={styles.center}>
        <Image style={styles.loader} source={require('../assets/images/giffy.gif')} />
      </View>);
      }
  else if(this.state.empty){
    return(
    <View>
      <Text style={styles.getStartedText}>
        After you create an event,
        The events you create can be modified in this page
      </Text>
      <View style={{alignItems:"center",margin:10}}>
        <TouchableOpacity onPress={()=> navigate("CreateEvent")} style={styles.icon}>
          <Icon size={35} color="white" name='ios-add-circle' type='ionicon' />
        </TouchableOpacity>
      </View>
    </View>
      );
      }
      return (
      <View style={styles.container}>
      <ScrollView refreshControl={ <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />
      }
      style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Your Events</Text>
      </View>
      {this.renderEvents()}
      </ScrollView>
    </View>
      );
}
}
const styles = StyleSheet.create({
DateAndTime:{
  flexDirection: 'row',
  paddingLeft:10,
  paddingTop:10,
  justifyContent:'space-between'
},
Discover:{
  backgroundColor: '#ccc',
  flex: 1,
  position: 'absolute',
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  borderRadius:10,
},
icon:{
  paddingTop:30,
  backgroundColor:"black",
  height:100,
  width:100,
  borderRadius:50,
  alignItems:"center",
},
container: {
  flex: 1,
  zIndex:999,
  height:2000,
},
headerContainer: {
  margin:15,
},
Eventsheader: {
    justifyContent:"flex-start",
},
DiscoverContainer: {
  flex:1,
  flexDirection: 'column',
  justifyContent: 'space-between',
  margin:10,
  height:320,
  borderRadius:10,
  borderWidth: 0.1,
  borderColor: 'gray',
},
header: {
  fontSize:32,
  fontWeight:'bold',
},
Title: {
  fontSize:30,
  margin:10,
  fontWeight:'bold',
  color:'white',
},
Location: {
  fontSize:22,
  marginLeft:10,
  marginBottom:10,
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
  ...Platform.select({
    ios: {
      justifyContent:"flex-end",
      marginBottom:10

    },
    android: {
    marginTop:160,
    },
  }),
},
getStartedText: {
  fontSize: 22,
  color: 'rgba(96,100,109, 1)',
  lineHeight: 24,
  textAlign: 'center',
  marginTop:30,
},
loader:{
  backgroundColor: '#ccc',
  flex: 1,
  position: 'absolute',
  width: 120,
  justifyContent: 'center',
  borderRadius:10,
},
center:{
  alignItems:"center",
  flex: 1,
  justifyContent: 'center'
}
});
