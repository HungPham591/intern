import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screen/Login'
import BottomTabs from './Tab';
import React from 'react';

const Stack = createStackNavigator();

export default function mainNavigation() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} options={{headerShown: false}}  />
            <Stack.Screen name="Tab" component={BottomTabs} options={{headerShown: false}} />
        </Stack.Navigator>
    );
}