import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import EventStack from './EventStack';
import CreateEventStack from './CreateEventStack';
import MainTabNavigator from './MainTabNavigator';
import UserOnEvent from '../screens/UserOnEvent';
import Registration from '../screens/registration';
import Register from '../screens/Register';



export default createAppContainer(createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: Registration,
  Register: Register,
  Then: MainTabNavigator,
}));
