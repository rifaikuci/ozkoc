import React from 'react';

import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer} from '@react-navigation/native';
import {Home, List, Main} from "./src/screens";
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
                initialRouteName={'Main'}
            >
                <Stack.Screen name="Main" component={Main}/>
                <Stack.Screen name="Home" component={Home}/>
                <Stack.Screen name="List" component={List}/>

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App;
