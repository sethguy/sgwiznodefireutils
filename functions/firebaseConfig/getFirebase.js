const admin = require("firebase-admin");

const { getFirestore } = require("firebase-admin/firestore");

const getFirebase = () => {
    const fireStoreDb = getFirestore();

    return { fireStoreDb, admin };
};


module.exports = { getFirebase };
