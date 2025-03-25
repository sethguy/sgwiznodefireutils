exports.timeouts = [];

exports.whileWaitAsync = async (list, onItem) => {
  const doneList = [];
  while (doneList.length < list.length) {
    const item = list[doneList.length];
    try {
      const result = await onItem(item);
      doneList.push(result);
    } catch (error) {
      console.log("whileWaitAsync -> error", error);
      doneList.push({ error, item });
    }
  }
  return doneList;
};

exports.sleep = (ms = 0) =>
  new Promise((r) => {
    const id = setTimeout(r, ms);
    timeouts.push(id);
    return id;
  });

exports.clearSleepTimeouts = () => {
  timeouts.forEach((timeout) => {
    clearTimeout(timeout);
  });
};
