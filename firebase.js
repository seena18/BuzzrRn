import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC1190vpKygYOzk1g_qa1aRqjI1SXiY9cA",
    authDomain: "buzzr-c896a.firebaseapp.com",
    projectId: "buzzr-c896a",
    storageBucket: "buzzr-c896a.appspot.com",
    messagingSenderId: "711844652850",
    appId: "1:711844652850:web:cde93e842b178cd39cd92b",
    measurementId: "G-8HYX6C5RB5"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);


