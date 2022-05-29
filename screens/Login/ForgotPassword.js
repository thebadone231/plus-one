import React, { useState } from 'react';
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
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { SafeAreaView } from 'react-native-safe-area-context';
import { handleForgotPassword } from '../../services/Firebase';

const ForgotPassword = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');

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
                fontSize: 20,
                color: 'black',
              }}
            >
              Key in your email address
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
                Alert.alert('Please check your email to reset password');
              }}
            >
              <Text style={{ fontSize: 20 }}>Change Password</Text>
            </Pressable>
          </View>
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
    marginBottom: 40,
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
