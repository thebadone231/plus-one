import React, { useState, useContext, useEffect } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { SafeAreaView } from 'react-native-safe-area-context';
import AwesomeAlert from 'react-native-awesome-alerts';
import { AuthenticationContext } from '../../services/Firebase';

const ForgotPassword = ({ navigation }) => {
  const [alert, setAlert] = useState(false);
  const [email, setEmail] = useState('');
  const { handleForgotPassword, error, isLoading } = useContext(
    AuthenticationContext
  );

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
                fontSize: 30,
                color: 'black',
              }}
            >
              Key in your email
            </Text>
          </View>
          <View style={styles.form}>
            <View style={styles.passwordContainer}>
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
            </View>
            <Pressable
              style={styles.button}
              onPress={() => {
                handleForgotPassword(email);
                setAlert(true);
              }}
            >
              <Text style={{ fontSize: 20 }}>Change Password</Text>
            </Pressable>
          </View>
          <AwesomeAlert
            show={alert}
            title="Email Sent"
            message="Check your email for more details"
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            cancelText="Close"
            onCancelPressed={() => {
              setAlert(false);
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
    marginBottom: 440,
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
});

export default ForgotPassword;
