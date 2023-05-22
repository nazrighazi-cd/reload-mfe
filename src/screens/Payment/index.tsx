import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  InteractionManager,
  ListRenderItem,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Header';
import useZustandStoreRemote from '../../store/zustand';
import {exNameEmail, fullURL} from '../../utils';
import isEmpty from 'lodash/isEmpty';
//@ts-ignore
import useTokeStore from 'mfe_poc_main/ZustandStore';
import xFetch from '../../services/xFetch';
import {GETHeader, ServiceList, retriveSession} from '../../services';
import {useQuery} from 'react-query';
type IPaymentMethod = {
  id: number;
  feature: string;
  title: string;
  icon: any;
  iconWidth: number;
  showItem: boolean;
};

const paymentMethodList: IPaymentMethod[] = [
  {
    id: 1,
    feature: '1',
    title: 'Online Banking',
    icon: require('../../assets/icons/bank-online-banking.png'),
    iconWidth: 25,
    // pressHandler: () => {
    //   setSelectedFeature('1');
    // },
    showItem: true,
  },
];

const PaymentScreen = props => {
  console.log('props', props);
  console.log('paramss', props.route.params);
  const {selectedReload} = useZustandStoreRemote();
  const [Email, setEmailAddress] = useState<string>('');
  const [selectedFeature, setSelectedFeature] = useState<string>('1');
  const {ssi, userRecord, updateUserRecord, updateAmount} = useTokeStore();
  const {paymentFor} = props;
  const setEmail = () => {
    let emailVal;
    let newState = {};

    try {
      const {subscriberRecord} = userRecord || ({} as any);
      const {dguardInfo} = subscriberRecord || ({} as any);

      let {email, dguardid} = exNameEmail(userRecord) || ({} as any);

      if (isEmpty(dguardInfo)) {
        if (isEmpty(dguardid)) newState = {isNotDguard: true};
        // is not a vail dguard account
        else newState = {isBasic: true}; // is a vail dguard account with basic access
      } else {
        newState = {isNotDguard: false, isBasic: false};
      }

      emailVal = isEmpty(email) ? '' : email;
      setEmailAddress(email);
    } catch (er) {
      console.log({er});
      emailVal = '';
    }
  };

  useEffect(() => {
    setEmail();
  }, []);

  const handleReciept = pack => {
    const {
      params,
      sku,
      success,
      fail,
      isShare,
      resolve,
      navigation,
      reciept,
      paymentFor,
      item,
      rewardeComScreenName,
    } = pack || ({} as any);

    // const newReciept = ["reward", "addon"];
    // if (!!newReciept.find((ky) => ky === paymentFor))
    //   return this.handleNewReceipt(pack); //use new function for handle reward receipt

    // const isReload = paymentFor === 'reload';

    const errMsg = !!params && !!params.error_desc ? params.error_desc : '';

    InteractionManager.runAfterInteractions(() => {
      //MYDIGI3-2425 to make reciept have 2 buttons for reload online only
      let addConfig = {
        secondButton: null,
        secondButtonText: null,
        afterFunction2: null,
        btnText: null,
        afterFunction: null,
      };

      //general after function
      addConfig['afterFunction'] = () => {
        // pullToReload("Usage");
        // if (checkPostRedirect()) {
        //   if (!!resolve) resolve(true);
        //   return;
        // }
        // navigation.navigate("Usage");
        // if (!!resolve) resolve(true);
      };

      //means from reload
      if (paymentFor === 'reload' && success && !isShare) {
        //secondary button (white button)
        addConfig['secondButton'] = true;
        addConfig['secondButtonText'] = 'Go To Home';
        addConfig['afterFunction2'] = () => {
          // pullToReload("Usage");
          // if (checkPostRedirect()) {
          //   if (!!resolve) resolve(true);
          //   return;
          // }
          // navigation.navigate("Usage");
          // if (!!resolve) resolve(true);
        };

        //primary button (blue button)
        // addConfig["btnText"] = messages("mobile.reload.buyAddon");
        // addConfig["afterFunction"] = () => {
        //   pullToReload("Usage");
        //   navigation.navigate("BuyAddOns", { goBackUsage: true });
        //   if (!!resolve) resolve(true);
        // };

        try {
          const {successCallback} = props.route.params || ({} as any);
          if (!!successCallback) successCallback();
        } catch (er) {}
      }

      if (fail) {
        //secondary button (white button)
        addConfig['secondButton'] = true;
        addConfig['secondButtonText'] = 'Go To Home';
        addConfig['afterFunction2'] = () => {
          // pullToReload('Usage');
          // if (checkPostRedirect()) {
          //   if (!!resolve) resolve(true);
          //   return;
          // }
          // navigation.navigate('Usage');
          // if (!!resolve) resolve(true);
        };

        //primary button (blue button)
        // addConfig['btnText'] = messages('mobile.payment.retry');
        // addConfig['afterFunction'] = () => {
        //   frScreenName(
        //     !!sku ? 'reload - online - retry' : 'bills - pay bill - retry',
        //   );
        //   // bill payment
        //   isBill && InsiderObj.tagInsiderEvent('bills_pay_bill_retry');

        //   navigation.navigate('PayForm');
        // };
      }

      if (!success) {
        if (!!params && params.cccp_order_id) {
          if (!!reciept.find(item => item.title === 'Order ID')) {
          } else {
            reciept.unshift({
              title: 'Order ID',
              text: params.cccp_order_id,
              order: 0,
            });
          }
        }
      }

      const config = {
        success: success,
        message:
          !!sku && success
            ? 'Reload successful! Please wait a few minutes for your reload and status to be reflected'
            : `Reload payment failed ${errMsg}`,
        list: reciept,
        ...addConfig,
      };

      console.log('masuk ke');
      InteractionManager.runAfterInteractions(() => {
        refetch();

        if (!isLoading) {
          props.navigation.navigate('Modal', {config});
        }
      });
    });
  };

  const getSession = async () => {
    const msisdn = userRecord.subscriberRecord.MSISDN || null;
    let ssResp = await retriveSession();
    return ssResp;
  };

  const {isLoading, refetch} = useQuery('checkSession', getSession, {
    enabled: false,
    onSuccess: res => {
      if (res?.data?.valid) {
        updateUserRecord(res?.data);
        updateAmount(
          res?.data.subscriberRecord._raw.accountBalance.BalanceList
            .BalanceRecord[0].Amount,
        );
      }
    },
  });

  const handle3Dpayment = pack => {
    const {navigation, route} = props;

    let {triggerNBAReloadGA} = route.params || ({} as any);

    let objToSend = {};
    let reciept = [];

    const {
      values,
      selectedCard,
      paymentFor,
      sku,
      rewardId,
      offerId,
      additional_data,
      roamingProduct,
      force,
      contact,
      isAboveThreshold,
      isShare,
      additionalParams,
      item,
      rewardeComScreenName,
    } = pack || ({} as any);

    let amount = values.amount && values.amount.replace(/,/g, '');
    amount = !!amount && parseFloat(amount);

    objToSend['paymentFor'] = paymentFor;
    const checkAmount = ['bill', 'reward', 'addon'];

    if (!!checkAmount.find(ky => ky === paymentFor) && !!values && amount > 0) {
      objToSend['amount'] = parseFloat(amount.toString()).toFixed(2);
      reciept.push({
        title: 'Amount',
        text: `RM ${values.amount}`,
        order: 2,
      });
    }

    if (!isEmpty(values.Email)) {
      objToSend['email'] = values.Email.toString();
    }

    if (!!sku) {
      objToSend['sku'] = sku;
    }

    if (!!rewardId) {
      objToSend['rewardId'] = rewardId;
      const {caId, caType} = item || ({} as any);

      if (!!caId) objToSend['caId'] = caId;
      if (!!caType) objToSend['caType'] = caType;
    }

    if (!!offerId) {
      objToSend['offerId'] = offerId;
    }

    if (!!additional_data) {
      objToSend['additional_data'] = additional_data;
    } else {
      //create additional data key for reload and bill
      objToSend['additional_data'] = JSON.stringify({
        paymentFor,
        amount,
      });
    }

    if (!!roamingProduct) {
      objToSend = {
        ...objToSend,
        ...roamingProduct,
      };
    }

    if (!!force) {
      objToSend['force'] = true;
    }

    if (!!contact && contact['msisdn']) {
      objToSend['contact'] = contact['msisdn'];
      reciept.push({
        title: 'Recipient',
        text: contact['msisdn'],
        order: 3,
      });
    }

    if (!!additionalParams) {
      objToSend = {...objToSend, ...additionalParams};
    }

    console.log('obj', objToSend);
    // setEWalletPayment({
    //   pack,
    //   triggerNBAReloadGA,
    //   userRecord: this.props.userRecord,
    // });

    navigation.navigate('OnlinePayment', {
      redirectTo: 'OnlinePayment',
      ...objToSend,
      func: ({success, fail, params = {} as any, loading}) => {
        return new Promise(resolve => {
          // error message come from backend
          // if there is an error message come from backend, show it
          // otherwise show the message backoffice
          // const userRecord = getUserRecord();
          const pack2 = {
            params,
            sku,
            rewardId,
            offerId,
            success,
            fail,
            isShare,
            resolve,
            navigation,
            reciept,
            values,
            loading,
            paymentFor,
            item,
            rewardeComScreenName,
          };
          handleReciept(pack2);

          // handle3DEvents({
          //   ...pack,
          //   ...pack2,
          //   params,
          //   success,
          //   userRecord: userRecord,
          //   rewardeComScreenName,
          //   nbaTransaction: pack2,
          //   triggerNBAReloadGA,
          // });

          // setEWalletPayment({});
        });
      },
    });
  };

  const handlePayment = (is3D?, isAboveThreshold?, additionalParams?) => {
    // const {
    //   sku,
    //   rewardId,
    //   offerId,
    //   additional_data,
    //   roamingProduct,
    //   force,
    //   paymentFor,
    //   selectedCard,
    //   contact,
    //   item,
    //   cardList,
    //   isBasic,
    //   rewardeComScreenName,
    // } = this.state;
    const {route} = props;
    const values = {Email};
    const {feature} = additionalParams || ({} as any);
    console.log('params', route.params);
    const {
      contact,
      paymentFor,
      sku,
      rewardId,
      item,
      offerId,
      force,
      additional_data,
      roamingProduct,
      rewardeComScreenName,
      isShare,
      nbaInfo,
    } = route.params || ({} as any);

    const pack = {
      values,
      // selectedCard,
      undefined,
      paymentFor,
      sku,
      rewardId,
      offerId,
      additional_data,
      roamingProduct,
      force,
      contact,
      isAboveThreshold,
      isShare,
      additionalParams,
      item,
      rewardeComScreenName,
      nbaInfo,
    };
    console.log('pack', pack);

    handle3Dpayment(pack);
  };

  const renderItem = ({item}) => {
    return (
      <Item item={item} onPress={() => setSelectedFeature(item.feature)} />
    );
  };

  const Item = ({item, onPress}) => {
    console.log('itemm', onPress);
    return (
      <TouchableOpacity
        className={`mt-[10px] bg-[#fff] p-[15px] flex-row items-center rounded-[10px] relative overflow-hidden w-full ${
          selectedFeature === item.feature && 'border border-[#06176E]'
        }`}
        onPress={onPress}>
        <View className="flex-row w-full relative">
          <View className="rounded-[8px] p-[14px]  bg-[#F2F3F4] self-start">
            <Image
              source={item.icon}
              style={{
                width: 21,
                height: 21,
                tintColor: '#000',
              }}></Image>
          </View>
          <View className="flex-1 flex-row my-auto ">
            <View className="pl-[20px] flex flex-row justify-between w-full">
              <Text className="font-['Poppins-SemiBold'] text-[#333333]">
                {item.title}
              </Text>
              {selectedFeature === item.feature && (
                <Image
                  source={require('../../assets/icons/tick-yes-filled.png')}
                  style={{
                    width: 21,
                    height: 21,
                    tintColor: '#06176E',
                  }}></Image>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // setEmail();

  return (
    <SafeAreaView className="flex-1">
      <View className=" bg-[#F2F3F7] h-screen flex-1">
        <View className="mx-[20px]">
          <Header onPress={() => props.navigation.goBack()} />

          <View className="pt-[10px]">
            <Text className="text-[#333333] font-['Poppins-SemiBold'] text-[14px]">
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
                    <Text className="text-[14px] font-['Poppins-SemiBold'] text-[#333333]">
                      {selectedReload.title}
                    </Text>
                    <Text className="text-[12px] text-[#333333] font-['Poppins-Regular']">
                      Validity: {selectedReload.text}
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
            <Text className="text-[#333333] font-['Poppins-SemiBold'] text-[14px]">
              Preferred Payment Method
            </Text>

            {/* <View className="mt-[10px] bg-[#fff] p-[15px] flex-row items-center rounded-[10px] relative overflow-hidden w-full border border-[#06176E]">
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
            </View> */}
            <FlatList
              data={paymentMethodList}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              extraData={selectedFeature}
              contentInset={{bottom: 130}}
            />
          </View>
        </View>

        <View className="absolute bottom-0 left-0 w-full">
          <View className="bg-[#fff] p-[24px] rounded-t-[20px]">
            <View className="flex flex-row justify-between">
              <View>
                <Text className="text-[12px] font-['Poppins-Regular'] text-[#333333]">
                  Total Amount
                </Text>
                <Text className="font-['Poppins-SemiBold'] text-[22px] text-[#333333]">
                  {selectedReload.title}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() =>
                  handlePayment(true, null, {feature: selectedFeature})
                }>
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
