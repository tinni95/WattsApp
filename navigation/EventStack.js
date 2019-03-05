import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import Event from '../screens/EventPage';
import UserOnEvent from '../screens/UserOnEvent';
import MainTabNavigator from './MainTabNavigator';


export default createAppContainer(createStackNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: Event,
  UoEvent: UserOnEvent,
}));
