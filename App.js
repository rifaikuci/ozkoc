import React from 'react';

import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer} from '@react-navigation/native';
import {Home} from "./src/screens";


const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
                initialRouteaName={'Home'}
            >
                <Stack.Screen name="Home" component={Home}

                />

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App;