import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';


var config = {
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: "react-slack-62c47.firebaseapp.com",
    databaseURL: "https://react-slack-62c47.firebaseio.com",
    projectId: "react-slack-62c47",
    storageBucket: "react-slack-62c47.appspot.com",
    messagingSenderId: "643000634447",
    appId: "1:643000634447:web:d1fd22f53b68a6c2"
  };
  // Initialize Firebase
  firebase.initializeApp(config);

  export default firebase;