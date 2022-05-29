import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { handleSignout, auth, userCollectionRef } from '../services/Firebase';
import {getDocs} from 'firebase/firestore';

const Profile = () => {
  const navigation = useNavigation();

  useEffect( ()=>{
      const getUser = async() => {
        try{ 
          //retrieving data from database
          const database = await getDocs(userCollectionRef);
          const userdata = {};
          database.forEach( doc => {
            userdata[doc.id] = doc.data(); // seems like i either get this as a list or an object?
          })
          console.log(userdata);

          //updating data in database
          setDoc(doc(userCollectionRef, auth.currentUser.email), {
            requests: {
              expired: {test:2},
          }}, {merge:true});
        } catch (error) {
          console.log(error);
        }
      };
      
      getUser();
  }, [])


  return (
    <View style={styles.container}>
      <Text>test</Text>

      <Pressable
        style={styles.button}
        onPress={() => {
          handleSignout();
          navigation.navigate('LoginScreen');
          console.log('user signed out');
        }}
      />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    position: 'absolute',
    top: 25,
    backgroundColor: '#11DDAA',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    height: 55,
    width: 55,
  },
});
