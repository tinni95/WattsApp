import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/JoinedEvents';
import UserPage from '../screens/UserPage';
import DiscoverPage from '../screens/DiscoverPage';
import EventPage from '../screens/EventPage';
import CreateEvent from '../screens/CreateEvent';
import UserOnEvent from '../screens/UserOnEvent';
import UserEvents from '../screens/UserEvents';
import EditEvent from '../screens/EditEvent';
import More from '../screens/More';
import ChangePassword from '../screens/ChangePassword';
import ChangeDetails from '../screens/ChangeDetails';
import Notify from '../screens/Notify';


const HomeStack = createStackNavigator({
  Home: HomeScreen,
  EventPage: EventPage,
  UserOnEvent : UserOnEvent
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Joined',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-thumbs-up`
          : 'md-ithumbs-up'
      }
    />
  ),
};

const LinksStack = createStackNavigator({
  Links: UserPage,
  CreateEvent : CreateEvent,
  UserEvents : UserEvents,
  EditEvent : EditEvent,
  More : More,
  EventPage: EventPage,
  ChangeDetails:ChangeDetails,
  ChangePassword:ChangePassword,
  Notify:Notify,
  UserOnEvent : UserOnEvent
});

LinksStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-contact` : 'md-contact'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Discover: DiscoverPage,
  EventPage: EventPage,
  AddEvent : CreateEvent,
  UserOnEvent : UserOnEvent
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Discover',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-contacts` : 'md-contacts'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  LinksStack,
  SettingsStack,
});
