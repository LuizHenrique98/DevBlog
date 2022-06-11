import React, {useEffect, useState, useLayoutEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Share,
  Modal,
} from 'react-native';

import {useNavigation, useRoute} from '@react-navigation/native';

import api from '../../services/api';

import LinkWeb from '../../components/LinkWeb';

import baseUrl from '../../services/baseUrl.json';

export default function Detail() {
  const route = useRoute();
  const navigaton = useNavigation();

  const [post, setPost] = useState({});
  const [links, setLinks] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [openLink, setOpenLink] = useState({});

  useEffect(() => {
    async function getPost() {
      const response = await api.get(
        `api/posts/${route.params?.id}?populate=cover,category,Opcoes`,
      );
      setPost(response.data.data);
      setLinks(response.data?.data?.attributes?.Opcoes);
    }

    getPost();
  }, []);

  useLayoutEffect(() => {
    navigaton.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleShare}>
          <Text style={{fontSize: 20, color: '#FFF'}}> ? </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigaton, post]);

  async function handleShare() {
    try {
      const result = await Share.share({
        message: `
          Confere esse post: ${post?.attributes?.title}

          ${post?.attributes?.description}

          Vi lá no app DevPost!
        `,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Activity type');
        } else {
          console.log('compartilhado com sucesso');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('modal fechado');
      }
    } catch (error) {
      console.log('teste');
    }
  }

  function handleOpenLink(link) {
    setModalVisible(true);
    setOpenLink(link);
    console.log(link);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image
        resizeMode="cover"
        style={styles.cover}
        source={{
          uri:
            baseUrl.baseUrl +
            `${post?.attributes?.cover?.data?.attributes?.url}`,
        }}
      />
      <Text style={styles.title}>{post?.attributes?.title}</Text>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>{post?.attributes?.description}</Text>
        {links.length > 0 && <Text style={styles.subtitle}>Links</Text>}

        {links.map(link => (
          <TouchableOpacity
            key={link.id}
            style={styles.linkButton}
            onPress={() => handleOpenLink(link)}>
            <Text>@</Text>
            <Text style={styles.linkText}>{link.name} </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} transparent={true}>
        <LinkWeb
          link={openLink?.url}
          title={openLink?.name}
          closeModal={() => setModalVisible(false)}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  cover: {
    width: '100%',
    height: 230,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 14,
    marginTop: 18,
    paddingHorizontal: 12,
  },
  content: {
    paddingHorizontal: 12,
  },
  description: {
    lineHeight: 20,
  },
  subtitle: {
    fontWeight: 'bold',
    marginTop: 14,
    fontSize: 18,
    marginBottom: 6,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  linkText: {
    color: '#1e4687',
    fontSize: 16,
    marginLeft: 6,
  },
});
