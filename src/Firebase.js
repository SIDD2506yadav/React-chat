import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBBzH2FKYZntii081uLk4dR3Irrdbv0xrY",
    authDomain: "react-whatsapp-7bf1c.firebaseapp.com",
    projectId: "react-whatsapp-7bf1c",
    storageBucket: "react-whatsapp-7bf1c.appspot.com",
    messagingSenderId: "924075650267",
    appId: "1:924075650267:web:de868fa0bd787ffdc6b0fe",
    measurementId: "G-RM1RNRKPPC",
};

initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
const storage = getStorage();
const database = getDatabase();
export { db, auth, storage, database };
