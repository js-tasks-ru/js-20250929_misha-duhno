/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */

export const sortStrings = (arr, param = 'asc') => {
  let arrCopy = [...arr];

  const k = param === 'asc' ? 1 : -1;

  arrCopy = arrCopy.sort((a, b) => {
    return k * a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'});
  });

  return arrCopy; // Возвращаем отсортированный массив
};
