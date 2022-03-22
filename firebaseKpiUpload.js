const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set } = require("firebase/database");

// in cd.js

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
