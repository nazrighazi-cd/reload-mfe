import React, {useState} from 'react';
import {Image, Text, TextInput, View} from 'react-native';

const PinReload = ({pinValue, changePinValue}) => {
  return (
    <View className="pt-[20px] flex-1">
      <Text className="text-[#333333] font-['Poppins-SemiBold'] text-[14px]">
        Reload Pin
      </Text>
      <View className="mt-[10px] bg-[#fff] p-[16px] rounded-[10px]">
        <View className="flex-row w-full relative">
          <View className="rounded-[8px] p-[14px]  bg-[#F2F3F4] self-start">
            <Image
              source={require('../../assets/icons/pin-phone.png')}
              style={{
                width: 21,
                height: 21,
                tintColor: '#000',
              }}></Image>
          </View>
          <View className="flex-1 flex-row my-auto w-full">
            <View className="pl-[20px] w-full">
              <TextInput
                editable
                placeholder="Enter 15 or 16 digit PIN"
                placeholderTextColor={'#CCCCCC'}
                maxLength={16}
                onChangeText={changePinValue}
                value={pinValue}
                style={{
                  padding: 10,
                  fontSize: 14,
                  fontWeight: '600',
                }}></TextInput>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PinReload;
