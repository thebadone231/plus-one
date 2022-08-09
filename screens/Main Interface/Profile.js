import React, { useState, useContext, useEffect } from 'react';
import {View, StyleSheet, Text, TextInput, TouchableOpacity, ActivityIndicator, Image, ScrollView,} from 'react-native';
import { auth, db } from '../../services/Firebase';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { updatePassword, updateEmail } from 'firebase/auth';
import AwesomeAlert from 'react-native-awesome-alerts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AuthenticationContext } from '../../services/Firebase';

const ProfileScreen = ({ navigation }) => {
  const [renderState, setRenderState] = useState(false);
  const [userData, setUserData] = useState({});
  const [visible, setVisibility] = useState({ name: 'eye-off' });
  const [passwordData, setPasswordData] = useState({currentPassword: '', newPassword: '',password: '',});
  const [alert, setAlert] = useState({status: false, title: '', message: '', screen: '',});

  const userDocRef = doc(db, 'users/' + auth.currentUser.email);

  useEffect(() => {
    const getUserData = async () => {
      const UserDatabase = await getDoc(userDocRef);
      const userDetails = UserDatabase.data();
      setUserData(userDetails['userdata']);
    };

    getUserData().then(() => {
        setRenderState(true);
        console.log(userData);
      }).catch((error) => {
        setRenderState(false), console.log(error);
      });

      
  }, []);

  //functional component - input boxes
  let input_component = (field_name, field_value, key, visibility = false) => {
    return (
      <View style={styles.input_container}>
        <Text style={{ fontSize: 15, fontWeight: '500' }}>{field_name}: </Text>
        <TextInput
          style={styles.inputBox}
          defaultValue={field_value}
          secureTextEntry={visibility}
          onChangeText={(text) => {
            if (field_value !== '') {
              let new_object = userData;
              new_object[key] = text;
              setUserData(new_object);
            } else {
              let new_object = passwordData;
              new_object[key] = text;
              setPasswordData(new_object);
            }
          }}
        />
      </View>
    );
  };

  //logic for updating of particulars
  const update_particulars = async () => {
    //password is missing
    if (passwordData['currentPassword'] === '') {
      setAlert({
        status: true,
        title: 'Unsuccessful Update',
        message:
          'Please key in your current password to update your particulars',
        screen: 'Profile',
      });
    } else if (userData['password'] !== passwordData['currentPassword']) { //current password is wrong
      setAlert({
        status: true,
        title: 'Unsuccessful Update',
        message: 'Current password is incorrect',
        screen: 'Profile',
      });
    } else if (passwordData['newPassword'] !== passwordData['password']) { //new password does not match
      setAlert({
        status: true,
        title: 'Unsuccessful Update',
        message: 'New password and confirm password do not match',
        screen: 'Profile',
      });
    } else if (passwordData['newPassword'].length !== 0 && passwordData['newPassword'].length < 8) {  //password is too short ie >8 characters
      setAlert({
        status: true,
        title: 'Unsuccessful Update',
        message: 'Your password has to contain a minimal of 8 characters',
        screen: 'Profile',
      });
    } else { //all necessary information is correct
      //for password changes
      if (passwordData['newPassword'].length !== 0) {
        await updatePassword(auth.currentUser, passwordData['password'])
          .then(() => {
            userData['password'] = passwordData['password'];
            setDoc(userDocRef, { userdata: userData }, { merge: true });
            setAlert({
              status: true,
              title: 'Successfully Updated',
              message: 'Particulars of user have been updated',
              screen: 'HomeScreen',
            });
          })
          .catch(console.error);
      } else if (userData['email'] !== auth.currentUser.email) {
        await updateEmail(auth.currentUser, userData['email'])
          .then(() => {
            setDoc(userDocRef, { userdata: userData }, { merge: true });
            setAlert({
              status: true,
              title: 'Successfully Updated',
              message: 'Particulars of user have been updated',
              screen: 'HomeScreen',
            });
          })
          .catch(console.error);
      } else {
        setDoc(userDocRef, { userdata: userData }, { merge: true });
        setAlert({
          status: true,
          title: 'Successfully Updated',
          message: 'Particulars of user have been updated',
          screen: 'HomeScreen',
        });
      }
    }
  };

  //conditional rendering of profile page based on status of query - loading icon
  let profilePage = (
    <View style={{height: '100%', width: '100%', justifyContent: 'center',alignItems: 'center',}}>
      <ActivityIndicator size="large" />
      <Text>loading user information</Text>
    </View>
  );

  //if the query is completed
  if (renderState === true) {
    profilePage = (
      <View style={{ height: '100%', width: '100%' }}>
        <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
          <Image style={styles.iconDimension} source={require('../../assets/user.png')}/>
          <Text style={{ fontWeight: '500', fontSize: 17 }}>
            hello {userData['userName']}
          </Text>
        </View>

        <View style={{flex: 15, alignItems: 'center', justifyContent: 'space-between',}}>
          <View style={{flex: 3,flexDirection: 'row', width: '83%',justifyContent: 'space-between',}}>
            <Image style={{ width: 35, height: 35 }} source={require('../../assets/exclamationMark.png')}/>
            <Text>
              Please sign out and log in again to change{'\n'}
              your email or password if it has been more{'\n'}
              than 1 min since you logged in
            </Text>
          </View>


          <View style={{ flex: 23, alignItems: 'center' }}>
            <KeyboardAwareScrollView>
              {input_component( 'First Name',userData['firstName'],'firstName')}
              {input_component('Last Name', userData['lastName'], 'lastName')}
              {input_component('Username', userData['userName'], 'userName')}
              {input_component('Current Password', '', 'currentPassword', true)}
              {input_component('New Password', '', 'newPassword', true)}
              {input_component('Confirm Password', '', 'password', true)}
              {input_component('Email', userData['email'], 'email')}
              {input_component('Contact Number', userData['contactNumber'], 'contactNumber')}
              {input_component('Home Address',userData['homeAddress'],'homeAddress')}
              {input_component('Postal Code',userData['postalCode'],'postalCode')}

              <View style={{ width: '100%', alignItems: 'center' }}>
                <TouchableOpacity style={styles.submitButton} onPress={() => {update_particulars();}}>
                  <Text style={{ fontSize: 17, fontWeight: '600' }}>
                    update
                  </Text>
                </TouchableOpacity>
              </View>

            </KeyboardAwareScrollView>


          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 4, justifyContent: 'flex-end' }}>
        <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => {navigation.navigate('HomeScreen');}}>
          <Text style={{ ...styles.mainLogo }}> +1 </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 26 }}>{profilePage}</View>

      <AwesomeAlert
        show={alert['status']}
        title={alert['title']}
        message={alert['message']}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        cancelText="Close"
        onCancelPressed={() => {
          setAlert(false);
          navigation.navigate(alert['screen']);
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
    height: 43,
    width: 310,
  },

  inputBox: {
    height: '77%',
    width: 173,
    borderRadius: 8,
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },

  iconDimension: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },

  submitButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    height: 30,
    marginTop: 10,
    width: '35%',
  },

  botNavBar: {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default ProfileScreen;
