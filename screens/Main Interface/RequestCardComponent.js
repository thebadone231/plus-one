import React, { useContext, useState, useEffect } from 'react';
import { Text, Image, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { doc, getDoc, setDoc, addDoc, collection } from 'firebase/firestore';
import { db, auth, AuthenticationContext } from '../../services/Firebase';

const RequestCard = ({ request = {}, navigation }) => {
  const [requestdata, setRequestData] = useState([]);

  const { user } = useContext(AuthenticationContext);
  const requestDocRef = doc(db, 'requests/' + request['requestid']);
  const sessionDocRef = doc(db, 'session/' + user.email);

  useEffect(() => {
    const getRequestData = async () => {
      const requestDatabase = await getDoc(requestDocRef);
      setRequestData(requestDatabase.data());
    };

    getRequestData()
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // default dummy data
  const {
    restaurantName = 'Mr Coconut',
    price = '$3.00',
    address = 'King Edward VII Hall, 1A Kent Ridge Rd, Singapore 119224',
    profilePicture = require('../../assets/user.png'),
    username = 'user',
    orderDetails = 'Large coconut shake, no toppings, 0% sugar, less ice',
    deliverBy = '1400',
    paymentMethod = 'Cash',
    contactNumber = '91234567',
  } = request;

  return (
    <Card elevation={5} style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.restaurantDetailsContainer}>
          <View style={styles.restaurantNameAndPriceContainer}>
            <View style={styles.restaurant}>
              <Text style={styles.restaurantText}>
                {restaurantName}
                {'    '}
                {`$${price}`}
              </Text>
            </View>
          </View>
          <View style={styles.restaurantAddressContainer}>
            <Text style={styles.addressText}>{address}</Text>
          </View>
        </View>
        <View style={styles.userDetailsContainer}>
          <View style={styles.profilePictureContainer}>
            <Image style={styles.profilePicture} source={profilePicture} />
          </View>
          <View style={styles.usernameContainer}>
            <Text style={styles.usernameText}>{username}</Text>
          </View>
        </View>
      </View>
      <View style={styles.orderDetails}>
        <View style={styles.leftContainer}>
          <Text>Order Details:</Text>
        </View>
        <View style={styles.rightContainer}>
          <Text>{orderDetails}</Text>
        </View>
      </View>
      <View style={styles.deliverBy}>
        <View style={styles.leftContainer}>
          <Text>Deliver By:</Text>
        </View>
        <View style={styles.rightContainer}>
          <Text>{deliverBy.toLocaleString()}</Text>
        </View>
      </View>
      <View style={styles.paymentMethod}>
        <View style={styles.leftContainer}>
          <Text>Payment:</Text>
        </View>
        <View style={styles.rightContainer}>
          <Text>{paymentMethod}</Text>
        </View>
      </View>
      <View style={styles.contactNumberRow}>
        <View style={styles.leftContainer}>
          <Text>Contact:</Text>
        </View>
        <View style={styles.contactContainer}>
          <View style={styles.contactNumber}>
            <Text>{contactNumber}</Text>
          </View>
          <View style={styles.plusoneIconContainer}>
            {/* <TouchableOpacity style={styles.plusoneIcon}>
              <Text>+1</Text>
            </TouchableOpacity> */}
          </View>
          <View style={styles.chatIconContainer}>
            <TouchableOpacity
              onPress={() => {
                //creating schat session for requests
                setDoc(
                  doc(
                    db,
                    'session',
                    'chat history',
                    request['requestid'],
                    'test'
                  ),
                  {
                    _id: '',
                    text: '',
                    createdAt: new Date(),
                    user: { _id: '', name: '', avatar: '' },
                  }
                );
                setDoc(
                  doc(db, 'users', user.email),
                  { 'chat session': request['requestid'] },
                  { merge: true }
                );
                navigation.navigate('ChatScreen');
              }}
            >
              <Image
                style={styles.chatIcon}
                source={require('../../assets/chat.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.deliverRow}>
        {/* <TouchableOpacity style={styles.deliverButton}>
          <Text style={styles.deliverText}>Deliver</Text>
        </TouchableOpacity> */}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    flex: 1,
    padding: 15,
    margin: 10,
    borderRadius: 10,
  },
  headerRow: {
    flex: 2,
    flexDirection: 'row',
  },
  restaurantDetailsContainer: {
    flex: 6,
  },
  userDetailsContainer: {
    flex: 1,
  },
  restaurantNameAndPriceContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  restaurantAddressContainer: {
    flex: 1,
    paddingTop: 5,
  },
  restaurant: {
    flex: 4,
  },
  restaurantText: {
    fontSize: 19,
    fontWeight: '700',
  },
  profilePictureContainer: {
    flex: 1,
  },
  profilePicture: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  addressRow: {
    flex: 1,
    flexDirection: 'row',
  },
  address: {
    flex: 5,
  },
  addressText: {
    fontSize: 9,
    fontWeight: '400',
  },
  usernameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  usernameText: {
    fontSize: 12,
    fontWeight: '800',
  },
  orderDetails: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 5,
  },
  leftContainer: {
    flex: 1,
  },
  rightContainer: {
    flex: 2.1,
  },
  deliverBy: {
    flex: 1,
    flexDirection: 'row',
  },
  paymentMethod: {
    flex: 1,
    flexDirection: 'row',
  },
  contactNumberRow: {
    flex: 1.5,
    flexDirection: 'row',
  },
  contactNumber: {
    flex: 4,
  },
  plusoneIconContainer: {
    flex: 1,
    marginRight: 15,
  },
  plusoneIcon: {
    elevation: 2,
    borderRadius: 40,
    backgroundColor: '#8DEEEE',
    padding: 4,
    alignItems: 'center',
  },
  chatIconContainer: {
    flex: 1,
  },
  chatIcon: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  deliverRow: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliverButton: {
    elevation: 2,
    borderRadius: 10,
    backgroundColor: '#009688',
    padding: 4,
  },
  deliverText: {
    color: 'white',
    fontSize: 11,
  },
  contactContainer: {
    flex: 2.1,
    flexDirection: 'row',
  },
});

export default RequestCard;
