const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set } = require("firebase/database");

const firebaseConfig = {
  apiKey: "AIzaSyCJEWKEcs-h3injMibkwI92Kj6jHfVmPcE",
  authDomain: "apm-device.firebaseapp.com",
  databaseURL: "https://apm-device-default-rtdb.firebaseio.com",
  projectId: "apm-device",
  storageBucket: "apm-device.appspot.com",
  messagingSenderId: "182391209337",
  appId: "1:182391209337:web:e9ac56d740ca9b204803a8",
  measurementId: "G-ZC683BCM2M",
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

const writeUserData = (userId, name, email, imageUrl) => {
  return set(ref(db, "users/" + userId), {
    username: name,
    email: email,
    profile_picture: imageUrl,
  });
};

module.exports = { writeUserData };
