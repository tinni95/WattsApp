import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  TextInput,
  Picker
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class HomeScreen extends React.Component {

  static navigationOptions = {
    title: "Change Details",
  };

  constructor() {
    super();
    this.state = {
      course: '',
      name: '',
      surname: '',
      hall: ''
    }
  }

  validateCourse = () => {
    var re = /[a-z ]{1,50}/;
    return re.test(this.state.course);
  }

  ChangeCourse = () => {
    if (this.validateCourse()) {
      this.setState({
        loading: true
      }, () => {
        fetch('https://hwattsup.website/AppBackEnd/ChangeCourse.php', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userID: global.userid,
            Course: this.state.course,
          })
        }).then((response) => response.json()).then((responseJson) => {
          alert(responseJson, "");
          this.setState({loading: false});
          this.props.navigation.navigate("Links",{course:this.state.course});
        }).catch((error) => {
          console.error(error);
        });
      });
    } else {
      alert("Something wrong with the input", "");
    }
  }

  validateName = () => {
    var re = /[a-z]{1,10}/;
    return re.test(this.state.name);
  }
  validateSurname = () => {
    var re = /[a-z']{1,10}/;
    return re.test(this.state.surname);
  }

  ChangeFullName = () => {
    if (this.validateName() && this.validateSurname()) {
      this.setState({
        loading: true
      }, () => {
        fetch('https://hwattsup.website/AppBackEnd/ChangeFullName.php', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userID: global.userid,
            FullName: this.state.name+" "+this.state.surname,
          })
        }).then((response) => response.json()).then((responseJson) => {
          alert(responseJson, "");
          this.setState({loading: false});
          this.props.navigation.navigate("Links",{FullName:this.state.name+" "+this.state.surname});
        }).catch((error) => {
          console.error(error);
        });
      });
    } else {
      alert("Something wrong with the input", "");
    }
  }

  ChangeHall = () => {
    this.setState({
      loading: true
    }, () => {
        fetch('https://hwattsup.website/AppBackEnd/ChangeHall.php', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userID: global.userid,
            Hall: this.state.hall,
          })

        }).then((response) => response.json()).then((responseJson) => {
          alert(responseJson, "");
          this.setState({loading: false});
          this.props.navigation.navigate("Links",{hall:this.state.hall});
        }).catch((error) => {
          console.error(error);
        });
      });
  }

  Picker = () => {
    let data = [
    {value: 'Off-Campus',},
    {value: 'Leonard Horner Hall',},
    {value: 'Lord Thompson Hall',},
    {value: 'Lord Home',},
    {value: 'Robert Bryson Hall',},
    {value: 'George Burnett',},
    {value: 'Christina Miller Hall',},
    {value: 'Muriel Spark Hall',},
    {value: 'Mary Fergusson Hall',},
    {value: 'Anna Macleod Hall',},
  ];
    return(
    <View>
      <Dropdown containerStyle={styles.dropdown} textColor="white" itemColor="black" selectedItemColor="black" baseColor="white" label='Select Hall' data={data}
      onChangeText = {(value) => this.setState({ hall: value })}/>
    </View>
  );
  }

  HallButton = () => {
    if(!this.state.loading){
      return(
      <TouchableOpacity onPress={() => this.ChangeHall()} style={styles.button}>
        <Text style={styles.header}>Change Hall</Text>
        <Icon containerStyle={styles.icon} size={25} color="white" name='ios-arrow-dropright' type='ionicon' />
      </TouchableOpacity>
      );
    }
    else{
      return(
      <View style={styles.button}>
        <Text style={styles.header}>Change Hall</Text>
        <Icon containerStyle={styles.icon} size={25} color="white" name='ios-arrow-dropright' type='ionicon' />
      </View>
      );
    }
  }

  CourseButton = () => {
    if(!this.state.loading){
      return(
        <TouchableOpacity onPress={() => this.ChangeCourse()} style={styles.button}>
          <Text style={styles.header}>Change Course Name</Text>
          <Icon containerStyle={styles.icon} size={25} color="white" name='ios-arrow-dropright' type='ionicon' />
        </TouchableOpacity>
      );
    }
    else{
      return(
        <View style={styles.button}>
          <Text style={styles.header}>Change Course Name</Text>
          <Icon containerStyle={styles.icon} size={25} color="white" name='ios-arrow-dropright' type='ionicon' />
        </View>
      );
    }
  }

  FullNameButton = () => {
    if(!this.state.loading){
      return(
        <TouchableOpacity onPress={() => this.ChangeFullName()} style={styles.button}>
          <Text style={styles.header}>Change Name</Text>
          <Icon containerStyle={styles.icon} size={25} color="white" name='ios-arrow-dropright' type='ionicon' />
        </TouchableOpacity>
      );
    }
    else{
      return(
        <View onPress={() => this.ChangeFullName()} style={styles.button}>
          <Text style={styles.header}>Change Name</Text>
          <Icon containerStyle={styles.icon} size={25} color="white" name='ios-arrow-dropright' type='ionicon' />
        </View>
      );
    }
  }

  render() {
    return (

    <ScrollView style={styles.container}>
      <View style={styles.section}>
        {this.Picker()}
        {this.HallButton()}
      </View>

      <View style={styles.section}>
        <TextInput placeholderTextColor="rgba(255,255,255,0.8)" placeholder="Insert Course Name" style={styles.placeholder} onChangeText={(text)=> this.setState({ course: text })}/>
          {this.CourseButton()}
      </View>

      <View style={styles.section}>
        <TextInput placeholderTextColor="rgba(255,255,255,0.8)" placeholder="Insert New Name" style={styles.placeholder} onChangeText={(text)=> this.setState({ name: text })}/>
          <TextInput placeholderTextColor="rgba(255,255,255,0.8)" placeholder="Insert New surname" style={styles.placeholder} onChangeText={(text)=> this.setState({ surname: text })}/>
          {this.FullNameButton()}
      </View>

    </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
section:{
  paddingTop:40,
},
container: {
  height:hp("100%"),
  width:wp("100%"),
  backgroundColor:'#0067b1',
},
dropdown:{
  marginLeft:15,
  marginRight:15,
  marginTop:-15
},
icon:{
  alignItems:"flex-end",
  paddingRight:10,
  marginTop:-27.5,
},
button:{
  margin:10,
  height:40,
  backgroundColor:"#9edd94",
},
header:{
  padding:5,
  fontSize:20,
  color:"white",
},
placeholder:{
  borderBottomWidth:1,
  borderBottomColor:"rgba(255,255,255,0.8)",
  textAlign:'left',
  margin:15,
  fontSize:20,
  color:"white"
},
});
