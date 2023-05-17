import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ReloadContainer from '../container/ReloadContainer';
import PaymentScreen from './Payment';
import OnlinePayment from './Payment/OnlinePayment';
import React from 'react';
import {QueryClient, QueryClientProvider} from 'react-query';
import ModalContainer from '../container/ModalContainer';

const HomeScreen = () => {
  const Stack = createNativeStackNavigator();
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Stack.Navigator initialRouteName="Reload">
        <Stack.Screen
          name="Reload"
          component={ReloadContainer}
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
          name="OnlinePayment"
          component={OnlinePayment}
          options={{
            headerShown: false,
          }}></Stack.Screen>
        <Stack.Screen
          name="Modal"
          component={ModalContainer}
          options={{
            headerShown: false,
          }}></Stack.Screen>
      </Stack.Navigator>
    </QueryClientProvider>
  );
};

export default HomeScreen;
