import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCP2LtCjO017B5djO8bneKtQd_TGPML9cA",
  authDomain: "fir-realtime-react-nativ-361b1.firebaseapp.com",
  databaseURL:
    "https://fir-realtime-react-nativ-361b1-default-rtdb.firebaseio.com",
  projectId: "fir-realtime-react-nativ-361b1",
  storageBucket: "fir-realtime-react-nativ-361b1.appspot.com",
  messagingSenderId: "946192311490",
  appId: "1:946192311490:web:978214b6db243744ea075b",
  measurementId: "G-PG5KHFVKBB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const database = getDatabase(app);

export { storage, database };
