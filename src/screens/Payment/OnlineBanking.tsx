import React from 'react';
import {Image, SafeAreaView, Text, View} from 'react-native';
import Header from '../../components/Header';

const OnlineBankingScreen = () => {
  return (
    <SafeAreaView>
      <View className="h-screen flex">
        <View className="mx-[20px]">
          <Header />
          <View className="pt-[10px]">
            <Text className="text-[#333333] font-semibold text-[14px]">
              Preferred Bank
            </Text>

            <View className="mt-[10px] bg-[#fff] p-[15px] flex-row items-center rounded-[10px] relative overflow-hidden w-full border border-[#06176E]">
              <View className="flex-row w-full relative">
                <View className="rounded-[8px] p-[14px]  bg-[#F2F3F4] self-start">
                  <Image
                    source={require('../../assets/icons/bank-online-banking.png')}
                    style={{
                      width: 21,
                      height: 21,
                      tintColor: '#000',
                    }}></Image>
                </View>
                <View className="flex-1 flex-row my-auto ">
                  <View className="pl-[20px] flex flex-row justify-between w-full">
                    <Text className="font-semibold">Maybank2U</Text>
                    <Image
                      source={require('../../assets/icons/tick-yes-filled.png')}
                      style={{
                        width: 21,
                        height: 21,
                        tintColor: '#06176E',
                      }}></Image>
                  </View>
                </View>
              </View>
            </View>

            <View className="mt-[10px] bg-[#fff] p-[15px] flex-row items-center rounded-[10px] relative overflow-hidden w-full border border-[#06176E]">
              <View className="flex-row w-full relative">
                <View className="rounded-[8px] p-[14px]  bg-[#F2F3F4] self-start">
                  <Image
                    source={require('../../assets/icons/bank-online-banking.png')}
                    style={{
                      width: 21,
                      height: 21,
                      tintColor: '#000',
                    }}></Image>
                </View>
                <View className="flex-1 flex-row my-auto ">
                  <View className="pl-[20px] flex flex-row justify-between w-full">
                    <Text className="font-semibold">CIMB Clicks</Text>
                    <Image
                      source={require('../../assets/icons/tick-yes-filled.png')}
                      style={{
                        width: 21,
                        height: 21,
                        tintColor: '#06176E',
                      }}></Image>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View className="pt-[20px]">
            <Text className="text-[#333333] font-semibold text-[14px]">
              Other Bank
            </Text>

            <View className="mt-[10px] bg-[#fff] p-[15px] flex-row items-center rounded-[10px] relative overflow-hidden w-full border border-[#06176E]">
              <View className="flex-row w-full relative">
                <View className="rounded-[8px] p-[14px]  bg-[#F2F3F4] self-start">
                  <Image
                    source={require('../../assets/icons/bank-online-banking.png')}
                    style={{
                      width: 21,
                      height: 21,
                      tintColor: '#000',
                    }}></Image>
                </View>
                <View className="flex-1 flex-row my-auto ">
                  <View className="pl-[20px] flex flex-row justify-between w-full">
                    <Text className="font-semibold">Maybank2U</Text>
                    <Image
                      source={require('../../assets/icons/tick-yes-filled.png')}
                      style={{
                        width: 21,
                        height: 21,
                        tintColor: '#06176E',
                      }}></Image>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnlineBankingScreen;
