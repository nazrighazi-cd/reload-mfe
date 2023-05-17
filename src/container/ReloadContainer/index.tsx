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
import isEmpty from 'lodash/isEmpty';
import includes from 'lodash/includes';
import Header from '../../components/Header';
import {useQuery} from 'react-query';
import xFetch from '../../services/xFetch';
import {deviceHeight, exNameEmail, fullURL, getUserRecord} from '../../utils';
import {GETHeader, ServiceList, reloadByPin} from '../../services';
import useZustandStoreRemote from '../../store/zustand';
import PinReload from '../../screens/Reload/PinReload';
import _ from 'lodash';

type ItemData = {
  id: string;
  title: string;
  text: string;
  freeCredit: string;
  price: string;
  digi_product_type: string;
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

let tabs = [
  {
    name: 'reload',
    index: 1,
    label: 'Online',
    icon: require('../../assets/icons/wallet.png'),
  },
  {
    name: 'pin',
    index: 2,
    label: 'Pin',
    icon: require('../../assets/icons/pin.png'),
  },
];

type ItemProps = {
  item: ItemData;
  onPress: () => void;
};

const formatNumber = (numb: number) => {
  let theNum = 0;
  try {
    theNum = typeof numb === 'number' ? numb : parseFloat(numb);
  } catch {}
  return theNum.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

const getOnlineDenomination = () => {
  return xFetch(fullURL(ServiceList.loadOnlineDenominations), {
    method: 'GET',
    header: GETHeader(),
  });
};

const ReloadContainer = (props: Props) => {
  let {navigation} = props;
  // const params = navigation && navigation.state && navigation.state.params;
  // const [selectedReloadValue, setSelectedReloadValue] = useState<ItemData>();
  const [pinValue, updatePinValue] = useState<string>();
  const [tabOption, setTabOption] = useState<string>('reload');
  const [ErrorResp, setErrorResp] = useState<boolean>(false);
  const {updateFrameHeight} = useZustandStoreRemote();
  const {
    onlineDenomination,
    updateOnlineDenomination,
    selectedReload,
    updateSelectedReload,
  } = useZustandStoreRemote();

  const {
    data: onlineDenominations,
    isLoading,
    isError,
  } = useQuery('onlineDenomination', getOnlineDenomination, {
    onSuccess: onlineDenominations => {
      if (!!onlineDenominations?.error) {
        setErrorResp(true);
        return;
      }
      const res = onlineReloadData(
        onlineDenominations?.data?.reloadVoiceDemoninations?.items,
      );
      console.log('res', res);
      updateOnlineDenomination(res);
      updateSelectedReload(res[0]);
    },
  });

  console.log('response ku', onlineDenominations);

  const renderItem = ({item}) => {
    const backgroundColor =
      item.id === selectedReload.id ? '#6e3b6e' : '#f9c2ff';
    const color = item.id === selectedReload.id ? 'white' : 'black';

    return <Item item={item} onPress={() => updateSelectedReload(item)} />;
  };

  const Item = ({item, onPress}: ItemProps) => (
    <TouchableOpacity
      className={`mt-[10px] bg-[#fff] p-[15px] flex-row items-center rounded-[10px] relative overflow-hidden w-full flex-1 ${
        selectedReload.title === item.title ? 'border border-[#06176E]' : ''
      }`}
      onPress={onPress}
      id={item.id}>
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
              {item.title}
            </Text>
            <Text className="text-[12px] text-[#333333] font-['Poppins-Regular']">
              {item.text}
            </Text>
          </View>
          <View className="pl-[16px] flex-1 relative h-100 justify-end items-start">
            <View className="w-full items-end">
              <Text className="text-[12px] text-[#333333]  h-100 font-['Poppins-Regular']">
                {item.freeCredit}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const changeTab = (name: string) => {
    setTabOption(name);
  };

  const changePinValue = (value: string) => {
    updatePinValue(value);
  };

  const onClickNext = () => {
    if (tabOption == 'reload') {
      navigation.navigate('Payment', {
        // contact: share,
        sku: selectedReload.sku,
        item: {
          ...selectedReload,
          id: selectedReload.title,
          paymentFor: 'reload',
          value: selectedReload.price,
          digi_product_type: selectedReload.digi_product_type,
        },
        title: 'Reload',
        // description: description,
        paymentFor: 'reload',
        // isShare: !!share,
        isShare: false,
      });
    } else {
      handleReload();
    }
  };

  const handleReload = () => {
    const values = pinValue;
    const userRecord = getUserRecord();
    if (values) {
      const onlyNums = values && values.replace(/[^\d]/g, '');
      // const msisdn =
      //   this.props.currentContact && this.props.currentContact.msisdn;

      // this.setState({buttonDisable: true});

      reloadByPin({pin: onlyNums})
        .then(res => {
          const {data, error} = res || ({} as any);
          const isSuccess = !_.isEmpty(data) && _.isEmpty(error);
          let {email} = exNameEmail(userRecord) || ({} as any);
          const {VoucherReloadResponse} = data || ({} as any);
          const {PrepaidAccount} = VoucherReloadResponse || ({} as any);
          const {VoucherFaceValue} = PrepaidAccount || ({} as any);

          if (isSuccess) {
            // MYDIGI3-2629 track reload_success

            const config = {
              success: true,
              message: 'Pin Success',
            };

            // toggleCommonReciept(config);
            navigation.navigate('Modal', {config});
          } else {
            const config = {
              success: false,
              message: 'Pin Success',
            };

            // toggleCommonReciept(config);
            navigation.navigate('Modal', {config});
          }
        })
        .catch(ex => {})
        .finally(() => {
          // this.setState({buttonDisable: false});
        });
    }
  };

  const onlineReloadData = onlineDenomination => {
    return !isEmpty(onlineDenomination)
      ? onlineDenomination &&
          onlineDenomination.map((obj: any) => {
            let validity;
            let freeCredit;
            let digi_product_type;
            try {
              validity =
                obj['custom_attributes'] &&
                obj['custom_attributes'].find(
                  (re: any) => re['attribute_code'] === 'ngbss_reload_ext',
                );
              validity = !!validity && validity.value;
            } catch (er) {}
            try {
              freeCredit =
                obj['custom_attributes'] &&
                obj['custom_attributes'].find(
                  (re: any) =>
                    re['attribute_code'] === 'ngbss_reload_free_credit',
                );
              freeCredit = !!freeCredit && freeCredit.value;
            } catch (er) {}
            try {
              digi_product_type =
                obj['custom_attributes'] &&
                obj['custom_attributes'].find(
                  (re: any) => re['attribute_code'] === 'digi_product_type',
                );
              digi_product_type =
                !!digi_product_type && digi_product_type.value;
            } catch (er) {}
            return {
              ...obj,
              title: !!obj.price ? 'RM' + formatNumber(obj.price) : '',
              text: !!validity ? validity : '',
              freeCredit: !!freeCredit ? freeCredit : '',
              digi_product_type: !!digi_product_type ? digi_product_type : null,
            };
          })
      : null;
  };

  useEffect(() => {
    const {navigation} = props;
    const params = navigation && navigation.state && navigation.state.params;
    const share = params && params.share && params.share;
  }, []);

  if (isLoading || isError) {
    return <Text>Loading</Text>;
  }

  return (
    <SafeAreaView>
      <View
        className="bg-[#F2F3F7] h-screen flex"
        onLayout={obj => {
          const {nativeEvent} = obj || ({} as any);
          const {layout} = nativeEvent || ({} as any);
          const {height: he} = layout || ({} as any);

          if (deviceHeight() - he > 5) return;

          updateFrameHeight(he);
        }}>
        <View className="mx-[20px] flex-1">
          <Header onPress={() => navigation.goBack()} />

          {/* reload tab mt-[30px] */}
          <View className="w-100 rounded-[50px] bg-white flex-row flex-none">
            {tabs.map(option => {
              if (option.name == tabOption) {
                return (
                  <TouchableOpacity
                    key={option.index}
                    className="w-[50%] rounded-[50px] py-[15px] px-[25px] bg-[#06176E] flex flex-row items-center justify-center"
                    onPress={() => {
                      changeTab(option.name);
                    }}>
                    <Image
                      source={option.icon}
                      style={{
                        width: 21,
                        height: 21,
                        tintColor: '#fff',
                      }}></Image>
                    <Text className="pl-[10px] text-white text-[14px] font-semibold text-center font-['Poppins-SemiBold']">
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity
                    key={option.index}
                    className="w-[50%] rounded-[50px] py-[15px] px-[25px] flex flex-row items-center justify-center"
                    onPress={() => {
                      changeTab(option.name);
                    }}>
                    <Image
                      source={option.icon}
                      style={{
                        width: 21,
                        height: 21,
                        tintColor: '#000',
                      }}></Image>
                    <Text className="pl-[10px] text-[14px] font-semibold text-center font-['Poppins-SemiBold']">
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              }
            })}
          </View>

          {/* Reload online */}
          {tabOption == 'reload' ? (
            <View className="pt-[20px] flex-1">
              <Text className="text-[#333333] font-semibold text-[14px] font-['Poppins-SemiBold']">
                Reload Amount
              </Text>
              <FlatList
                data={onlineDenomination}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                extraData={selectedReload}
                contentInset={{bottom: 130}}
              />
            </View>
          ) : (
            <PinReload pinValue={pinValue} changePinValue={changePinValue} />
          )}
        </View>

        <View className="absolute bottom-[20px] left-0 w-full">
          <View className="bg-[#fff] p-[24px] rounded-t-[20px]">
            <View className="flex flex-row justify-between">
              {tabOption == 'reload' && (
                <View>
                  <Text className="text-[12px] font-['Poppins-Regular'] text-[#333333]">
                    Total Amount
                  </Text>
                  <Text className="font-semibold text-[22px] font-['Poppins-SemiBold'] text-[#333333]">
                    {selectedReload.title}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                onPress={() => onClickNext()}
                disabled={tabOption == 'reload' && isEmpty(selectedReload)}
                className={`${tabOption == 'pin' && 'w-full'} r`}>
                <View
                  className={`py-[15px] px-[75px]  rounded-[30px] ${
                    tabOption == 'pin' && 'w-full items-center'
                  } ${
                    tabOption == 'reload' && isEmpty(selectedReload)
                      ? 'bg-[#CCCCCC]'
                      : 'bg-[#4399D9]'
                  }`}>
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
