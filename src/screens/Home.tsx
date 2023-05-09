import {ParamListBase, useNavigation} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {Button, SafeAreaView, ScrollView, Text, View} from 'react-native';

const Home1 = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  return (
    <SafeAreaView>
      <View>
        <Text>This is from Home1 Screen</Text>
        <Button
          title="Go to Home2 Page"
          onPress={() => {
            navigation.navigate('Home2');
          }}></Button>
        <Button
          title="Go to Reload Page"
          onPress={() => {
            navigation.navigate('Reload');
          }}></Button>

        <Button
          title="Go to Payment Page"
          onPress={() => {
            navigation.navigate('Payment');
          }}></Button>

        <Button
          title="Go to Bank Page"
          onPress={() => {
            navigation.navigate('Bank');
          }}></Button>
      </View>
    </SafeAreaView>
  );
};
const Home2 = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  return (
    <SafeAreaView>
      <View>
        <Text>This is from Home2 Screen</Text>
        <Button
          title="Go to Home1 Page"
          onPress={() => {
            navigation.navigate('Home1');
          }}></Button>
      </View>
    </SafeAreaView>
  );
};
const HomeScreen = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="Home1">
      <Stack.Screen name="Home1" component={Home1} />
      <Stack.Screen name="Home2" component={Home2} />
    </Stack.Navigator>
  );
};

export default HomeScreen;
