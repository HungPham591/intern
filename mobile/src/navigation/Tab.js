import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screen/Home';
import React from 'react';

const Tab = createBottomTabNavigator();

export default function bottomTabs() {
    return (
        <Tab.Navigator >
            <Tab.Screen name="Danh sách" component={Home} />
            <Tab.Screen name="Theo dõi" component={Home} />
            <Tab.Screen name="Biểu đồ" component={Home} />
            <Tab.Screen name="Thông báo" component={Home} />
            <Tab.Screen name="Cá nhân" component={Home} />
        </Tab.Navigator>
    );
}