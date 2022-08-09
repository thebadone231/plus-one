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
  Button,
} from 'react-native';
import { auth, db } from '../../services/Firebase';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import AwesomeAlert from 'react-native-awesome-alerts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Geocoder from 'react-native-geocoding';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';

const RequestScreen = () => {
  const [requestData, setRequestData] = useState({});
  const [userData, setUserData] = useState({});
  const [heightDimension, setHeightDimension] = useState({
    productName: '77%',
    deliveryLocation: '77%',
    orderDetails: '77%',
  }); //auto update the height of text input
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
            // set height of container according to size of content
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
    //checking validty of location
    await Geocoder.from(requestData['deliveryLocation'])
      .then((json) => {
        location = json.results[0].geometry.location;
        console.log(location);
      })
      .catch((error) => {
        console.error;
      });

    //if location is valid
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
          'delivery timing': deliveryDate,
          'order specifics': requestData['orderDetails'],
          price: selectedPrice,
          'payment method': selectedPaymentMethod,
          'contact number': userData['contactNumber'],
          username: userData['userName'],
          'delivered by': {
            user: '',
            time: '',
          },
        },
      };

      //writing to database
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

  // for DateTimePicker, directly from API README
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDeliveryDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  // for payment method dropdown list
  const [openPaymentMethod, setOpenPaymentMethod] = useState(false);
  const [valuePaymentMethod, setValuePaymentMethod] = useState(null);
  const [itemsPaymentMethod, setItemsPaymentMethod] = useState([
    { label: 'Cash', value: 'Cash' },
    { label: 'Paylah!', value: 'Paylah!' },
    { label: 'PayNow', value: 'PayNow' },
    { label: 'Bank Transfer', value: 'Bank Transfer' },
  ]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  // for price dropdown list
  const [openPrice, setOpenPrice] = useState(false);
  const [valuePrice, setValuePrice] = useState(null);
  const [itemsPriceFilter, setItemsPriceFilter] = useState([
    { label: '$0.00', value: '0.00' },
    { label: '$0.50', value: '0.50' },
    { label: '$1.00', value: '1.00' },
    { label: '$1.50', value: '1.50' },
    { label: '$2.00', value: '2.00' },
    { label: '$2.50', value: '2.50' },
    { label: '$3.00', value: '3.00' },
    { label: '$3.50', value: '3.50' },
    { label: '$4.00', value: '4.00' },
    { label: '$4.50', value: '4.50' },
    { label: '$5.00', value: '5.00' },
    { label: '$5.50', value: '5.50' },
    { label: '$6.00', value: '6.00' },
    { label: '$6.50', value: '6.50' },
    { label: '$7.00', value: '7.00' },
    { label: '$7.50', value: '7.50' },
    { label: '$8.00', value: '8.00' },
    { label: '$8.50', value: '8.50' },
    { label: '$9.00', value: '9.00' },
    { label: '$9.50', value: '9.50' },
    { label: '$10.00', value: '10.00' },
  ]);
  const [selectedPrice, setSelectedPrice] = useState(null);

  // empty input alert
  const [emptyInputAlert, setEmptyInputAlert] = useState(false);
  // empty payment method alert
  const [emptyPaymentMethodAlert, setEmptyPaymentMethodAlert] = useState(false);
  // empty price alert
  const [emptyPriceAlert, setEmptyPriceAlert] = useState(false);
  // delivery time expired
  const [expiredDeliveryTimeAlert, setExpiredDeliveryTimeAlert] =
    useState(false);

  return (
    <View style={{ ...styles.container, justifyContent: 'center' }}>
      <View style={{ height: '65%' }}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ fontSize: 23, fontWeight: '600' }}>Your Request</Text>
        </View>

        <View style={{ flex: 6 }}>
          <View
            style={{ alignItems: 'center', justifyContent: 'space-around' }}
          >
            {input_component('Product Name', 'productName', true)}
            {input_component('Delivery Location', 'deliveryLocation', true)}
            {input_component('Order Details', 'orderDetails', true)}
          </View>

          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 15,
                marginTop: 10,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 200,
              }}
            >
              <View style={{ flex: 2.9, alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 15, fontWeight: '500' }}>
                  Payment Method:
                </Text>
              </View>
              <View style={{ flex: 2.5, marginLeft: 5, zIndex: 200 }}>
                <DropDownPicker
                  open={openPaymentMethod}
                  value={valuePaymentMethod}
                  items={itemsPaymentMethod}
                  setOpen={setOpenPaymentMethod}
                  setValue={setValuePaymentMethod}
                  setItems={setItemsPaymentMethod}
                  placeholder="Select a method"
                  listMode="SCROLLVIEW"
                  scrollViewProps={{
                    nestedScrollEnabled: true,
                  }}
                  onOpen={() => {
                    setOpenPrice(false);
                  }}
                  onChangeValue={(value) => {
                    setSelectedPaymentMethod(value);
                  }}
                  textStyle={{
                    fontSize: 12,
                  }}
                  containerProps={{
                    height: openPaymentMethod ? 220 : null,
                  }}
                />
              </View>
              <View style={{ flex: 1 }}></View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 15,
                marginTop: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View style={{ flex: 2.9, alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 15, fontWeight: '500' }}>Price:</Text>
              </View>
              <View style={{ flex: 2.5, marginLeft: 5 }}>
                <DropDownPicker
                  open={openPrice}
                  value={valuePrice}
                  items={itemsPriceFilter}
                  setOpen={setOpenPrice}
                  setValue={setValuePrice}
                  setItems={setItemsPriceFilter}
                  placeholder="Choose an amount"
                  listMode="SCROLLVIEW"
                  scrollViewProps={{
                    nestedScrollEnabled: true,
                  }}
                  onOpen={() => {
                    setOpenPaymentMethod(false);
                  }}
                  onChangeValue={(value) => {
                    setSelectedPrice(value);
                  }}
                  textStyle={{
                    fontSize: 12,
                  }}
                />
              </View>
              <View style={{ flex: 1 }}></View>
            </View>
          </View>

          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 15,
                marginTop: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '500' }}>
                Delivery Time:
              </Text>
              <View style={{ marginLeft: 20 }}>
                <Button onPress={showDatepicker} title="Date" />
              </View>
              <View style={{ marginLeft: 20 }}>
                <Button onPress={showTimepicker} title="Time" />
              </View>
            </View>
            <Text>
              Selected: {deliveryDate.toLocaleTimeString()}{' '}
              {deliveryDate.toDateString()}
            </Text>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={deliveryDate}
                mode={mode}
                is24Hour={false}
                onChange={onChange}
              />
            )}
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
              onPress={() => {
                // set alerts
                const currentTime = Date.now().valueOf();
                const deliveryTime = deliveryDate.valueOf();
                if (
                  requestData['deliveryLocation'] == null ||
                  requestData['productName'] == null ||
                  requestData['orderDetails'] == null
                ) {
                  // alert for empty inputs
                  setEmptyInputAlert(true);
                } else if (selectedPaymentMethod == null) {
                  setEmptyPaymentMethodAlert(true);
                } else if (selectedPrice == null) {
                  setEmptyPriceAlert(true);
                } else if (currentTime >= deliveryTime) {
                  setExpiredDeliveryTimeAlert(true);
                } else {
                  write_request();
                }
              }}
            >
              <Text style={{ fontSize: 17, fontWeight: '500' }}>Submit</Text>
            </TouchableOpacity>
          </View>
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

      <AwesomeAlert
        show={emptyInputAlert}
        title="Empty Input"
        message="Please fill in all of the blanks"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        cancelText="Close"
        onCancelPressed={() => {
          setEmptyInputAlert(false);
        }}
      />

      <AwesomeAlert
        show={emptyPaymentMethodAlert}
        title="Incomplete Request"
        message="Please select a payment method"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        cancelText="Close"
        onCancelPressed={() => {
          setEmptyPaymentMethodAlert(false);
        }}
      />

      <AwesomeAlert
        show={emptyPriceAlert}
        title="Incomplete Request"
        message="Please select a price"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        cancelText="Close"
        onCancelPressed={() => {
          setEmptyPriceAlert(false);
        }}
      />

      <AwesomeAlert
        show={expiredDeliveryTimeAlert}
        title="Invalid Delivery Time"
        message="Please choose a valid delivery time"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        cancelText="Close"
        onCancelPressed={() => {
          setExpiredDeliveryTimeAlert(false);
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
