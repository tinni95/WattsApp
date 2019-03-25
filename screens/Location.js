import React from 'react';
import { Location, TaskManager,Permissions,Constants } from 'expo';
import { Text, TouchableOpacity } from 'react-native';

const LOCATION_TASK_NAME = 'background-location-task';

export default class Component extends React.Component {
  onPress = async () => {
          console.log("start");
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
                  console.log("start2");
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
    });
  };

  render() {
    return (
      <TouchableOpacity style={{marginTop:50}} onPress={this.onPress}>
        <Text >Enable background location</Text>
      </TouchableOpacity>
    );
  }
}

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {

  if (error) {
    console.log(error);
    return;
  }
  if (data) {
    const { locations } = data;
    console.log("device",Constants.deviceYearClass);
       console.log("lat: ",locations[0]["coords"]["latitude"].toString().substring(0,7));
       console.log("long: ",locations[0]["coords"]["longitude"].toString().substring(0,7));

  }
});
