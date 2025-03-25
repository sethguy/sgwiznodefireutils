const { whileWaitAsync } = require("../utils/whileWaitAsync");

const exportCollections = async (collectionApis = []) => {

  const collections = await whileWaitAsync(
    collectionApis,
    async (collectionData) => {      
      const { collectionKey, api } = collectionData;
      const items = await api.query([]);

      return {
        collectionKey,
        items,
      };
    }
  );

  return collections

};

module.exports = { exportCollections };
