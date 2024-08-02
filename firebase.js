


import firebase from "@react-native-firebase/app"
import authorization from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyC1190vpKygYOzk1g_qa1aRqjI1SXiY9cA",
    authDomain: "buzzr-c896a.firebaseapp.com",
    projectId: "buzzr-c896a",
    storageBucket: "buzzr-c896a.appspot.com",
    messagingSenderId: "711844652850",
    appId: "1:711844652850:web:cde93e842b178cd39cd92b",
    measurementId: "G-8HYX6C5RB5",
    databaseURL: ""
};
// firebase.initializeApp(firebaseConfig)
// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// export const storage = getStorage(app);
export const db = firestore();
export const auth = authorization;