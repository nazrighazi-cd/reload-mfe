import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import LottieView from 'lottie-react-native';
import useZustandStoreRemote from '../../store/zustand';

const ModalContainer = ({navigation, route}) => {
  const {selectedReload} = useZustandStoreRemote();
  console.log('return prams', route.params);
  const {config} = route.params;
  return (
    <View className="bg-[#F2F3F7] min-h-screen max-h-screen w-full flex-1">
      <View className="flex flex-row justify-center my-[40px] ">
        <Text className="font-['Poppins-SemiBold'] text-[16px]">Reload</Text>
      </View>
      <View className="mx-[20px] bg-[#fff] rounded-[10px]  px-[20px] py-[30px] w-100 relative">
        <View className="text-center items-center justify-center w-full">
          {config.success ? (
            <LottieView
              source={require('../../assets/animation/success.json')}
              autoPlay
              resizeMode="contain"
              loop={true}
              style={{
                width: 160,
                height: 160,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            />
          ) : (
            <LottieView
              source={require('../../assets/animation/fail.json')}
              autoPlay
              resizeMode="contain"
              loop={true}
              style={{
                width: 160,
                height: 160,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            />
          )}
        </View>
        <View className="py-[30px] items-center justify-center">
          <Text className="font-['Poppins-SemiBold'] text-[20px]">
            {config.success ? 'Awesome' : 'Oops! Try Again'}
          </Text>
          <Text className="font-['Poppins-Regular'] text-[16px]">
            {config.success ? 'Reload Successfully!' : 'Reload Unsuccessful!'}
          </Text>
        </View>
        <View className="border border-[#DDDDDD] mb-[30px]"></View>
        <View className=" flex flex-row justify-between">
          <Text className="font-['Poppins-Regular'] text-[16px]">
            Reload Amount
          </Text>
          <Text className="font-['Poppins-SemiBold'] text-[16px]">
            {selectedReload.title}
          </Text>
        </View>
        <View className="flex flex-row justify-between">
          <Text className="font-['Poppins-Regular'] text-[16px]">Validity</Text>
          <Text className="font-['Poppins-SemiBold'] text-[16px]">
            {selectedReload.text}
          </Text>
        </View>
        <View className="mt-[20px] justify-center items-center w-100">
          <TouchableOpacity
            onPress={() => navigation.replace('Home')}
            className="rounded-full bg-[#4399D9] px-[48px] py-[15px] w-fit">
            <Text className="text-white font-['Poppins-SemiBold'] text-[14px]">
              Go Back Home
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ModalContainer;
