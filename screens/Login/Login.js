import { useNavigation } from '@react-navigation/core';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import { handleSignIn } from '../../services/Firebase';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisibility] = useState({ name: 'eye-off' });

  const navigation = useNavigation();

  const ToggleVisibilty = () => {
    if (visible.name === 'eye') {
      setVisibility({ name: 'eye-off' });
    } else {
      setVisibility({ name: 'eye' });
    }
  };

  const secureTextEntry = () => {
    if (visible.name === 'eye') {
      return false;
    } else if (visible.name === 'eye-off') {
      return true;
    }
  };

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleSignInClick = async () => {
    if (email === '' || password === '') {
      console.error('Invalid Credentials');
    } else {
      try {
        () => navigation.navigate('LoginScreen');
        await handleSignIn(email, password);
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
            source={{
              uri: 'http://assets.stickpng.com/images/585e4bf3cb11b227491c339a.png',
            }}
          />
          <TextInput
            style={styles.inputBox}
            placeholder="Email"
            value={email}
            onChangeText={handleEmailChange}
            returnKeyType="next"
            defaultValue={email}
          />
        </View>

        <View style={styles.horizontalLayout}>
          <Image
            style={styles.imageDimension}
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/159/159069.png',
            }}
          />
          <TextInput
            style={styles.inputBox}
            defaultValue={password}
            onChangeText={handlePasswordChange}
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
              source={{
                uri: 'https://www.freeiconspng.com/thumbs/arrow-icon/right-arrow-icon-27.png',
              }}
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
              source={{
                uri: 'https://cdn2.iconfinder.com/data/icons/user-actions-15/24/user_email_mail_account_profile-512.png',
              }}
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
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/72/72371.png',
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
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
