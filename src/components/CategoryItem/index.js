import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import baseUrl from '../../services/baseUrl.json';

export default function CaegoryItem({data, favorite}) {
  const navigation = useNavigation();

  function handleNavigate() {
    navigation.navigate('CategoryPosts', {
      id: data.id,
      title: data?.attributes.name,
    });
  }

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={handleNavigate}
      onLongPress={favorite}>
      <Image
        style={styles.icon}
        source={{
          uri:
            baseUrl.baseUrl +
            `${data?.attributes?.icon?.data?.attributes?.url}`,
        }}
      />
      <Text styles={styles.name}>{data?.attributes?.name} </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    marginLeft: 8,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    width: 40,
    height: 40,
  },
  name: {},
});
