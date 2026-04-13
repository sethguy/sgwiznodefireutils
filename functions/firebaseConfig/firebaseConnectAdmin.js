const { getDocRef, getCollectionRef } = require("./getCollectionRef");

const initFirebaseConnectAdmin = ({ fireStoreDb, Filter }) => {
  const firebaseConnectAdmin = {
    getData: async (table, id, options = {}) => {
      const { subTable, subDocId } = options;

      const docRef = getDocRef(fireStoreDb, table, id, subTable, subDocId);

      const docSnap = await docRef.get();

      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    },
    removeData: async (table, id, options = {}) => {
      const { subTable, subDocId, batch } = options;

      const docRef = getDocRef(fireStoreDb, table, id, subTable, subDocId);
      await docRef.delete();
    },
    createData: async (table, data, options = {}) => {
      const { subTable, topDocId, batch } = options;
      const collectionRef = getCollectionRef(fireStoreDb, table, subTable, topDocId);

      const docRef = await collectionRef.add(data);
      return docRef;
    },
    updateData: async (table, id, data, options = {}) => {
      const { subTable, subDocId, batch } = options;
      const docRef = getDocRef(fireStoreDb, table, id, subTable, subDocId);

      await docRef.update(data);
      return { id };
    },
    queryData: async (table, queryParams = [], options = {}) => {
      const {
        justDocs,
        getUpdates,
        onUpdate = () => {},
        subTable,
        topDocId,
      } = options;

      const collectionRef = getCollectionRef(
        fireStoreDb,
        table,
        subTable,
        topDocId,
      );

      const firebaseQuery = buildQueryFromParams(queryParams, collectionRef);

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
    const {
      actionKey,
      field,
      operator,
      value,
      limitCount,
      orArgs = [],
    } = paramArgs;
    switch (actionKey) {
      case "or": {
        const orQuerys = orArgs.map((orArg) => {
          return getActionFunctionForKey(orArg, Filter);
        });
        return queryRef.where(Filter.or(...orQuerys));
      }
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

  return firebaseConnectAdmin;
};



module.exports = { initFirebaseConnectAdmin };

