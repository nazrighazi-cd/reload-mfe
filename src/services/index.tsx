import {InteractionManager, Platform} from 'react-native';
import {createPublicKey, encrypt, fullURL} from '../utils';
import xFetch from './xFetch';
import DeviceInfo from 'react-native-device-info';
//@ts-ignore
import useTokeStore from 'mfe_poc_main/ZustandStore';

export const ServiceList: any = {
  loadOnlineDenominations: 'api/reload/online',
  generatePaymentUrlV3: 'api/payments/v3/params',
  ReloadPIN: 'api/reload/pin',
  CheckSession: 'checkSession',
};

export const GETHeader = digiauth => {
  const headers: any = {
    Accept: 'application/json',
    digiauth,
  };

  return headers;
};

// export const handleNetworkError = er => {
//   let error = !!er ? er : ({} as any);
//   let code = error.code;
//   let errorCode = error.errorCode;
//   let message = error.message;

//   let triggerUSSDPrompt = error.triggerUSSDPrompt;

//   if (error.message === 'Network request failed') {
//     code = 'Connection error';
//     message =
//       'Connection error. Please check your network settings and try again.';

//     if (triggerUSSDPrompt) return toggleNoConnectionErrorModal();
//   }

//   //This code is when dguard callback return revalidate: true so we prevent show common alert
//   if (errorCode === '8888') {
//     return;
//   } else {
//     InteractionManager.runAfterInteractions(() => {
//       setTimeout(() => {
//         toggleAlert({
//           title: code,
//           message: message,
//           type: 'error',
//         });
//       }, 0);
//     });
//     //throw error;
//   }
// };

export const GetAppContext = (obj?) => {
  const userRecord = useTokeStore.getState().userRecord;
  // const userRecord = getUserRecord();
  console.log('user record', userRecord);
  const {subscriberRecord} = userRecord;
  const {MSISDN} = subscriberRecord || {
    MSISDN: null,
  };
  return {
    ...AppContext,
    msisdin: MSISDN,
    ...obj,
    language: 'en',
  };
};

export let AppContext = {
  deviceId: DeviceInfo.getUniqueId(),
  deviceName: DeviceInfo.getDeviceName(),
  deviceModel: DeviceInfo.getModel(),
  deviceBrand: DeviceInfo.getBrand(),
  deviceOS: DeviceInfo.getSystemName(),
  systemVersion: DeviceInfo.getSystemVersion(),
  appVersion: DeviceInfo.getReadableVersion(),
} as any;

try {
  if (Platform.OS === 'android') {
    DeviceInfo.getUserAgent().then(obj => {
      AppContext = {
        ...AppContext,
        userAgent: obj,
      };
    });
  }
} catch (er) {}

export const generatePaymentUrl = async data => {
  // const userRecord = getUserRecord();
  const userRecord = useTokeStore.getState().userRecord;
  // const userRecord = mock_userRecord;
  console.log('gen payment', userRecord);
  const {profiles, offers} = userRecord.subscriberRecord || ({} as any);

  const {amount, rewardId, offerId, paymentFor} = data || ({} as any);

  let req = data;

  if (!!amount) {
    req['signature'] = encrypt(
      amount.toString(),
      createPublicKey(profiles, offers),
    );
    req.amount = 0;
  }

  if (!!rewardId) {
    req['rewardId'] = encrypt(
      rewardId.toString(),
      createPublicKey(profiles, offers),
    );
  }

  if (!!offerId) {
    req['offerId'] = encrypt(
      offerId.toString(),
      createPublicKey(profiles, offers),
    );
  }

  if (!!paymentFor) {
    req['paymentFor'] = encrypt(paymentFor, createPublicKey(profiles, offers));
  }

  const payload = req;

  return xFetch(
    fullURL(ServiceList.generatePaymentUrlV3),
    {
      method: 'POST',
      headers: POSTHeader(),
      body: JSON.stringify(payload),
    },
    {handleNetworkError: er => silent(er)},
  );
};

export const reloadByPin = data => {
  return xFetch(
    fullURL(ServiceList.ReloadPIN),
    {
      method: 'POST',
      headers: POSTHeader(),
      body: JSON.stringify(data),
    },
    {},
  ).then(res => {
    return res;
  });
};

const POSTHeader = (obj?) => {
  let headers: any = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...GetAppContext(obj),
  };
  return headers;
};

export const retriveSession = async (msisdn?, checkAutoLogin = '') => {
  const ssi = useTokeStore.getState().ssi;
  const url = `${ServiceList.CheckSession}${checkAutoLogin}`;
  let bodyData;
  if (!!msisdn && msisdn) {
    bodyData = JSON.stringify(msisdn);
  }

  return xFetch(
    fullURL(url),
    {
      method: 'POST',
      headers: POSTHeader({digiauth: ssi}),
      body: bodyData,
    },
    {},
  );
};

function silent(error) {
  return {error: error};
}
