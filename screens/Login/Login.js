import { useNavigation } from '@react-navigation/core';
import React, { useState, useContext, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../services/Firebase';
import AwesomeAlert from 'react-native-awesome-alerts';
import { AuthenticationContext } from '../../services/Firebase';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisibility] = useState({ name: 'eye-off' });
  const [alert, setAlert] = useState(false);
  const { handleSignIn, error, isLoading, user } = useContext(
    AuthenticationContext
  );

  const ToggleVisibilty = () => {
    if (visible.name === 'eye') {
      setVisibility({ name: 'eye-off' });
    } else {
      setVisibility({ name: 'eye' });
    }
  };

  const secureTextEntry = () => {
    return visible.name === 'eye-off';
  };

  const handleSignInClick = async () => {
    if (email === '' || password === '') {
      setAlert(true);
      console.log('invalid credentials');
    } else {
      try {
        await handleSignIn(email, password);
        if (user === null) {
          setAlert(true);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <View style={styles.background}>
      <View style={{ right: 11 }}>
        <Text style={[styles.mainLogo, { left: 8 }]}> +1 </Text>
      </View>

      <View style={{ marginTop: 5, marginBottom: 14, left: 25 }}>
        <View style={[styles.horizontalLayout, { marginBottom: 10 }]}>
          <Image
            style={styles.imageDimension}
            source={require('../../assets/user.png')}
          />
          <TextInput
            style={styles.inputBox}
            placeholder="Email"
            value={email}
            onChangeText={(email) => {
              setEmail(email);
            }}
            returnKeyType="next"
            defaultValue={email}
          />
        </View>

        <View style={styles.horizontalLayout}>
          <Image
            style={styles.imageDimension}
            source={require('../../assets/password.png')}
          />
          <TextInput
            style={styles.inputBox}
            defaultValue={password}
            onChangeText={(password) => {
              setPassword(password);
            }}
            placeholder="Password"
            placeholderTextColor="grey"
            returnKeyType="go"
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
          <Pressable onPress={handleSignInClick}>
            <Image
              style={styles.imageDimension}
              source={require('../../assets/login-arrow.png')}
            />
          </Pressable>
        </View>
      </View>

      <View style={{ margin: 3 }}>
        <View style={{ marginBottom: 7 }}>
          <TouchableOpacity
            style={{ flexDirection: 'row', justifyContent: 'center' }}
            onPress={() => navigation.navigate('NewUser')}
          >
            <Text style={styles.text}>New User</Text>
            <Image
              style={styles.imageDimension}
              source={require('../../assets/new-user.webp')}
            />
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity
            style={{ flexDirection: 'row' }}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.text}>Forgot Password</Text>
            <Image
              style={styles.imageDimension}
              source={require('../../assets/forgot-password.png')}
            />
          </TouchableOpacity>
        </View>
      </View>

      <AwesomeAlert
        show={alert}
        title="Login Unsuccessful"
        message="Invalid Login Details"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        cancelText="Close"
        onCancelPressed={() => {
          setAlert(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#D5DDF9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  mainLogo: {
    fontSize: 50,
    fontWeight: '800',
  },

  horizontalLayout: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  inputBox: {
    backgroundColor: 'white',
    borderRadius: 5,
    width: '60%',
    padding: 2,
    paddingHorizontal: 6,
  },

  imageDimension: {
    width: 20,
    height: 20,
    marginLeft: 10,
    marginRight: 10,
  },

  text: {
    fontWeight: '500',
  },
  eyeContainer: {
    //position: 'absolute',
    // top: 20,
  },
});

export default LoginScreen;
