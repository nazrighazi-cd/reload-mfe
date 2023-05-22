import isEmpty from 'lodash/isEmpty';
// import {getSSI} from '../../utils';

const TIME_OUT = 120000;

async function xFetch(
  path,
  headerOptions,
  ops: any = {
    noParse: false,
    handleNetworkError: () => void 0,
    timeoutMil: TIME_OUT,
  },
  isNotJson?,
  excludSsi?,
) {
  console.log('masuk uir');
  const cleanPath = path.split('?')[0];

  if (!excludSsi && path.split('https').length > 1) {
    let headers = (!!headerOptions && headerOptions.headers) || {};
    headers = {...headers};
    headerOptions = {...headerOptions, headers};
  }

  if (__DEV__) {
    console.log('___________________________________');
    console.log('Header', {url: path, ...headerOptions});
  }

  let res: any;
  try {
    const normalFetch = fetch(path, headerOptions);

    res = await timeoutPromise(ops.timeoutMil || TIME_OUT, normalFetch);

    res = checkIfErrorOccurs(res);
  } catch (er) {
    ops.handleNetworkError(er);
    if (__DEV__) {
      console.log('responseData Error', {
        path: cleanPath,
        er,
      });
      console.log('___________________________________');
    }

    //create custom error for reward buy timeout
    let fakeResponse = {};
    //END create custom error for reward buy timeout

    return {data: null, ...fakeResponse};
  }

  const contentType = !!res && !!res.res && res.res.headers.get('content-type');

  if (contentType && (contentType.includes('application/json') || isNotJson)) {
    let responseData;
    if (isNotJson) {
      responseData = !!res && (await res.res);
    } else {
      responseData = !!res && (await res.res.json());
    }

    if (__DEV__) {
      console.log('responseData', {responseData, path});
      console.log('___________________________________');
    }

    if (!!res && res.code <= 500) {
      if (
        responseData.error &&
        (responseData.error.errorCode || responseData.error.statusCode)
      ) {
        ops.handleNetworkError(new Error(responseData.error.message));
      }
      //Disable Sucess Message
      // else if (
      //   responseData &&
      //   responseData.data &&
      //   responseData.data.successMessage
      // ) {
      //   showSuccessMessage(responseData.data.successMessage);
      // }
    } else {
      ops.handleNetworkError(new Error(responseData.message));
    }
    return responseData;
  } else {
    if (__DEV__) {
      console.log('responseData Error', res);
      console.log('___________________________________');
    }
    ops.handleNetworkError(
      new Error('System maintenance in progress, please try after some time!'),
    );
    return {data: null};
  }
}

const checkIfErrorOccurs = res => {
  return {
    code: res.status,
    res,
  };
};

export const timeoutPromise = function timeoutPromise(ms, promise) {
  return new Promise((resolve, reject) => {
    let timeoutId;
    if (!__DEV__ || true) {
      timeoutId = setTimeout(() => {
        reject(new Error('request time out'));
      }, ms);
    }
    setTimeout(() => {
      promise.then(
        res => {
          if (!__DEV__) {
            clearTimeout(timeoutId);
          }
          resolve(res);
        },
        err => {
          if (!__DEV__) {
            clearTimeout(timeoutId);
          }
          reject(err);
        },
      );
    }, 0);
  });
};

export default xFetch;
