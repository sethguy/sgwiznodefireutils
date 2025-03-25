 class DataApi {
  constructor(databaseKey, db) {
    this.databaseKey = databaseKey;
    this.db = db;
  }
  get(id) {
    return this.db.getData(this.databaseKey, id);
  }

  query(queryProps) {
    return this.db.queryData(this.databaseKey, queryProps);
  }

  create(dataPack,id) {
    const stamp = new Date()
    
    dataPack.createdStamp = stamp.valueOf()
    dataPack.isoStamp = stamp.toISOString()
    return this.db.createData(this.databaseKey, dataPack,id);
  }

  update(id, dataUpdate) {
    const stamp = new Date()
    dataUpdate.updateStamp = stamp.valueOf()
    dataUpdate.isoStamp = stamp.toISOString()
    return this.db.updateData(this.databaseKey, id, dataUpdate);
  }

  delete(id) {
    this.db.removeData(this.databaseKey, id);
  }

  async getByQueryKey(keyValue, queryKey) {
    const [found] = await this.db.queryData(this.databaseKey, [
      {
        actionKey: "where",
        field: queryKey,
        operator: "==",
        value: keyValue,
      },
    ]);

    return found;
  }
}


module.exports = {
  DataApi
}