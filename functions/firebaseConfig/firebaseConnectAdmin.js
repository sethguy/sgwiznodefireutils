const {  getFirebase } = require("./getFirebase");

const { fireStoreDb } = getFirebase();


exports.firebaseConnectAdmin = {
  getData: async (table, id) => {
    const docSnap = await fireStoreDb.collection(table).doc(id).get();

    return {
      id: docSnap.id,
      ...docSnap.data(),
    };
  },
  removeData: async (table, id) => {
    const docRef = fireStoreDb.collection(table).doc(id);
    await docRef.delete();
  },
  createData: async (table, data, id) => {    
    const docRef = id
      ? await fireStoreDb.collection(table).doc(id).set(data)
      : await fireStoreDb.collection(table).add(data);
    return docRef;
  },
  updateData: async (table, id, data) => {
    const docRef = fireStoreDb.collection(table).doc(id);
    await docRef.update(data);
    return { id };
  },
  queryData: async (table, queryParams = []) => {
    const firebaseQuery = buildQueryFromParams(
      queryParams,
      fireStoreDb.collection(table)
    );

    const querySnapshot = await firebaseQuery.get();

    const { docs = [] } = querySnapshot;

    const data = docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    return data;
  },
};

const getActionFunctionForKey = (paramArgs, queryRef) => {
  const { actionKey, field, operator, value, limitCount } = paramArgs;
  switch (actionKey) {
    case "orderBy": {
      return queryRef[actionKey](field, operator);
    }
    case "where": {
      return queryRef[actionKey](field, operator, value);
    }
    case "limit": {
      return queryRef[actionKey](limitCount);
    }
  }
};

const buildQueryFromParams = (queryParams = [], queryRef) => {
  const finalQuery = queryParams.reduce((queryNext, paramArgs) => {
    return getActionFunctionForKey(paramArgs, queryNext);
  }, queryRef);

  return finalQuery;
};
