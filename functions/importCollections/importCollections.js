const { whileWaitAsync } = require("../utils/whileWaitAsync");

const importCollections = async (collections = [],apis) => {

  const { pickTable } = apis;

  await whileWaitAsync(collections, async (collection) => {
    const { items = [], collectionKey } = collection;
    const api = pickTable(collectionKey);

    await whileWaitAsync(items, async (item) => {
      const { id, ...data } = item;
      console.log("🚀 ~ awaitwhileWaitAsync ~ id:", id)

       await api.create(data, id);

    });
  });
};

module.exports = { importCollections };
