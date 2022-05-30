import React, { useState } from 'react';
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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/core';
import { handleSignUp } from '../../services/Firebase';

const NewUser = () => {
  const navigation = useNavigation();

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
    if (
      email === '' ||
      password === '' ||
      confirmPassword === '' ||
      password !== confirmPassword
    ) {
      Alert.alert('Invalid credentials');
    } else if (password.length < 8) {
      Alert.alert('the minimum length of password is 8');
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
        Alert.alert(
          'Sign Up Successful',
          'Please sign in using your credentials'
        );
        navigation.navigate('LoginScreen');
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.iconRow}>
              <TouchableOpacity
                onPress={() => navigation.navigate('LoginScreen')}
              >
                <Image
                  style={styles.backImage}
                  source={require('../../assets/backButton.png')}
                />
              </TouchableOpacity>
              <Text style={styles.mainLogo}>+1</Text>
            </View>
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
                placeholder="Password (Minimally 8 characters)"
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainLogo: {
    marginLeft: 120,
    marginTop: 4,
    fontSize: 50,
    fontWeight: '800',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    height: '50%',
    paddingTop: StatusBar.currentHeight,
    marginBottom: 20,
    marginTop: -70,
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
    fontSize: 40,
    height: 44,
    width: 40,
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
  iconRow: {
    height: 44,
    flexDirection: 'row',
    flex: 1,
    marginRight: 170,
    marginLeft: 11,
    marginTop: 10,
  },
  header: {
    width: 375,
    height: 65,
    flexDirection: 'row',
    marginTop: 44,
  },
});

export default NewUser;
