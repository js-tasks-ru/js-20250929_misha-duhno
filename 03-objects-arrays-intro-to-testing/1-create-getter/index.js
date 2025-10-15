/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const keys = path.split('.');

  const getValueFromKey = (obj, keyId = 0) => {
    if (keyId >= keys.length - 1 || !Object.keys(obj).length) {
      return obj.hasOwnProperty(keys[keyId]) ? obj[keys[keyId]] : undefined;
    }
    return getValueFromKey(obj[keys[keyId]], keyId + 1);
  };

  return getValueFromKey;
}

