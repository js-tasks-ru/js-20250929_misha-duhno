/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */

export const sortStrings = (arr, param = 'asc') => {
  const arrCopy = [...arr];

  const k = param === 'asc' ? 1 : -1;

  return arrCopy.sort((a, b) => {
    return k * a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'});
  });
};
