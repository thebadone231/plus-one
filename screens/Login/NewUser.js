import React, { useState, useContext, useEffect } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/core';
import { auth } from '../../services/Firebase';
import AwesomeAlert from 'react-native-awesome-alerts';
import { AuthenticationContext } from '../../services/Firebase';

const NewUser = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [visible, setVisibility] = useState({ name: 'eye-off' });
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [emptyEmailAlert, setEmptyEmailAlert] = useState(false);
  const [emptyPasswordAlert, setEmptyPasswordAlert] = useState(false);
  const [passwordMismatchAlert, setPasswordMismatchAlert] = useState(false);
  const [passwordLengthAlert, setPasswordLengthAlert] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [failureAlert, setFailureAlert] = useState(false);

  const { handleSignUp, error, isLoading } = useContext(AuthenticationContext);

  //Toggles the eye icon to show the password
  const ToggleVisibilty = () => {
    if (visible.name === 'eye') {
      setVisibility({ name: 'eye-off' });
    } else {
      setVisibility({ name: 'eye' });
    }
  };

  //Handles password visibility when the eye icon is pressed
  const secureTextEntry = () => {
    return visible.name === 'eye-off';
  };

  //Handles sign up
  const handleSubmit = async () => {
    if (email === '') {
      setEmptyEmailAlert(true);
    } else if (password === '') {
      setEmptyPasswordAlert(true);
    } else if (password !== confirmPassword) {
      setPasswordMismatchAlert(true);
    } else if (password.length < 8) {
      setPasswordLengthAlert(true);
    } else {
      try {
        await handleSignUp(
          email,
          password,
          firstName,
          lastName,
          userName,
          contactNumber,
          homeAddress,
          postalCode
        );
        if (auth.currentUser === null) {
          setFailureAlert(true);
        } else {
          setSuccessAlert(true);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('LoginScreen')}
            >
              <Image
                style={styles.backImage}
                source={require('../../assets/backButton.png')}
              />
            </TouchableOpacity>
            <Text style={styles.mainLogo}> +1 </Text>
          </View>
          <View style={styles.headerContainer}>
            <Text
              style={{
                fontSize: 36,
                color: 'black',
              }}
            >
              Create an account
            </Text>
          </View>
          <View style={styles.form}>
            <TextInput
              style={styles.email}
              defaultValue={email}
              onChangeText={(email) => {
                setEmail(email);
              }}
              textContentType="emailAddress"
              placeholder="Email Address"
              placeholderTextColor="grey"
              keyboardType="email-address"
              returnKeyType="next"
            />
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.password}
                defaultValue={password}
                onChangeText={(password) => {
                  setPassword(password);
                }}
                placeholder="Password (Min 8 characters)"
                placeholderTextColor="grey"
                returnKeyType="next"
                secureTextEntry={secureTextEntry()}
                textContentType="password"
                keyboardType="default"
                autoCorrect={false}
              />
              <Ionicons
                name={visible.name}
                size={24}
                color="#1da"
                style={styles.eyeContainer}
                onPress={ToggleVisibilty}
              />
            </View>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.password}
                defaultValue={confirmPassword}
                onChangeText={(confirmPassword) => {
                  setConfirmPassword(confirmPassword);
                }}
                placeholder="Confirm Password"
                placeholderTextColor="grey"
                returnKeyType="go"
                secureTextEntry={secureTextEntry()}
                textContentType="password"
                keyboardType="default"
                autoCorrect={false}
              />
            </View>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.email}
                defaultValue={firstName}
                onChangeText={(firstName) => {
                  setFirstName(firstName);
                }}
                textContentType="familyName"
                placeholder="First Name"
                placeholderTextColor="grey"
                keyboardType="default"
                returnKeyType="next"
              />
            </View>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.email}
                defaultValue={lastName}
                onChangeText={(lastName) => {
                  setLastName(lastName);
                }}
                textContentType="givenName"
                placeholder="Last Name"
                placeholderTextColor="grey"
                keyboardType="default"
                returnKeyType="next"
              />
            </View>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.email}
                defaultValue={userName}
                onChangeText={(userName) => {
                  setUserName(userName);
                }}
                textContentType="username"
                placeholder="Username"
                placeholderTextColor="grey"
                keyboardType="default"
                returnKeyType="next"
              />
            </View>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.email}
                defaultValue={contactNumber}
                onChangeText={(contactNumber) => {
                  setContactNumber(contactNumber);
                }}
                textContentType="telephoneNumber"
                placeholder="Contact Number"
                placeholderTextColor="grey"
                keyboardType="number-pad"
                returnKeyType="next"
              />
            </View>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.email}
                defaultValue={homeAddress}
                onChangeText={(homeAddress) => {
                  setHomeAddress(homeAddress);
                }}
                textContentType="fullStreetAddress"
                placeholder="Home Address"
                placeholderTextColor="grey"
                keyboardType="default"
                returnKeyType="next"
              />
            </View>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.email}
                defaultValue={postalCode}
                onChangeText={(postalCode) => {
                  setPostalCode(postalCode);
                }}
                textContentType="postalCode"
                placeholder="Postal Code"
                placeholderTextColor="grey"
                keyboardType="number-pad"
                returnKeyType="done"
                maxLength={6}
              />
            </View>
            <Pressable style={styles.button} onPress={handleSubmit}>
              <Text style={{ fontSize: 20 }}>SIGN UP</Text>
            </Pressable>
          </View>
          <AwesomeAlert
            show={emptyEmailAlert}
            title="Error"
            message="Email cannot be empty"
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            cancelText="Close"
            onCancelPressed={() => {
              setEmptyEmailAlert(false);
            }}
          />
          <AwesomeAlert
            show={emptyPasswordAlert}
            title="Error"
            message="Password cannot be empty"
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            cancelText="Close"
            onCancelPressed={() => {
              setEmptyPasswordAlert(false);
            }}
          />
          <AwesomeAlert
            show={passwordMismatchAlert}
            title="Error"
            message="Both passwords do not match"
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            cancelText="Close"
            onCancelPressed={() => {
              setPasswordMismatchAlert(false);
            }}
          />
          <AwesomeAlert
            show={passwordLengthAlert}
            title="Error"
            message="Password must be longer than 8 characters"
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            cancelText="Close"
            onCancelPressed={() => {
              setPasswordLengthAlert(false);
            }}
          />
          <AwesomeAlert
            show={successAlert}
            title="Registration successful!"
            message="Please login with your email and password"
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            cancelText="Close"
            onCancelPressed={() => {
              setSuccessAlert(false);
              navigation.navigate('LoginScreen');
            }}
          />
          <AwesomeAlert
            show={failureAlert}
            title="Registration unsuccessful!"
            message="Please check your personal particulars again"
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            cancelText="Close"
            onCancelPressed={() => {
              setFailureAlert(false);
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainLogo: {
    marginLeft: 90,
    fontSize: 50,
    fontWeight: '800',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    height: '50%',
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#D5DDF9',
  },
  horizontalLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '80%',
    height: 50,
    marginBottom: 70,
    //top: -20,
  },
  form: {
    width: '80%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    top: -40,
    flex: 8,
  },
  email: {
    width: '100%',
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 35,
    padding: 10,
    fontSize: 18,
    color: 'black',
  },
  password: {
    width: '85%',
    height: 60,
    borderRadius: 5,
    marginBottom: 35,
    padding: 10,
    fontSize: 18,
    color: 'black',
  },

  passwordContainer: {
    //flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 35,
  },
  eyeContainer: {
    position: 'absolute',
    right: 10,
    top: 20,
  },
  backImage: {
    width: 20,
    height: 20,
    marginLeft: 20,
    marginRight: 20,
  },

  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#1da',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    top: 30,
    padding: 10,
    marginBottom: 20,
  },
  alert: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
});

export default NewUser;
