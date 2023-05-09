import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, StyleSheet, View} from 'react-native';
// @ts-ignore
import useZustandStore from 'host/ZustandStore';
// import {Federated} from '@callstack/repack/client';
// @ts-ignore
// import useZustandStoreRemote from 'app1/ZustandStoreRemote';
// let useZustandRemoteStore: any;
const IncreaseCountButton = () => {
  const {increase, count} = useZustandStore();
  // const [isReady, setIsReady] = useState(false);
  // const {bear, increaseBear} = useZustandRemoteStore();

  // useEffect(() => {
  //   const importUseZustandStore = async () => {
  //     const storeModule = await Federated.importModule(
  //       'app1',
  //       './ZustandStoreRemote',
  //     );
  //     useZustandRemoteStore = storeModule.default;

  //     // const store2Module = await Federated.importModule(
  //     //   'app1',
  //     //   './ZustandStoreRemote',
  //     // );
  //     // useZustandStoreRemote = store2Module.default;

  //     setIsReady(true);
  //   };

  //   importUseZustandStore();
  // }, []);
  // const {increaseBear, bear} = useZustandStoreRemote();
  return (
    <View>
      <TouchableOpacity style={styles.container} onPress={() => increase(1)}>
        <Text>Increase count from app1: {count}</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        style={styles.container}
        onPress={() => increaseBear(1)}>
        <Text>Increase bear from app1: {bear}</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'lightgray',
    marginTop: 20,
    padding: 5,
  },
});

export default IncreaseCountButton;
