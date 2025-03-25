 exports.whileFill = (count, onFill = () => ({})) => {
    const list = [];

    while (list.length < count) {
        list.push(onFill(list.length));
    }

    return list;
};
