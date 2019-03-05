import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import Login from '../screens/Login';
import Register from '../screens/Register';
import PasswordForgot from '../screens/PasswordForgot';



export default createAppContainer(createStackNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: Login,
  Register: Register,
  Password: PasswordForgot,
}));
