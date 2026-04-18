const { getDocRef, getCollectionRef } = require("./getCollectionRef");

exports.buildBatchUpdate = async (db,table, id, data, options = {}) => {
  const { subTable } = options;

  const batcher = db.batch();

  const batchSet = data.map((batchItem) => {
    const { id: batchItemId, ...batchItemData } = batchItem;

    const itemRef = getDocRef(
      db,
      table,
      id,
      subTable,
      batchItemId,
    );

    batcher.update(itemRef, {
      ...batchItemData,
    });

    return {
      ...batchItem,
      id: itemRef.id,
    };
  });


  await batcher.commit();
  return batchSet;
};
