import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import api from '../../services/api';

import CategoryItem from '../../components/CategoryItem';
import {getFavorite, setFavorite} from '../../services/favorite';
import FavoritePosts from '../../components/FavoritePosts';
import PostItem from '../../components/PostItem';

import * as Animatable from 'react-native-animatable';

const FlatListAnimated = Animatable.createAnimatableComponent(FlatList);

export default function Home() {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [favCategory, setFavCategory] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      await getListPost();

      const category = await api.get('/api/categories?populate=icon');
      setCategories(category.data.data);
    }

    loadData();
  }, []);

  useEffect(() => {
    async function favorite() {
      const response = await getFavorite();
      setFavCategory(response);
    }
    favorite();
  }, []);

  async function getListPost() {
    setLoading(true);
    const respone = await api.get(
      'api/posts?populate=cover&sort=createdAt:desc',
    );
    setPosts(respone.data.data);

    setLoading(false);
  }

  async function handleFavorite(id) {
    const response = await setFavorite(id);

    setFavCategory(response);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Animatable.Text style={styles.name} animation="fadeInLeft">
          DevBlog
        </Animatable.Text>

        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Text style={styles.icon}>🔍</Text>
        </TouchableOpacity>
      </View>

      <FlatListAnimated
        animation="flipInX"
        delay={500}
        horizontal={true}
        contentContainerStyle={{paddingRight: 12}}
        style={styles.categories}
        data={categories}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => (
          <CategoryItem data={item} favorite={() => handleFavorite(item.id)} />
        )}
      />

      <View style={styles.main}>
        {favCategory.length !== 0 && (
          <FlatList
            style={{marginTop: 50, maxHeight: 100, paddingStart: 18}}
            contentContainerStyle={{paddingEnd: 18}}
            data={favCategory}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => String(item.id)}
            renderItem={({item}) => <FavoritePosts data={item} />}
          />
        )}

        <Text
          style={[styles.title, {marginTop: favCategory.length > 0 ? 14 : 46}]}>
          Conteúdos em alta
        </Text>

        <FlatList
          style={{flex: 1, paddingHorizontal: 18}}
          showsVerticalScrollIndicator={false}
          data={posts}
          keyExtractor={item => String(item.id)}
          renderItem={({item}) => <PostItem data={item} />}
          refreshing={loading}
          onRefresh={() => getListPost()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232630',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 24,
  },
  name: {
    fontSize: 28,
    color: '#FFF',
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 24,
  },
  categories: {
    maxHeight: 115,
    backgroundColor: '#EFEFEF',
    marginHorizontal: 18,
    borderRadius: 8,
    zIndex: 9,
  },
  main: {
    backgroundColor: '#FFF',
    flex: 1,
    marginTop: -30,
  },
  title: {
    fontSize: 21,
    paddingHorizontal: 18,
    marginBottom: 14,
    fontWeight: 'bold',
    color: '#162133',
  },
});
