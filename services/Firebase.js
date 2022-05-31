import firebase from 'firebase/compat/app';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc } from '@firebase/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { NavigationContainer } from '@react-navigation/native';

const firebaseConfig = {
  apiKey: 'AIzaSyAK175YJV5bGZdfzNbZ6GlxHLmnzkv4piY',
  authDomain: 'plusone-af9a7.firebaseapp.com',
  projectId: 'plusone-af9a7',
  storageBucket: 'plusone-af9a7.appspot.com',
  messagingSenderId: '39016922582',
  appId: '1:39016922582:web:1d7bc4a61a0161f28eb877',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
}

export const auth = getAuth();
export const db = getFirestore();
export const userCollectionRef = collection(db, 'users');

// sign in function
export const handleSignIn = async (email, password) => {
  await firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log(firebase.auth().currentUser);
    })
    .catch((error) => {
      console.error(error);
    });
};

//handles user sign out
export const handleSignout = async () => {
  await firebase
    .auth()
    .signOut()
    .then(() => {
      console.log('Signed Out');
    })
    .catch((error) => {
      console.error(error);
    });
};

// signup function
export const handleSignUp = async (
  email,
  password,
  firstName,
  lastName,
  userName,
  contactNumber,
  homeAddress,
  postalCode
) => {
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
    .then(() => {
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
        requests: {
          current: {},
          taken: {},
          completed: {},
          cancelled: {},
          expired: {},
        },
      });
      console.log(firebase.auth().currentUser);
    })
    .catch((error) => {
      console.error(error);
    });
};

// Reset password function
export const handleForgotPassword = async (email) => {
  try {
    await firebase.auth().sendPasswordResetEmail(email);
  } catch (error) {
    console.log(error);
  }
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
