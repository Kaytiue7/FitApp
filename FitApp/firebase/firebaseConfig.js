// firebaseConfig.js

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAkW2Y-nwoAdxFZjE6VgLD2Gce4RdJvZMw",
  authDomain: "football-game-7f49b.firebaseapp.com",
  projectId: "football-game-7f49b",
  storageBucket: "football-game-7f49b.appspot.com",
  messagingSenderId: "349158905666",
  appId: "1:349158905666:web:c333b68b2b6fe522d3dadb",
  measurementId: "G-FH4JT6EPJM"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();  
}

const firestore = firebase.firestore(); 

export { firebase, firestore };