import firebase from "firebase";



const firebaseConfig = {
    apiKey: "AIzaSyBxQmRvcfX6lZjods24RVI8rLtY4in77xk",
    authDomain: "clone-app-5d8a4.firebaseapp.com",
    databaseURL: "https://clone-app-5d8a4.firebaseio.com",
    projectId: "clone-app-5d8a4",
    storageBucket: "clone-app-5d8a4.appspot.com",
    messagingSenderId: "817535374421",
    appId: "1:817535374421:web:5aaac017949c2763a630dc",
    measurementId: "G-HX1X98F7M4"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

const auth = firebase.auth();

export { db, auth};