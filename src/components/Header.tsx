import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const Header = ({onPress}) => {
  console.log('press', onPress);
  return (
    <View style={style.container}>
      <TouchableOpacity
        style={style.backButton}
        className="z-20"
        onPress={onPress}>
        <Image
          style={{width: 16, height: 16}}
          source={require('../assets/icons/arrow-previous.png')}></Image>
      </TouchableOpacity>
      <View style={style.titleContainer}>
        <Text style={style.title} className="font-['Poppins-SemiBold']">
          Reload
        </Text>
      </View>
    </View>
  );
};

export default Header;

const style = StyleSheet.create({
  container: {
    marginVertical: 30,
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    flexGrow: 0,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  titleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    color: '#333333',
    fontWeight: '600',
  },
});
