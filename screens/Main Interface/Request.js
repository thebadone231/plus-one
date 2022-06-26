import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Keyboard,
} from 'react-native';
import { auth, db } from '../../services/Firebase';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import AwesomeAlert from 'react-native-awesome-alerts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Geocoder from 'react-native-geocoding';

const RequestScreen = () => {
  const [requestData, setRequestData] = useState({});
  const [userData, setUserData] = useState({});
  const [heightDimension, setHeightDimension] = useState({
    productName: '77%',
    deliveryLocation: '77%',
    orderDetails: '77%',
  });
  const [alert, setAlert] = useState({ status: false, title: '', message: '' });

  const userDocRef = doc(db, 'users/' + auth.currentUser.email);

  useEffect(() => {
    const getUserData = async () => {
      const UserDatabase = await getDoc(userDocRef);
      const userDetails = UserDatabase.data();
      setUserData(userDetails['userdata']);
    };

    getUserData();
  }, []);

  //functional component - input boxes
  let input_component = (field_name, key, dynamic = false) => {
    return (
      <View style={styles.input_container}>
        <Text style={{ fontSize: 15, fontWeight: '500' }}>{field_name}: </Text>
        <TextInput
          style={
            dynamic === true
              ? { ...styles.inputBox, height: heightDimension[key] }
              : styles.inputBox
          }
          multiline={true}
          returnKeyType="done"
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
          onChangeText={(text) => {
            let newdata = requestData;
            newdata[key] = text;
            setRequestData(newdata);
          }}
          onContentSizeChange={(Event) => {
            //setHeightDimension(Event.nativeEvent.contentSize.height)
            if (dynamic === true) {
              let newHeight = { ...heightDimension };
              if (Event.nativeEvent.contentSize.height > 33.666666666666664) {
                newHeight[key] = Event.nativeEvent.contentSize.height;
              } else {
                newHeight[key] = 33.666666666666664;
              }
              setHeightDimension(newHeight);
            }
          }}
        />
      </View>
    );
  };

  //logic for writing of requests to firebase
  const write_request = async () => {
    let location;
    await Geocoder.from(requestData['deliveryLocation'])
      .then((json) => {
        location = json.results[0].geometry.location;
        console.log(location);
      })
      .catch((error) => {
        console.error;
      });

    if (location) {
      var today = new Date();
      var date =
        today.getFullYear() +
        '-' +
        (today.getMonth() + 1) +
        '-' +
        today.getDate();
      var time =
        today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
      const id = date + ' ' + time;

      let request = {
        type: 'requests',
        'time of request': time,
        location: {
          address: requestData['deliveryLocation'],
          'geographical area': '',
          lat: location['lat'],
          long: location['lng'],
        },
        'order details': {
          'product name': requestData['productName'],
          'delivery timing': requestData['deliveryTiming'],
          'order specifics': requestData['orderDetails'],
          price: requestData['price'],
          'payment method': requestData['paymentMethod'],
          'contact number': userData['contactNumber'],
          username: userData['userName'],
          'delivered by': {
            user: '',
            time: '',
          },
        },
      };

      console.log(request);

      const requestsRef = doc(db, 'requests/' + id);
      await setDoc(userDocRef, { requests: { [id]: request } }, { merge: true })
        .then(
          await setDoc(
            requestsRef,
            { ...request, user: auth.currentUser.email },
            { merge: true }
          )
        )
        .then(
          setAlert({
            status: true,
            title: 'Success',
            message: 'Your +1 request has been received',
          })
        )
        .catch(console.error);
    } else {
      setAlert({
        status: true,
        title: 'Failure',
        message: 'Please input a valid delivery address',
      });
    }
  };

  return (
    <View style={{ ...styles.container, justifyContent: 'center' }}>
      <View style={{ height: '65%' }}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ fontSize: 23, fontWeight: '600' }}>Your Request</Text>
        </View>
        <View style={{ flex: 6 }}>
          <KeyboardAwareScrollView>
            <View
              style={{ alignItems: 'center', justifyContent: 'space-around' }}
            >
              {input_component('Product Name', 'productName', true)}
              {input_component('Delivery Location', 'deliveryLocation', true)}
              {input_component('Order Details', 'orderDetails', true)}
              {input_component('Price', 'price')}
              {input_component('Delivery Timing', 'deliveryTiming')}
              {input_component('Payment Method', 'paymentMethod')}
            </View>

            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity
                style={{
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '27%',
                  width: '26%',
                  borderRadius: 8,
                  marginTop: 40,
                }}
                onPress={write_request}
              >
                <Text style={{ fontSize: 17, fontWeight: '500' }}>Submit</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>

      <AwesomeAlert
        show={alert['status']}
        title={alert['title']}
        message={alert['message']}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        cancelText="Close"
        onCancelPressed={() => {
          setAlert((alert['status'] = false));
        }}
      />
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

  input_container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 44,
    width: 310,
    marginVertical: 6,
  },

  inputBox: {
    height: '77%',
    width: 173,
    borderRadius: 8,
    backgroundColor: 'white',
    paddingTop: 8,
    paddingHorizontal: 10,
  },
});
export default RequestScreen;
