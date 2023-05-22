import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import styled from 'styled-components/native';
import _ from 'lodash';
import {
  formatUrl,
  exNameEmail,
  // checkSessionExpired,
  deviceWidth,
} from '../../utils';

import Config from 'react-native-config';
import {generatePaymentUrl} from '../../services';
import isEmpty from 'lodash/isEmpty';
import WebView from '../../components/WebViewWrapper';
import useZustandStoreRemote from '../../store/zustand';
//@ts-ignore
import useTokeStore from 'mfe_poc_main/ZustandStore';
export interface Props {
  navigation?: any;
  notifications?: any;
  isLoading?: boolean;
  frameHeight?: number;
  EComeUrl?: any;
  route?: any;
}

export interface States {
  url?: string;
  htmlCode?: any;
  isLoading?: boolean;
  jsToInject?: any;
  sniff?: any;
}

const CloseImage = styled(Image)`
  width: 20px;
`;

const LButton = styled(View)`
  flex-direction: row;
  background-color: #ffe700;
  align-items: center;
  padding-left: 20px;
  height: 60px;
`;
const SlViewWrapper = styled(View)`
  flex: 1;
  background-color: transparent;
  padding: 0;
  margin: 0;
  top: 0;
  left: 0;
  width: 100%;
  flex-direction: row;
`;

const ColumnView = styled(KeyboardAvoidingView)`
  align-items: center;
  background-color: #fff;
  width: ${() => deviceWidth()};
  position: absolute;
  padding: 0;
  margin: 0;
  top: 0;
  bottom: 0;
`;

