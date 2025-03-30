class DataApi {
  constructor(databaseKey, db,options ={}) {
    const { defaultProps = {}, extentions = {} } = options;
    this.defaultProps = defaultProps;
    this.databaseKey = databaseKey;
    this.db = db;
    this.initExtentions(extentions);
  }
  initExtentions(extentions) {
    Object.keys(extentions).map((extKey) => {
      this[extKey] = async (...args) => await extentions[extKey](this, ...args);
    });
  }
  buildNew() {
    const stamp = new Date()
   
     const offerPack = {
      title: "",
      tags: [],
      // createdStamp: stamp.valueOf(),
      // createdIso :stamp.toISOString,
      // updateStamp: stamp.valueOf(),
      ...this.defaultProps,
    };

    return offerPack;
  }
  get(id) {
    return this.db.getData(this.databaseKey, id);
  }

  query(queryProps) {
    return this.db.queryData(this.databaseKey, queryProps);
  }

  create(dataPack) {
    const stamp = new Date()
    dataPack.createdStamp = stamp.valueOf()
    dataPack.createdIso = stamp.toISOString()
    return this.db.createData(this.databaseKey, dataPack);
  }

  update(id, dataUpdate) {
    const stamp = new Date()
    dataUpdate.updateStamp = stamp.valueOf()
    dataUpdate.updateIso = stamp.toISOString()
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