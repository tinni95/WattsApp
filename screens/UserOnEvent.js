import React from 'react';
import {
  Image,
  PixelRatio,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
var fontsize;
var paddingtop;
export default class UserCreed extends React.Component {
  state = {
    image: "https://hwattsup.website/AppBackEnd/images/placeholder.jpeg",
    data: [],
    Name:'',
    loading: true,
  };

  static navigationOptions  = ({ navigation }) => {
    return{
    headerStyle: {
        backgroundColor:"white",
            borderBottomWidth:0,
      },
    }
  };

  componentDidMount() {
    if(PixelRatio.get()<=2){
      fontsize=30;
      paddingtop=-35;
    }
    else{
      fontsize=40;
      paddingtop=-40;
    }
    fetch('https://hwattsup.website/AppBackEnd/UserPage.php',
    {
        method: 'POST',
        headers:
        {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
        {
          id : this.props.navigation.getParam('ID', global.userid),
        })

    }).then((response) => response.json()).then((responseJson) =>
    {
        this.setState({ data:responseJson});
        this.setState({image:responseJson["Image"]});
        this.setState({ loading:false});
        console.log("data",this.props.navigation.getParam('ID', global.userid));
    })

    fetch('http://hwattsup.website/AppBackEnd/GetName.php',
    {
        method: 'POST',
        headers:
        {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
        {
          id : global.userid,
        })

    }).then((response) => response.json()).then((responseJson) =>
    {
        this.setState({ Name:responseJson});
    })
  }

  WattsAppBtn = () => {
    if(!this.state.loading){
      return(
        <TouchableOpacity style={{height:50,marginTop:paddingtop}} onPress={()=>this.WattsApp()}>
        <Text style={{fontFamily:"noteworthy",fontSize:fontsize,color:"white",marginLeft:190,marginTop:-20}}>WattsApp</Text>
        </TouchableOpacity>
      );
      }
    else{
      return(
        <View style={{height:50,marginTop:paddingtop}}>
        <Text style={{fontFamily:"noteworthy",fontSize:fontsize,color:"white",marginTop:-20,marginLeft:190}}>WattsApp</Text>
        </View>
      );
    }
    }

  body = () => {
    let { image } = this.state;
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {image &&
        <Image source={{ uri: image }} style={styles.welcomeImage} />
        }
        <Icon size={35} color="black" name='ios-bowtie' type='ionicon' />
        <Text style={styles.Name}>{this.state.data["FullName"]}</Text>
        <Text style={styles.Halls}>{this.state.data["Hall"]}</Text>
        <Text style={styles.Course}>{this.state.data["Course"]}</Text>
      </ScrollView>
    );
  }

  WattsApp = () => {
    this.setState({ loading: true}, () =>
    {
    if(!this.state.data["PushToken"]){
      alert("User does not accept notifications");
      return;
    }
      fetch('https://exp.host/--/api/v2/push/send',{
      method: 'POST',
      headers :
     {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(
      {
       to : this.state.data["PushToken"],
       sound : "default",
       title : this.state.data["FullName"].split(" ")[0]+","+" What's Uup!",
       body: this.state.Name+" sent you a WattsApp"
     })
   }).then((response) => response.json()).then((responseJson) =>
    {
        this.setState({ loading:false});
        if(responseJson["data"]["status"]=="ok"){
          alert("Wattsapp sent");
        }
        else{
          alert("There was a problem sending the notification");
        }

    });
  });
  }

  render() {
  const {navigate} = this.props.navigation;
  if (this.state.loading) {
  return (
  <View style={{alignItems:"center",flex: 1,justifyContent: 'center'}}>
  <Image style={styles.loader} source={ require('../assets/images/giffy.gif') } />
  </View>
    )
  }
  else{
    return (
    <View style={{backgroundColor:"#ef4572",height:"100%"}}>
    <ImageBackground source={ require('../assets/images/Register.png') } style={{width: '100%', height: '97%'}} resizeMode='cover'>
    {this.body()}
    </ImageBackground>
    {this.WattsAppBtn()}
    </View>
    );
  }
  }
}

const styles = StyleSheet.create({
  icon:{
    paddingTop:30,
    backgroundColor:"lightgrey",
    height:100,
    width:100,
    borderRadius:50,
    alignItems:"center",
  },
  Name:{
    paddingTop:5,
    fontSize:30,
    fontWeight:"bold",
    color:"white",
    textAlign:"center",
  },
  Halls:{
    paddingTop:5,
    fontSize:18,
    color:"#ffffff",
    textAlign:"center",
  },
  Course:{
    paddingTop:5,
    fontSize:18,
    color:"#ffffff",
    textAlign:"center",
  },
  container: {
    flex: 1,
    paddingTop:30,
    zIndex:999,
    backgroundColor:'rgba(240,255,240,0.1)',
  },

  welcomeContainer: {
    alignItems: 'center',
    marginTop: -50,
    marginBottom: 20,
    width: 100,
    borderRadius:50,
    height: 100,
  },

  welcomeImage: {
      width: 150,
      height: 150,
      borderRadius: 75,
      marginLeft:"auto",
      marginRight:"auto",
  },

  loader:{
       backgroundColor: '#ccc',
       flex: 1,
       position: 'absolute',
       width: 120,
       justifyContent: 'center',
       borderRadius:10,
       }
       ,
     DiscoverImage:{
       backgroundColor: '#ccc',
       flex: 1,
       position: 'absolute',
       width: '100%',
       height: '100%',
       justifyContent: 'center',
       borderRadius:10,
      }
});
