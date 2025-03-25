const buildCollectionsFromKeys = (collectionKeys = [], apis) => {
  const { pickTable = () => {} } = apis;

  return collectionKeys.map((collectionKey) => {
    const api = pickTable(collectionKey);

    return {
      collectionKey,
      api,
    };
  });
};

module.exports = { buildCollectionsFromKeys };
