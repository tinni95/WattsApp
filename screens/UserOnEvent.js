import React from 'react';
import {
  Image,
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


export default class UserCreed extends React.Component {
  state = {
    image: "http://gladiator1924.com/a/images/1546971976_testPhotoName.jpg",
    data: [],
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

    fetch('http://gladiator1924.com/a/UserPage.php',
    {
        method: 'POST',
        headers:
        {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
        {
          id : this.props.navigation.getParam('ID', 'NO-ID'),
        })

    }).then((response) => response.json()).then((responseJson) =>
    {
        this.setState({ data:responseJson});
        this.setState({image:responseJson["Image"]});
        this.setState({ loading:false});
    }).catch((error) =>
    {
        console.error(error);
    });
  }


  render() {
const {navigate} = this.props.navigation;
if (this.state.loading) {
return (
  <View style={{alignItems:"center",   flex: 1,
justifyContent: 'center'}}>
  <Image
      style={{
       backgroundColor: '#ccc',
       flex: 1,
       position: 'absolute',
       width: 120,
       justifyContent: 'center',
         borderRadius:10,
        }}
        source={
      require('../assets/images/giffy.gif')
        }
        />
      </View>
    )
}
else{
        let { image } = this.state;
        return (
  <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

       {image &&
      <Image source={{ uri: image }} style={styles.welcomeImage} />
          }


      <Icon
      size={35}
      color="black"
      name='ios-bowtie'
      type='ionicon' />

      <Text style={styles.Name}>{this.state.data["FullName"]}</Text>
      <Text style={styles.Halls}>{this.state.data["Hall"]}</Text>
      <Text style={styles.Course}>{this.state.data["Course"]}</Text>
  </ScrollView>
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
    textAlign:"center",
  },
  Halls:{
    paddingTop:5,
    fontSize:18,
    color:"grey",
    textAlign:"center",
  },
  Course:{
    paddingTop:5,
    fontSize:18,
      color:"grey",
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

});
