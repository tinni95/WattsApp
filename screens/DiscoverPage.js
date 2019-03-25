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
import { SearchBar } from 'react-native-elements';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    header : null,
  };

  constructor()
  {
      super();
      this.state = {  search: '', loaded:false, refreshing: false, data:[],Usersdata:[]}
  }

componentDidMount(){
     this.PopEvents();
}

updateSearch = search => {
  this.setState({ search });
};

  _onRefresh = () => {
    this.setState({
      refreshing: true
    });
    fetch('https://hwattsup.website/AppBackEnd/events.php', {
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
  fetch('https://hwattsup.website/AppBackEnd/events.php', {
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
var found= false;
for (let i = 0; i < this.state.data["Title"].length; i++) {
  var date=(this.state.data["Date"][i].substring(8,10))+"/"+(this.state.data["Date"][i].substring(5,7));
  if(this.state.data["Title"][i].toLowerCase().includes(this.state.search.toLowerCase())||
  date.includes(this.state.search.toLowerCase())){
  found=true;
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
    <View>
    <Text style={styles.Title}> {this.state.data["Title"][i]}</Text>
    <Text style={styles.Owner}> {this.state.data["FullName"][i]}</Text>
    </View>
    <View style={styles.footer}>
      <Text style={styles.Location}>@{this.state.data["Location"][i].length>40 ? this.state.data["Location"][i].substring(0,40)+"..":this.state.data["Location"][i]}</Text>
      <View style={{flexDirection: 'row',paddingLeft:10,paddingTop:15,justifyContent: 'space-between',}}>
        <View style={{flexDirection:"row"}}>
          <Icon containerStyle={{marginRight:14,marginTop:-6}} size={30} color="black" name='ios-calendar' type='ionicon' />
          <Text style={styles.Date}>{date}</Text>
        </View>
        <View style={{flexDirection:"row"}}>
          <Icon containerStyle={{marginTop:-6}} size={30} color="black" name='ios-clock' type='ionicon' />
          <Text style={styles.Time}>{this.state.data["Time"][i].substring(0,5)}</Text>
        </View>
      </View>
    </View>
  </View>
</TouchableOpacity>
);
}
  }
  if(!found){
    events.push(
    <View style={styles.tabBarInfoContainer}>
      <Text style={styles.tabBarInfoText}>No events match your search query</Text>
    </View>
  );
  }
  return events
}

  render() {
  const {navigate} = this.props.navigation;
  const { search } = this.state.search;
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
        <View style={styles.headerContainer}>
        <View style={{width:"80%"}}>
            <SearchBar
            containerStyle={{backgroundColor:"white"}}
            lightTheme="true"
            placeholder="Search title, date..."
            onChangeText={this.updateSearch}
            value={search}
          />
          </View>
          <TouchableOpacity style={styles.add} onPress={()=> navigate("AddEvent")} >
          <Text style={styles.addtext}>+</Text>
          </TouchableOpacity>
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
  fontSize:22,
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
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
  margin:5,
  paddingTop:22.5,
},
navigationFilename: {
  marginTop: 20,
},
DiscoverContainer: {
  flex:1,
  flexDirection: 'column',
  justifyContent: 'space-between',
  margin:10,
  height:330,
  borderRadius:10,
  borderWidth: 0.1,
  borderColor: 'gray',
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
  fontSize:18,
  marginLeft:10,
  marginBottom:5,
  color:'black',
  fontWeight:'bold',
},
Time: {
  fontSize:18,
  color:'black',
  marginLeft:15,
  marginRight:10,
  marginBottom:5,
  fontWeight:'bold',
},
Date:{
  fontSize:18,
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
    marginTop:145,
    },
  }),
},
loading:{
  backgroundColor: '#ccc',
  flex: 1,
  position: 'absolute',
  width: 120,
  justifyContent: 'center',
  borderRadius:10,
},
tabBarInfoContainer: {
  position: 'absolute',
  top: 120,
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
});
