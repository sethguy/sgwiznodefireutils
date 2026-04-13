
 const handleStamps = (data, onStamp = () => {}) => {
  try {
    if (Array.isArray(data)) {
      const batchPack = data.map((batchItem) => {
        const stampedItem = onStamp(batchItem);

        return {
          ...stampedItem,
        };
      });

      return batchPack;
    } else {
      const stampedItem = onStamp(data);

      return stampedItem;
    }
  } catch (error) {
    console.log("🚀 ~ handleStamps ~ error:", error);

    return data;
  }
};

 const stampData = (data = {}, key = "update") => {
  const date = new Date();
  const stamp = date.valueOf();
  const iso = date.toISOString();

  data[`${key}Stamp`] = stamp;
  data[`${key}Iso`] = iso;

  return data;
};


 class DataApi {
  constructor(databaseKey, db, options = {}) {
    const { defaultProps = {}, extentions = {} } = options;
    this.databaseKey = databaseKey;
    this.db = db;
    this.defaultProps = defaultProps;
    this.initExtentions(extentions);
  }
  initExtentions(extentions) {
    Object.keys(extentions).map((extKey) => {
      this[extKey] = async (...args) => await extentions[extKey](this, ...args);
    });
  }
  buildNew() {
    const stamp = new Date();

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
  get(id, options = {}) {
    return this.db.getData(this.databaseKey, id, options);
  }
  async getByQueryKey(keyValue, queryKey, options = {}) {
    const [found] = await this.db.queryData(
      this.databaseKey,
      [
        {
          actionKey: "where",
          field: queryKey,
          operator: "==",
          value: keyValue,
        },
      ],
      options,
    );

    return found;
  }
  query(queryProps, options = {}) {
    return this.db.queryData(this.databaseKey, queryProps, options);
  }

  create(dataPack, options = {}) {

    const stampedData = handleStamps(dataPack, (dataItem) => {
      const stampedItem = stampData(stampData(dataItem, "created"), "update");
      return stampedItem;
    });

    return this.db.createData(this.databaseKey, stampedData, options);
  }

  update(id, dataUpdate = {}, options = {}) {

    const stampedUpdate = handleStamps(dataUpdate, (dataItem) => {
      const stampedItem = stampData(dataItem, "update");
      return stampedItem;
    });

    return this.db.updateData(this.databaseKey, id, stampedUpdate, options);
  }

  delete(id, options = {}) {
    this.db.removeData(this.databaseKey, id, options);
  }
  onSnapshot(id, onUpdate = () => {}, options = {}) {
    const { onSnapshot = () => {} } = this.db;
    return onSnapshot(this.databaseKey, id, onUpdate, options);
  }
}


module.exports = {DataApi}