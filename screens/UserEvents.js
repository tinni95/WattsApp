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
  RefreshControl
} from 'react-native';
import { Icon } from 'react-native-elements';
import { MonoText } from '../components/StyledText';
import moment from "moment";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class SettingsScreen extends React.Component {

  constructor()
  {
      super();
      this.state = { loaded:false, refreshing: false, data:[],empty:false}
  }

componentDidMount(){
     this.PopEvents();
}

  _onRefresh = () => {
    this.setState({
      refreshing: true
    });
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
  <TouchableOpacity onPress={ ()=> navigate("EditEvent",{
    Title:this.CalculateEntry(this.state.data["Title"],counter,i),
    Location:this.CalculateEntry(this.state.data["Location"],counter,i),
    Date:this.CalculateEntry(this.state.data["Date"],counter,i),
    Time:this.CalculateEntry(this.state.data["Time"],counter,i),
    Description:this.CalculateEntry(this.state.data["Description"],counter,i),
    ID:this.CalculateEntry(this.state.data["EID"],counter,i),
    })
    }>
    <View style={styles.DiscoverContainer}>
      <Image style={styles.Discover} source={ require('../assets/images/mamma.jpg') } />
      <Image style={styles.image} source={ require('../assets/images/ulisse.png') } />
      <Text style={styles.Title}> {this.CalculateEntry(this.state.data["Title"],counter,i)}</Text>
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
  </TouchableOpacity>
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
DiscoverContainer: {
  margin:10,
  height:320,
  borderRadius:10,
  borderWidth: 0.3,
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
    marginTop:165,
    },
    android: {
    marginTop:160,
    },
  }),
},
image:{
  width:80,
  height:80,
  position:"absolute",
  right:10,
  borderRadius:50,
  top:95,
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
