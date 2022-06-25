import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import { auth, db } from '../../services/Firebase';
import { getDoc, doc } from 'firebase/firestore';
import SelectDropdown from 'react-native-select-dropdown';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const ActivityScreen = () => {
  const [userData, setUserData] = useState([]);
  const [type, setType] = useState('');
  const [time, setTime] = useState('');

  const userDocRef = doc(db, 'users/' + auth.currentUser.email);

  useEffect(() => {
    const getUserData = async () => {
      const UserDatabase = await getDoc(userDocRef);
      const userdata = UserDatabase.data();
      setUserData(userdata['requests']);
    };

    getUserData()
      .then(() => {
        console.log(userData);
      })
      .catch((error) => {
        console.error;
      });
    console.log('hi');
    console.log(type);
    console.log(time);
  }, []);

  const field1 = [
    { label: 'Your +1', value: '+1' },
    { label: 'Your Requests', value: 'requests' },
    { label: 'Your Deliveries', value: 'deliveries' },
  ];

  const field2 = [
    { label: 'Last Week', value: 'last week' },
    { label: 'Last 3 months', value: 'last 3 months' },
    { label: 'Last 6 months', value: 'last 6 months' },
  ];

  //create function for processing of data
  let data_processing = () => {
    //go through all types of requests (current etc) and one list for each type of request - +1, requests, deliveries etc
    //each item in list should have the time as well as the details
  };

  return (
    <View style={styles.container}>
      <View
        style={{ flex: 5, justifyContent: 'flex-end', alignItems: 'center' }}
      >
        <Text style={{ ...styles.mainLogo }}> +1 </Text>
      </View>

      <View style={{ flex: 23 }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingTop: 20,
          }}
        >
          <View>
            <SelectDropdown
              data={field1}
              buttonTextAfterSelection={(selectedItem) => {
                return selectedItem['label'];
              }}
              onSelect={(selectedItem) => {
                setType(selectedItem['value']);
              }}
              rowTextForSelection={(item, index) => {
                return item['label'];
              }}
              buttonStyle={{ width: 140, height: '50%', borderRadius: 6 }}
              buttonTextStyle={{ fontSize: 15, fontWeight: '600' }}
              rowStyle={{ height: 33 }}
              rowTextStyle={{ fontSize: 14, fontWeight: '400' }}
              searchPlaceHolder="test"
            />
          </View>
          <View style={{}}>
            <SelectDropdown
              data={field2}
              buttonTextAfterSelection={(selectedItem) => {
                return selectedItem['label'];
              }}
              onSelect={(selectedItem) => {
                setTime(selectedItem['value']);
              }}
              rowTextForSelection={(item, index) => {
                return item['label'];
              }}
              buttonStyle={{ width: 140, height: '50%', borderRadius: 6 }}
              buttonTextStyle={{ fontSize: 15, fontWeight: '600' }}
              rowStyle={{ height: 33 }}
              rowTextStyle={{ fontSize: 14, fontWeight: '400' }}
            />
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                console.log(type, time);
              }}
            >
              <Image
                style={{ width: 30, height: 30 }}
                source={require('../../assets/search.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 8 }}>
          <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
            <View
              style={{ height: 200, width: 350, borderRadius: 15, padding: 10 }}
            >
              <Text>This feature is still currently under development</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D5DDF9',
  },

  mainLogo: {
    fontSize: 50,
    fontWeight: '800',
  },

  botNavBar: {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default ActivityScreen;
