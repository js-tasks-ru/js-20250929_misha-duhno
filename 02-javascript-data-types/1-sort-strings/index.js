/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */

export const sortStrings = (arr, param = 'asc') => {
  if (arr.length > 1) { // Если у нас в массиве всего 1 элемент, нет смысла его сортировать, просто возвращаем его
    let arrCopy = [...arr];

    arrCopy = arrCopy.sort((a, b) => {
      let changePos;

      // В зависимости от param записываем в changePos нужное значение
      if (param === 'asc') {
        changePos = a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'});
      }
      else {
        changePos = a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'}) * -1;
      }

      return changePos;
    });

    return arrCopy; // Возвращаем отсортированный массив
  }

  return arr;
};
