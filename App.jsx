/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/screens/Home';
import ReloadScreen from './src/screens/Reload';
import PaymentScreen from './src/screens/Payment';
import OnlineBankingScreen from './src/screens/Payment/OnlineBanking';
// import Host from 'host/Home';

// import {useStoreCounter} from 'host/store';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Reload"
          component={ReloadScreen}
          options={{
            headerShown: false,
          }}></Stack.Screen>
        <Stack.Screen
          name="Payment"
          component={PaymentScreen}
          options={{
            headerShown: false,
          }}></Stack.Screen>
        <Stack.Screen
          name="Bank"
          component={OnlineBankingScreen}
          options={{
            headerShown: false,
          }}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
