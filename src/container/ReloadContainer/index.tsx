import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Header';

type ItemData = {
  id: string;
  title: string;
};

type Props = {
  navigation: any;
  // loadReloadHistory: Function;
  // loadTalkTimeData: Function;
  // LoadValidityList: Function;
  // loadTransferList: Function;
  // loadOnlineDenominations: Function;
  // talkTimeList?: any;
  // validityList?: any;
  // reloadHistory?: any;
  // transferList?: any;
  // onlineDenominations?: any;
};

type State = {
  selectedId: string;
  value: string;
};

let tabs = [
  {
    name: 'reload',
    index: 1,
    label: 'Online Reload',
  },
  {
    name: 'pin',
    index: 2,
    label: 'Via Pin',
  },
];

const DATA: ItemData[] = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  // {
  //   id: '58694a0f-3da1-471f-bd96-145571e29d72',
  //   title: 'Third Item',
  // },
  // {
  //   id: '58694a0f-3da1-471f-bd96-145571e29d73',
  //   title: 'Forth Item',
  // },
  // {
  //   id: '58694a0f-3da1-471f-bd96-145571e29d74',
  //   title: 'Fifth Item',
  // },
  // {
  //   id: '58694a0f-3da1-471f-bd96-145571e29d75',
  //   title: 's Item',
  // },
  // {
  //   id: '58694a0f-3da1-471f-bd96-145571e29d76',
  //   title: 'se Item',
  // },
  // {
  //   id: '58694a0f-3da1-471f-bd96-145571e29d77',
  //   title: 'ei Item',
  // },
  // {
  //   id: '58694a0f-3da1-471f-bd96-145571e29d78',
  //   title: 'ni Item',
  // },
  // {
  //   id: '58694a0f-3da1-471f-bd96-145571e29d79',
  //   title: 'te Item',
  // },
  // {
  //   id: '58694a0f-3da1-471f-bd96-145571e29d80',
  //   title: 'el Item',
  // },
  // {
  //   id: '58694a0f-3da1-471f-bd96-145571e29d81',
  //   title: 'tw Item',
  // },
];

type ItemProps = {
  item: ItemData;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
};

const Item = ({item, onPress, backgroundColor, textColor}: ItemProps) => (
  <View className="mt-[10px] bg-[#fff] p-[15px] flex-row items-center rounded-[10px] relative overflow-hidden w-full flex-1 ">
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
          <Text className="text-[14px] font-semibold text-[#333333] font-['Poppins-SemiBold']">
            RM 5.00
          </Text>
          <Text className="text-[12px] text-[#333333] font-['Poppins-Regular']">
            365 Days
          </Text>
        </View>
        <View className="pl-[16px] flex-1 relative h-100 justify-end items-start">
          <View className="w-full items-end">
            <Text className="text-[12px] text-[#333333]  h-100 font-['Poppins-Regular']">
              Free RM0.25 Credit + 150MB
            </Text>
          </View>
        </View>
      </View>
    </View>
  </View>
);

const ReloadContainer = (props: Props) => {
  const [selectedId, setSelectedId] = useState<string>();
  const [value, onChangeText] = useState<string>(
    'Useless Multiline Placeholder',
  );
  const [tabOption, setTabOption] = useState<number>(1);

  useEffect(() => {
    const {navigation} = props;
    const params = navigation && navigation.state && navigation.state.params;
    const share = params && params.share && params.share;

    // if (!!share) {
    //   this.props.loadTransferList();
    // }

    // this.props.loadOnlineDenominations(share);
  }, []);

  const renderItem = ({item}: {item: ItemData}) => {
    const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';
    const color = item.id === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  const changeTab = (index: number) => {
    setTabOption(index);
  };

  return (
    <SafeAreaView>
      <View className="bg-[#F2F3F7] h-screen flex">
        <View className="mx-[20px] flex-1">
          <Header />

          {/* reload tab mt-[30px] */}
          <View className="w-100 rounded-[50px] bg-white flex-row flex-none">
            {tabs.map(option => {
              if (option.index == tabOption) {
                return (
                  <TouchableOpacity
                    key={option.index}
                    className="w-[50%] rounded-[50px] py-[15px] px-[25px] bg-[#06176E]"
                    onPress={() => {
                      changeTab(option.index);
                    }}>
                    <Text className="text-white text-[14px] font-semibold text-center font-['Poppins-SemiBold']">
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity
                    key={option.index}
                    className="w-[50%] rounded-[50px] py-[15px] px-[25px]"
                    onPress={() => {
                      changeTab(option.index);
                    }}>
                    <Text className=" text-[14px] font-semibold text-center font-['Poppins-SemiBold']">
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              }
            })}
          </View>

          {/* Reload online */}
          {/* <View className="pt-[20px] flex-1">
            <Text className="text-[#333333] font-semibold text-[14px] font-['Poppins-SemiBold']">
              Reload Amount
            </Text>
            <FlatList
              data={DATA}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              extraData={selectedId}
              contentInset={{bottom: 130}}
            />
          </View> */}

          {/* Reload pin */}
          <View className="pt-[20px] flex-1">
            <Text className="text-[#333333] font-semibold text-[14px]">
              Reload Pin
            </Text>
            <View className="mt-[10px] bg-[#fff] p-[16px] rounded-[10px]">
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
                  <View className="pl-[20px] w-100">
                    <TextInput
                      editable
                      placeholder="Enter 15 or 16 digit PIN"
                      placeholderTextColor={'#CCCCCC'}
                      maxLength={16}
                      onChangeText={onChangeText}
                      value={value}
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
        </View>
        <View className="absolute bottom-[20px] left-0 w-full">
          <View className="bg-[#fff] p-[24px] rounded-t-[20px]">
            <View className="flex flex-row justify-between">
              <View>
                <Text className="text-[12px] font-['Poppins-Regular']">
                  Total Amount
                </Text>
                <Text className="font-semibold text-[22px] font-['Poppins-SemiBold']">
                  RM10.00
                </Text>
              </View>

              <TouchableOpacity>
                <View className="py-[15px] px-[75px] bg-[#4399D9] rounded-[30px]">
                  <Text className="text-[14px] font-semibold text-white font-['Poppins-SemiBold']">
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

export const styles = StyleSheet.create({
  poppins: {
    fontFamily: 'Poppins-Regular',
  },
});

export default ReloadContainer;
