import firebase from "firebase/app";
import "firebase/firestore"
import "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyDmeBqAdDOsx4wPgMzAscX0d_bBEt5RN4o",
    authDomain: "volunteer-activities-44e08.firebaseapp.com",
    projectId: "volunteer-activities-44e08",
    storageBucket: "volunteer-activities-44e08.appspot.com",
    messagingSenderId: "756117505952",
    appId: "1:756117505952:web:913f5bb14b43f12aba06c5"
  };

//init firebase

  firebase.initializeApp(firebaseConfig);

//init services

firebase.firestore();

const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();


export {projectFirestore, projectAuth};