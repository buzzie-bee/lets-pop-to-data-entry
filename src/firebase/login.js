import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';

import { auth } from './firebase';

const googleProvider = new firebase.auth.GoogleAuthProvider();

export const signInWithGoogle = () => {
  auth
    .signInWithPopup(googleProvider)
    .then((res) => {
      // console.log(res.user);
    })
    .catch((error) => {
      console.log(error.message);
    });
};

export const signOut = () => {
  auth
    .signOut()
    .then((res) => {
      //
    })
    .catch((error) => {
      console.log(error.message);
    });
};
