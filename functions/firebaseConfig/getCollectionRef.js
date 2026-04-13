
exports.getCollectionRef = (db, table, subTable, topDocId) => {
  const collectionRef =
    subTable && topDocId
      ? db.collection(table).doc(topDocId).collection(subTable)
      : db.collection(table);

  return collectionRef;
};

exports.getDocRef = (db, table, id, subTable, subDocId) =>
  subTable && subDocId
    ? db.collection(table).doc(id).collection(subTable).doc(subDocId)
    : db.collection(table).doc(id);
