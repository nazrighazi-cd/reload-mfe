import React, {useEffect, useState} from 'react';
import {
  View,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
  Linking,
  SafeAreaView,
  Text,
} from 'react-native';
import styled from 'styled-components/native';
// import { SafeAreaView } from 'react-navigation';
// import {toggleCommonModal, linkUrlFormater, dispatch} from '../../utils';
// import {updateRedirectObj} from '../../modules/Common';
import {WebView} from 'react-native-webview';
import {AppContext} from '../services';
// import {Spinner} from 'native-base';

export interface Props {
  isLoading?: boolean;
  footer?: any;
  onNavigationStateChange?: any;
  injectAddon?: any;
  url?: any;
  frameHeight?: number;
  keyboardBehaviour?: any;
  navigation?: any;
}

export interface States {
  jsToInject?: any;
  sniff?: any;
  sniffHtml?: any;
  loading?: boolean;
}

const SlViewWrapper = styled(View)`
  flex: 1;
  background-color: transparent;
`;

const SHeader = styled(View)`
  flex-direction: row;
  justify-content: flex-start;
  border-width: 0;
  background-color: #ffe700;
  height: ${Platform.OS === 'android' ? 24 : 30};
  margin: 0;
  elevation: 0;
`;
// const SSpinner = styled(Spinner)`
//   height: 100%;
//   justify-content: center;
//   align-items: center;
//   background-color: #fff;
// `;
const WebViewWrapper = props => {
  let webview;
  let componentisAlive;

  const [jsToInject, setJstoInject] = useState('');
  const [sniff, setSniff] = useState(false);
  const [sniffHtml, setSniffHtml] = useState(false);
  const [loading, setLoading] = useState(true);
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     jsToInject: '',
  //     sniff: false,
  //     sniffHtml: false,
  //     loading: true,
  //   };
  // }

  useEffect(() => {
    componentisAlive = true;
    setJstoInject(injectScript());
    return () => {
      // componentwillunmount in functional component.
      // Anything in here is fired on component unmount.
      componentisAlive = false;
    };
  }, []);

  const parseQuery = str => {
    var obj =
      typeof str === 'string' &&
      str.split('&').reduce(function (prev, curr, i, arr) {
        var p = curr.split('=');
        prev[decodeURIComponent(p[0])] = decodeURIComponent(p[1]);
        return prev;
      }, {});
    return obj;
  };

  const parseData = data => {
    return (!!data.data && parseQuery(data.data)) || {};
  };

  const handleOnMessage = ev => {
    try {
      let data = ev.nativeEvent;
      data = {url: ev.nativeEvent.url, ...JSON.parse(data.data)};

      if (!!data.data && !data.data.html) {
        data = {url: ev.nativeEvent.url, data: parseData(data)};
      }

      console.log('Data Sniffed', data);
    } catch (er) {
      console.log('error while parse Sniff Data', er);
    }
  };

  const injectScript = () => {
    const header = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `;
    const scope = `
  
          var logEvent = function ( obj ) {
            setTimeout(function(){
              window.ReactNativeWebView.postMessage(JSON.stringify(obj));
            },100);
          };

          window.logEvent = logEvent;

          true; // note: this is required, or you'll sometimes get silent failures
    `;
    return `

          (function() {
            ${header}
            ${scope}
          })()`;
  };

  const checkDeepLink = async st => {
    const {url} = st || ({} as any);
    const deepLinkIn = ['mydigiapp', 'reqPage'];

    const android = Platform.OS === 'android';

    const excludeCalls = ['auth/dguard', 'auth/realms', 'client_id=mydigiapp'];
    try {
      //is Dguard
      if (excludeCalls.find(ul => url.includes(ul))) {
        return true;
      }
    } catch (er) {}

    try {
      const cleanUrl = url
        .replace('mydigiappdev.digi.com.my', '')
        .replace('mydigiapp.digi.com.my', '');

      if (android || !deepLinkIn.find(ul => cleanUrl.includes(ul))) {
        return true;
      }

      console.log('isDeeplink', {url});
      let temUrl = url.split('link=');

      if (temUrl.length > 1) {
        temUrl = temUrl[1];
        temUrl = decodeURIComponent(temUrl);
      } else {
        temUrl = temUrl[0];
      }

      const schema = [
        'xavr5.app.goo.gl',
        'digi.app.goo.gl',
        'new.digi.com.my',
        'digi.my',
        'digi.com.my',
      ];

      let target = schema.find(ul => temUrl.includes(ul));

      //   if (!!target) {
      //     toggleCommonModal(null);
      //     const redirectObj = (await linkUrlFormater(temUrl)) as any;
      //     dispatch(updateRedirectObj(redirectObj));
      //     this.props.navigation.navigate('Usage');

      //     return false;
      //   } else {
      return true;
      //   }
    } catch (er) {
      return true;
    }
  };

  const {
    footer,
    isLoading,
    onNavigationStateChange,
    url,
    frameHeight,
    keyboardBehaviour,
    ...restof
  } = props;
  let newProps = sniff
    ? {
        onMessage: ev => handleOnMessage(ev),
        ...restof,
      }
    : ({
        ...restof,
      } as any);

  if (Platform.OS === 'android') {
    let {userAgent} = AppContext || ({} as any);

    newProps = {
      ...newProps,
      userAgent: userAgent,
      pointerEvents: 'none',
      mixedContentMode: 'always',
      setAppCacheEnabled: false,
      setCacheMode: 2,
      saveFormDataDisabled: true,
      setSavePassword: false,
      originWhitelist: ['*'],
      androidHardwareAccelerationDisabled: true,
      onShouldStartLoadWithRequest: request => {
        console.log({request});
        if (!request || !request.url) {
          return true;
        }

        // list of schemas we will allow the webview
        // to open natively
        if (
          request.url.startsWith('tel:') ||
          request.url.startsWith('mailto:') ||
          request.url.startsWith('maps:') ||
          request.url.startsWith('geo:') ||
          request.url.startsWith('sms:') ||
          request.url.startsWith('intent:') ||
          request.url.startsWith('mydigi:') ||
          request.url.startsWith('shopeemy:') ||
          request.url.startsWith('https://wsa.wallet.airpay.com.my')
        ) {
          Linking.openURL(request.url.replace('intent://', 'https://')).catch(
            er => {
              console.log('Failed to open Link:', er.message);
            },
          );
          return false;
        }

        // let everything else to the webview
        return true;
      },
    };
  }

  const saveViewProps = {
    style: {
      flex: 1,
    },
    // forceInset: { top: 'never', bottom: 'always' },
  } as any;

  const saveViewProps2 = {
    style: {
      backgroundColor: '#ffe700',
      paddingTop: 0,
    },
    // forceInset: { top: 'always', bottom: 'never' },
  } as any;

  // all android except the retarded one that have notch cannot use top 0 thats why need this condition
  const isNeedTopZero =
    Platform.OS === 'ios'
      ? {
          top: 0,
          maxHeight: frameHeight > 0 ? frameHeight : '100%',
        }
      : {};

  console.log(newProps);
  return (
    <KeyboardAvoidingView
      behavior={!!keyboardBehaviour ? keyboardBehaviour : 'height'}
      style={{
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        minHeight: '100%',
        backgroundColor: 'transparent',
      }}>
      {/* <SafeAreaView {...saveViewProps}> */}
      <SafeAreaView {...saveViewProps2}>{!!footer && footer}</SafeAreaView>
      <SlViewWrapper
        style={{
          padding: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          ...isNeedTopZero,
        }}>
        <WebView
          key={url}
          ref={c => (webview = c)}
          useWebKit={Platform.OS === 'ios'}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
          automaticallyAdjustContentInsets={true}
          scrollEnabled={true}
          ignoreSslError={true}
          scalesPageToFit={true}
          incognito={Platform.OS === 'ios'}
          onMessage={(ev: any) => {
            try {
              let {data} = ev.nativeEvent;

              data = decodeURIComponent(decodeURIComponent(data));

              data = JSON.parse(data);
              console.log({data});
            } catch (er) {
              console.log('error while parse Sniff Data', er);
            }
          }}
          injectedJavaScript={jsToInject}
          // injectedJavaScriptBeforeContentLoaded={jsToInject}
          // injectedJavaScriptBeforeContentLoadedForMainFrameOnly={false}
          // originWhitelist={['*']}
          //@ts-ignore
          onNavigationStateChange={async webViewState => {
            const proceed = await checkDeepLink(webViewState);

            console.log('pro', proceed);
            // @ts-ignore
            if (!webViewState.loading) {
              // console.log('WebView Url Changed', webViewState)
              // this.setState({
              //   loading: false,
              // });
              setLoading(false);
            }
            if (!!onNavigationStateChange && proceed) {
              console.log('proceed', webViewState);
              onNavigationStateChange(webViewState);
            }
          }}
          {...newProps}
          enableCache={false}
          style={{
            flex: 1,
            width: '100%',
            overflow: 'hidden',
            backgroundColor: '#fff',
          }}
        />
        {loading && <Text>Loading</Text>}
      </SlViewWrapper>
      {/* </SafeAreaView> */}
    </KeyboardAvoidingView>
  );
};
export default WebViewWrapper;
