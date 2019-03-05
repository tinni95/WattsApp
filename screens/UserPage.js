import React from 'react';
import { ExpoLinksView } from '@expo/samples';
import { ImagePicker ,Permissions} from 'expo';
import { TextInput,View, Button,Image,ScrollView, StyleSheet , Platform, TouchableOpacity, Text} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';

export default class LinksScreen extends React.Component {
  state = {
    image: "http://gladiator1924.com/a/images/placeholder.jpeg",
    data: [],
    FullName: '',
    Hall : '',
    Course : '',
    loading: true,
  };

  static navigationOptions = ({ navigation }) =>{
    return {
      title: "User Profile",
      headerRight: ( <
        Button onPress = {
          () => {
            if (!fass) {
              navigation.setParams({
                otherParam: 'Save'
              });
              navigation.setParams({
                onCancel: 'Cancel'
              });
            } else {
              const data = new FormData();
              navigation.setParams({
                loading: true
              });
              if (navigation.getParam('image', 'Edit') != "Edit") {
                data.append('photo', {
                  uri: Platform.OS === "android" ? navigation.getParam('image', 'Edit') : navigation.getParam('image', 'Edit').replace("file://", ""),
                  type: 'image/jpeg',
                  name: navigation.getParam('email', 'Edit') + ".jpeg",
                });
                fetch("http://gladiator1924.com/a/upload2.php", {
                  method: 'post',
                  body: data,
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                  },
                }).then(response => response.json()).then((responseJson) => {
                  if (responseJson == "No") {
                    alert("error uploading file", "a");
                  } else {
                    fetch("http://gladiator1924.com/a/write.php", {
                      method: 'post',
                      body: JSON.stringify({
                        Userid: global.userid,
                        image: "http://gladiator1924.com/a/images/" + responseJson,
                      }),
                      headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },
                    }).then(response => response.json()).then((responseJson) => {
                      navigation.setParams({
                        loading: false
                      });
                      if (responseJson == "yea") {
                        alert("Image Updated Successfully", "a");
                      } else {
                        alert("Oops", "a");
                      }
                      navigation.setParams({
                        otherParam: 'Edit'
                      });
                      navigation.setParams({
                        onCancel: 'Logout'
                      });
                    }).catch((error) => {
                      console.error(error);
                    });
                  }

                });
              } else {
                navigation.setParams({
                  otherParam: 'Edit'
                });
                navigation.setParams({
                  onCancel: 'Logout'
                });
                navigation.setParams({
                  loading: false
                });
              }
            }
            fass = !fass;
          }
        }
        title = {
          navigation.getParam('otherParam', 'Edit')
        }
        color = "black" /
        >
      ),
      headerLeft: ( <
        Button onPress = {
          () => {
            if (fass) {
              navigation.setParams({
                onCancel: 'Logout'
              });
              navigation.setParams({
                otherParam: 'Edit'
              });
            } else {
              navigation.navigate("Login");
            }
            fass = !fass;
          }
        }
        title = {
          navigation.getParam('onCancel', 'Logout')
        }
        color = "black" /
        >
      ),
    };
    };

  componentDidMount() {
    fass=false;
    loading=false;
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
          id : global.userid,
        })

    }).then((response) => response.json()).then((responseJson) =>
    {
        this.setState({ data:responseJson});
        if(responseJson["Image"]){
        this.setState({image:responseJson["Image"]});
        this.setState({loading:false});
      }
         this.props.navigation.setParams({email: this.state.data["e-mail"]});
    }).catch((error) =>
    {
        console.error(error);
    });
  }

 renderImage = () =>{
   let image  = this.state.image;
   if (fass){
    return(
    <TouchableOpacity onPress={this._pickImage}>
      {image &&
      <Image source={{ uri: image }} style={styles.welcomeImage} />
      }
      <Icon size={35} color="black" name='md-cloud-upload' type='ionicon' containerStyle={{marginLeft:wp("50%"),marginTop:hp("-2%"),backgroundColor:"lightgrey",width:40,borderRadius:20}} />
    </TouchableOpacity>
  );
  }
  else{
    return(
      <View style={{alignItems:"center",flex: 1,justifyContent: 'center'}}>
        {image &&
        <Image source={{ uri: image }} style={styles.welcomeImage} />
        }
        <Icon size={35} color="black" name='ios-bowtie' type='ionicon' />
      </View>
    );
}

 }
navigateToMore= () =>{
this.props.navigation.navigate("More");
}

renderLink = () =>{
if (fass){
  return(
    <TouchableOpacity onPress={()=> this.navigateToMore()}>
      <View style={{alignItems:"center",flex: 1,justifyContent: 'center',flexDirection: 'row',margin:5}}>
        <Icon size={18} color="#0067b1" name='ios-add-circle' type='ionicon' />
        <Text style={{color:"#0067b1",margin:2,fontSize:16}}>More Options</Text>
      </View>
    </TouchableOpacity>
  );
}
}

_pickImage = async () => {
  await Permissions.askAsync(Permissions.CAMERA);
  await Permissions.askAsync(Permissions.CAMERA_ROLL);
 let result = await ImagePicker.launchImageLibraryAsync({
   allowsEditing: true,
   aspect: [4, 3],
 });
 console.log(result);
 if (!result.cancelled) {
   this.setState({ image: result.uri });
   this.props.navigation.setParams({image: result.uri });
 }
};

render() {
if (this.state.loading||this.props.navigation.getParam('loading',false)) {
  return (
  <View style={{alignItems:"center",flex: 1,justifyContent: 'center'}}>
    <Image style={styles.loader} source={require('../assets/images/giffy.gif')}/>
  </View>
    )
}
else{
  let image  = this.state.image;
  const {navigate} = this.props.navigation;
  return (
  <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
    {this.renderImage()}
    <Text style={styles.Name}>
      {this.state.data["FullName"]}
    </Text>
    <Text style={styles.Halls}>
      {this.state.data["Hall"]}
    </Text>
    <Text style={styles.Course}>
      {this.state.data["Course"]}
    </Text>
    {this.renderLink()}
    <View style={styles.bottomView}>
      <View style={styles.bottom}>
        <TouchableOpacity onPress={()=> navigate("UserEvents")} style={styles.icon}>
          <Icon size={35} color="black" name='ios-calendar' type='ionicon' />
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> navigate("CreateEvent")} style={styles.icon}>
          <Icon size={35} color="black" name='ios-add-circle' type='ionicon' />
        </TouchableOpacity>
      </View>
      <View style={styles.headers}>
        <Text style={{fontWeight:"bold"}}>
          Your MeetUps
        </Text>
        <Text style={{fontWeight:"bold"}}>
          Create Meetup
        </Text>
      </View>
    </View>
  </ScrollView>
);
}
}
}
const styles = StyleSheet.create({
  headers:{
    paddingTop:hp("1%"),
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  icon:{
    paddingTop:30,
    backgroundColor:"white",
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
  bottom:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  welcomeImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginLeft: "auto",
    marginRight: "auto",
  },
  bottomView: {
    marginTop: hp("10%"),
    padding: 25,
    margin: 0,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: 'dashed',
    borderColor: 'black',
    backgroundColor: "#1aa6e54f"
  }
});
