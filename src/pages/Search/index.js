import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacityBase,
  TouchableOpacity,
  FlatList,
  Keyboard,
  ViewBase,
} from 'react-native';

import api from '../../services/api';
import PostItem from '../../components/PostItem';

export default function Search() {
  const [input, setInput] = useState('');
  const [posts, setPosts] = useState([]);
  const [empty, setEmpty] = useState(false);

  async function handleSearchPost() {
    if (input === '') {
      alert('Digite algum nome!');
      return;
    }

    const response = await api.get(
      `api/posts?filters[title][$containsi]=${input}&populate=cover`,
    );

    if (response.data?.data?.length === 0) {
      setEmpty(true);
      setPosts([]);
      return;
    }

    setPosts(response.data?.data);
    setEmpty(false);
    setInput('');
    Keyboard.dismiss();
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerInput}>
        <TextInput
          placeholder="Oque está procurando?"
          style={styles.input}
          value={input}
          onChangeText={text => setInput(text)}
        />

        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearchPost}>
          <Text style={{fontSize: 25, color: '#000'}}>🔍</Text>
        </TouchableOpacity>
      </View>

      {empty && (
        <View>
          <Text style={styles.emptyText}>
            Ops não encontramos nenhum post para {input}
          </Text>
        </View>
      )}
      <FlatList
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        data={posts}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => <PostItem data={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 18,
  },
  containerInput: {
    flexDirection: 'row',
    width: '100%',
    height: 45,
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    width: '85%',
    backgroundColor: '#C4C4C4',
    height: 45,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  searchButton: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C4C4C4',
    height: 45,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    marginLeft: -1,
  },
});
