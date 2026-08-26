import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBN8vm7CzOl3rZsLvk3ddifTmuafjZta6g",
  authDomain: "site-aphc.firebaseapp.com",
  projectId: "site-aphc",
  storageBucket: "site-aphc.firebasestorage.app",
  messagingSenderId: "1012964206543",
  appId: "1:1012964206543:web:51d14173114d9b370894ba",
  measurementId: "G-K5EM79WKGQ",
  databaseURL: "https://site-aphc-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, push, set, onValue };