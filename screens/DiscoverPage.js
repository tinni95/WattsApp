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
  static navigationOptions = {
    header : null,
  };

  constructor()
  {
      super();
      this.state = { loaded:false, refreshing: false, data:[],Usersdata:[]}
  }

componentDidMount(){
     this.PopEvents();
}

  _onRefresh = () => {
    this.setState({
      refreshing: true
    });
    fetch('http://gladiator1924.com/a/events.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
  fetch('http://gladiator1924.com/a/events.php', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({

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

renderEvents = () =>{
const {navigate} = this.props.navigation;
let events = [];
for (let i = 0; i < this.state.data["Title"].length; i++) {
  events.push(<TouchableOpacity onPress = { () => navigate("EventPage",{
  Title:this.state.data["Title"][i],
  Location:this.state.data["Location"][i],
  Date:this.state.data["Date"][i],
  Time:this.state.data["Time"][i],
  Description:this.state.data["Description"][i],
  ID:this.state.data["EID"][i],
})
}>
  <View style={styles.DiscoverContainer}>
    <Image style={styles.DiscoverImage} source={ require('../assets/images/mamma.jpg')}/>
    <Image style={styles.UserImage} source={{uri:this.state.data["Image"][i]}}/>
    <Text style={styles.Title}> {this.state.data["Title"][i]}</Text>
    <Text style={styles.Owner}> Hosted By: {this.state.data["FullName"][i]}</Text>
    <View style={styles.footer}>
      <Text style={styles.Location}>@{this.state.data["Location"][i].length>25 ? this.state.data["Location"][i].substring(0,25)+"..":this.state.data["Location"][i]}</Text>
      <View style={{flexDirection: 'row',paddingLeft:10,paddingTop:15,justifyContent: 'space-between',}}>
        <View style={{flexDirection:"row"}}>
          <Icon containerStyle={{marginRight:14,marginTop:-6}} size={35} color="#4a4b4c" name='ios-calendar' type='ionicon' />
          <Text style={styles.Date}>{(this.state.data["Date"][i].substring(8,10))+"/"+(this.state.data["Date"][i].substring(5,7))}</Text>
        </View>
        <View style={{flexDirection:"row"}}>
          <Icon containerStyle={{marginTop:-6}} size={35} color="#4a4b4c" name='ios-clock' type='ionicon' />
          <Text style={styles.Time}>{this.state.data["Time"][i].substring(0,5)}</Text>
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
    <View style={{alignItems:"center",flex: 1,justifyContent: 'center'}}>
      <Image style={styles.loading} source={ require('../assets/images/giffy.gif') } />
    </View>);
  }
  return (
    <View style={styles.container}>
      <ScrollView refreshControl={ <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />}
      style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View>
          <TouchableOpacity style={styles.add} onPress={()=> navigate("AddEvent")} >
          <Text style={styles.addtext}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerContainer}>
          <Text style={styles.Discover}>Discover</Text>
        </View>
        {this.renderEvents()}
      </ScrollView>
    </View>
          );
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
addtext:{
  color:'white',
  fontSize:20,
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
add:{
  alignItems:'center',
  position: 'absolute',
  top:0,
  right:0,
  backgroundColor:"black",
  marginTop:30,
  marginRight:15,
  height:30,
  width:30,
  borderRadius:15,
},
container: {
  flex: 1,
  zIndex:999,
  height:2000,
},
contentContainer: {
  paddingTop: 30,
},
headerContainer: {
  margin:15,
  width:wp("50%"),
},
navigationFilename: {
  marginTop: 20,
},
DiscoverContainer: {
  margin:10,
  height:300,
  borderRadius:10,
  borderWidth: 1,
  borderColor: 'gray',
  backgroundColor:'blue',
},
helpLink: {
  paddingVertical: 15,
  alignItems:'center'
},
Discover: {
  fontSize:32,
  width:wp("50%"),
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
  color:'#4a4b4c',
  fontWeight:'bold',
},
Time: {
  fontSize:22,
  color:'#4a4b4c',
  marginLeft:15,
  marginRight:10,
  marginBottom:5,
  fontWeight:'bold',
},
Date:{
  fontSize:22,
  color:'#4a4b4c',
  fontWeight:'bold',
},
footer:{
  marginTop:135,
},
loading:{
  backgroundColor: '#ccc',
  flex: 1,
  position: 'absolute',
  width: 120,
  justifyContent: 'center',
  borderRadius:10,
}
});
