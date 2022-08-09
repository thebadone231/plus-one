import firebase from 'firebase/compat/app';
import {
  getAuth,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import { getFirestore, collection, doc, setDoc } from '@firebase/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import React, { useState, createContext } from 'react';
import { FIREBASEAPIKEY } from './config.js';

const firebaseConfig = FIREBASEAPIKEY;

// initialize firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
}

export const auth = getAuth();
export const db = getFirestore();
export const userCollectionRef = collection(db, 'users');
export const AuthenticationContext = createContext();
export const requestCollectionRef = () =>
  firebase.firestore().collection('requests').get();

export const AuthenticationContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  firebase.auth().onAuthStateChanged((usr) => {
    if (usr) {
      setUser(usr);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  });

  const handleSignIn = async (email, password) => {
    setIsLoading(true);
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((u) => {
        setUser(u);
        setIsLoading(false);
        console.log(firebase.auth().currentUser);
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error.toString());
        console.error(error);
      });
  };

  const handleSignUp = async (
    email,
    password,
    firstName,
    lastName,
    userName,
    contactNumber,
    homeAddress,
    postalCode
  ) => {
    setIsLoading(true);
    await firebase
      .auth()
      .createUserWithEmailAndPassword(
        email,
        password,
        firstName,
        lastName,
        userName,
        contactNumber,
        homeAddress,
        postalCode
      )
      .then((u) => {
        setUser(u);
        setIsLoading(false);
        setDoc(doc(userCollectionRef, auth.currentUser.email), {
          userdata: {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            contactNumber: contactNumber,
            homeAddress: homeAddress,
            postalCode: postalCode,
          },
          requests: {},
          'plus-one': {},
          deliveries: {},
        });
        console.log(firebase.auth().currentUser);
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error.toString());
        console.error(error);
      });
  };

  const handleSignout = async () => {
    await firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null);
        setError(null);
        console.log('Signed Out');
      })
      .catch((error) => {
        setError(error.toString());
        console.error(error);
      });
  };

  const handleForgotPassword = async (email) => {
    await firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        setUser(null);
        setIsLoading(false);
        setError(null);
      })
      .catch((error) => {
        setError(error.toString());
        console.error(error);
      });
  };

  return (
    <AuthenticationContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        isLoading,
        error,
        handleSignIn,
        handleSignUp,
        handleSignout,
        handleForgotPassword,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

/* database structuring:
  user: {
      userdata: {
        username: '',
        password: '',
        firstname: '',
        lastname: '',
        email: '',
        contact: '',
        home address: '',
        photo: '',
        location: default to home address
      }
      requests: {
        current: {}
        past: {}
      }

  current request: {
      north: {},
      south: {}.
      east: {},
      west: {}, 
      central: {}
    }

  sample request: {
    status: 'current' / 'expired',
    username: ''
    location: {
              address provided by user: '',
              geographical area: N/S/E/W/C, 
              lat: '',
              long: '',
            }, 
    order details: {
      time: '',
      order specifics: '',
      price: '',
      payment method: '',
      contact number: '',
      delivered by: { 
                      user: '',
                      time: '',}
    }
    chat history: {
      message1: {
        time: ,
        username: ,
        message details: ,
      },
    }

  }
    
    }
*/