const OnlinePayment = props => {
  const [url, setUrl] = useState<string>(null);
  const [htmlCode, setHtmlCode] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {frameHeight} = useZustandStoreRemote();
  const {userRecord} = useTokeStore();

  const genarateForm = (fields, url) => {
    // const userRecord = getUserRecord();
    // const {dguardid} = exNameEmail(userRecord);

    let newFields = {
      ...fields,
    };

    // if (!dguardid || checkFeature('dGaurd', true)) {
    //   try {
    //     delete newFields['dguard_id'];
    //     delete newFields['dguard'];
    //   } catch (er) {}
    // }

    let html = '';
    Object.keys(newFields).map(key => {
      html += `<input type="hidden" name="${key}" value='${newFields[key]}' />`;
    });

    html = `<html><head><meta http-equiv="content-type" content="multipart/form-data; charset=UTF-8"></head><body onload="document.forms[0].submit();"><form action='${url}' method="post">${html}</form></body></html>`;

    console.log({newFields, html});
    return html;
  };

  useEffect(() => {
    console.log('nava', userRecord);
    const {route, navigation} = props;

    const getParam = param => route.params[param] || null;

    const urlMaps = {
      payment: `https://qacommerce.digi.com.my/shop/checkout/payment`,
      retry: `https://qacommerce.digi.com.my/shop/checkout/payment_retry`,
      addcard: `https://qacommerce.digi.com.my/vault/cards/addcard/`,
    };

    const feature = getParam('feature');
    let type = 'payment';
    if (feature === '3') type = 'addcard';

    const payParams = [
      {key: 'sku', value: getParam('sku')},
      {key: 'rewardId', value: getParam('rewardId')},
      {key: 'offerId', value: getParam('offerId')},
      {key: 'additional_data', value: getParam('additional_data')},
      {key: 'force', value: getParam('force')},
      {key: 'paymentFor', value: getParam('paymentFor')},
      {key: 'amount', value: getParam('amount')},
      {key: 'msisdn', value: getParam('contact')},
      {key: 'email', value: getParam('email')},
      {key: 'private_hash', value: getParam('private_hash')},
      {key: 'feature', value: getParam('feature')},
      {key: 'caId', value: getParam('caId')},
      {key: 'caType', value: getParam('caType')},
    ];

    let objTosend = {};
    payParams.map(obj => {
      if (!!obj.value) {
        objTosend[obj.key] = obj.value;
      }
    });

    try {
      //Append roaming extera data
      const roamingProduct = getParam('additional_data');
      if (!!roamingProduct) {
        objTosend = {
          ...objTosend,
          ...roamingProduct,
        };
      }
    } catch (er) {}

    // this.setState({ isLoading: true });
    console.log('oooo', objTosend);
    generatePaymentUrl(objTosend).then(res => {
      // this.setState({ isLoading: false });
      // if (checkSessionExpired(res)) return;
      if (typeof res === 'object') {
        let fields = isEmpty(res.error) ? res.data : {dummy: ''};
        if (isEmpty(res.error)) {
          // this.setState({
          //   htmlCode: this.genarateForm(fields, urlMaps[type]),
          // });

          setHtmlCode(genarateForm(fields, urlMaps[type]));
        } else {
          const getParam = (param, alt?) => route.params[param] || alt;
          const func = getParam('func', () => {}) as Function;
          const params = {
            error_desc: res.error.message,
          };
          func({success: false, fail: true, params});
        }
      }
    });
  }, []);

  const onNavigationStateChange = webViewState => {
    handleRequest(webViewState);
    return true;
  };

  const handleRequest = async webViewState => {
    let objUrl;
    let success = false;
    let fail = false as any;

    const {route, navigation} = props;
    const {url, loading} = webViewState || ({} as any);
    const {title} = webViewState;
    // this.setState({isLoading: loading});
    setIsLoading(loading);

    // const getParam = (param, alt?) => navigation.getParam(param, alt);
    const getParam = (param, alt) => route.params[param] || alt;
    const func = getParam('func', () => {});

    let params = null;

    if (!!url && !url.includes('</form></body></html>')) {
      objUrl = formatUrl(url);
      const {pathname, query} = objUrl || ({} as any);

      params = query;
      success = await url.includes('/api/payments/success');

      const failArr = ['/api/payments/fail', '/api/payments/error'];
      fail = !!failArr.find(ul => url.includes(ul));
      console.log('yo', pathname, query, success, fail, url);
    }
    // && loading === false
    if (success || fail) {
      // this function need to execute first before navigation goback
      if (!!func) {
        await func({
          success,
          fail,
          params: params,
          loading,
        });
      }
      // if (isVisited('Usage')) {
      //   // need to put the !!params condition
      //   // BECAUSE WE GET THE FAILURE PARAMETER IN THE SECOND CALL OF RESPONSE
      //   // WITHOUT THIS, ON THE HIGH-END DEVICE WILL IMMIDIETLY GOBACK
      //   // AND WE NEVER RECIEVE THE SECOND CALL OF FAIL ENDPOINT WITH PARAMETER
      //   if (success || (fail && !!params)) {
      //     if (type === 'addcard') {
      //       navigation.navigate('Cards');
      //     } else {
      //       navigation.goBack();
      //     }
      //   }
      // }
    }
  };

  const urlContent = !!url
    ? {uri: url}
    : !!htmlCode
    ? {html: htmlCode}
    : {url: ''};

  const footer = (
    <LButton>
      <TouchableWithoutFeedback
        onPressIn={() => {
          props.navigation.goBack();

          // toggleAlert({
          //   message: messages('mobile.payment.closeText'),
          //   type: 'warning',
          //   cancel: true,
          //   cancelText: messages('mobile.payment.cancelButtonText'),
          //   acceptText: messages('mobile.payment.closeButtonText'),
          //   func: onClose,
          // });
        }}>
        <Image
          resizeMode="contain"
          source={require('../../assets/icons/arrow-previous.png')}
        />
      </TouchableWithoutFeedback>
    </LButton>
  );

  const WVprops = {
    onNavigationStateChange: onNavigationStateChange,
    footer: footer,
    source: urlContent,
    isLoading,
    //only apply behaviour for android because on ios it will messup
    keyboardBehaviour: Platform.OS === 'ios' ? 'padding' : 'height',
  };

  return (
    <ColumnView
    // style={{
    //   height: frameHeight,
    //   maxHeight: frameHeight,
    // }}
    >
      <SlViewWrapper>
        <WebView {...WVprops} />
      </SlViewWrapper>
    </ColumnView>
  );
};

export default OnlinePayment;
