import React from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import Header from '../../components/Header';

const PaymentScreen = () => {
  return (
    <SafeAreaView>
      <View className=" bg-[#F2F3F7] h-screen flex">
        <View className="mx-[20px]">
          <Header />

          <View className="pt-[10px]">
            <Text className="text-[#333333] font-semibold text-[14px]">
              Reload Amount
            </Text>

            <View className="mt-[10px] bg-[#fff] p-[15px] flex-row items-center rounded-[10px] relative overflow-hidden w-full">
              <View className="flex-row w-full relative">
                <View className="rounded-[8px] p-[14px]  bg-[#F2F3F4] self-start">
                  <Image
                    source={require('../../assets/icons/reload.png')}
                    style={{
                      width: 21,
                      height: 21,
                      tintColor: '#000',
                    }}></Image>
                </View>
                <View className="flex-1 flex-row my-auto">
                  <View className="pl-[20px]">
                    <Text className="text-[14px] font-semibold text-[#333333]">
                      RM 5.00
                    </Text>
                    <Text className="text-[12px] text-[#333333] ">
                      Validity: 365 Days
                    </Text>
                  </View>
                  {/* <View className="pl-[16px] flex-1 relative h-100 justify-end items-start">
          <View className="w-full items-end">
            <Text className="text-[12px] text-[#333333]  h-100">
              Free RM0.25 Credit + 150MB
            </Text>
          </View>
        </View> */}
                </View>
              </View>
            </View>
          </View>

          <View className="pt-[20px]">
            <Text className="text-[#333333] font-semibold text-[14px]">
              Preferred Payment Method
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
                    <Text className="font-semibold">Online Banking</Text>
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

        <View className="absolute bottom-[20px] left-0 w-full">
          <View className="bg-[#fff] p-[24px] rounded-t-[20px]">
            <View className="flex flex-row justify-between">
              <View>
                <Text className="text-[12px]">Total Amount</Text>
                <Text className="font-semibold text-[22px]">RM10.00</Text>
              </View>

              <TouchableOpacity>
                <View className="py-[15px] px-[75px] bg-[#4399D9] rounded-[30px]">
                  <Text className="text-[14px] font-semibold text-white">
                    Next
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PaymentScreen;
