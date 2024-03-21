export const JSONstringifyOrder = (obj, space) => {
  var allKeys = [];
  var seen = {};
  JSON.stringify(obj, function (key, value) {
    if (!(key in seen)) {
      allKeys.push(key);
      seen[key] = null;
    }
    return value;
  });
  allKeys.sort();
  return JSON.stringify(obj, allKeys, space);
};
