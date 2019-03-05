import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import Create from '../screens/CreateEvent';


export default createAppContainer(createStackNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html

  Then: Create,
}));
