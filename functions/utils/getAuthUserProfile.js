const { getFirebase } = require("../firebaseConfig/getFirebase");

const { fireStoreDb } = getFirebase();
const getAuthUserProfile = async (authUserId) => {
  const userProfilesRef = fireStoreDb.collection("userProfiles");
  const { docs = [] } = await userProfilesRef
    .where("userId", "==", authUserId)
    .get();

  const [profile] = docs;

  if (profile && profile.exists) {
    return {
      id: profile.id,
      ...profile.data(),
    };
  }
};

exports.getAuthUserProfile = getAuthUserProfile;
