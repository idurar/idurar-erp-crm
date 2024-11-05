module.exports.convertKeysToLowerCase = (map) => {
    const newMap = {};
    for (const key in map) {
        if ({}.hasOwnProperty.call(map, key)) {
            newMap[key.toLowerCase()] = map[key];
        }
    }
    return newMap;
};
