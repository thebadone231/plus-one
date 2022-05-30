import React, { useEffect } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { handleSignout, auth, userCollectionRef } from '../services/Firebase';
import { setDoc, doc } from 'firebase/firestore';

const MainInterface = () => {
  const navigation = useNavigation();
  const user = auth.currentUser.email;

  useEffect(() => {
    setDoc(
      doc(userCollectionRef, auth.currentUser.email),
      {
        requests: {
          expired: { test: 2 },
        },
      },
      { merge: true }
    );
  }, []);

  return (
    <View style={{ flexDirection: 'column', flex: 1 }}>
      <View style={[styles.container, { flexGrow: 7 }]}>
        <Text>hello {auth.currentUser.email}</Text>
        <Pressable
          style={styles.button}
          onPress={() => {
            handleSignout();
            Alert.alert('Signed out successfully!');
            navigation.navigate('LoginScreen');
            console.log('user signed out');
          }}
        >
          <Text style={{ fontSize: 20 }}>Sign out</Text>
        </Pressable>
      </View>
      <View
        style={[styles.botNavBar, { flexGrow: 1 }]}
        classname="bottom navigation bar"
      >
        <View style={{ justifyContent: 'center' }}>
          <Image />
          <Text></Text>
        </View>
      </View>
    </View>
  );
};

export default MainInterface;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D5DDF9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    top: 25,
    backgroundColor: '#11DDAA',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    height: 55,
    width: 100,
  },
  botNavBar: {
    flex: 1,
    backgroundColor: '#D5DDF9',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navBarIcon: {
    marginBottom: 10,
  },
});
