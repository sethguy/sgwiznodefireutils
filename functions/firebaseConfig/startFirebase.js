const { initializeApp } = require("firebase-admin/app");

const startFirebase = () => {
    initializeApp();
};

module.exports = { startFirebase };
