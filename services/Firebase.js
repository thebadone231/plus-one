import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

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
}

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
export const handleSignUp = async (email, password) => {
  await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      console.log(firebase.auth().currentUser);
      const user = firebase.auth().currentUser;
    })
    .catch((error) => {
      console.error(error);
    });
};
