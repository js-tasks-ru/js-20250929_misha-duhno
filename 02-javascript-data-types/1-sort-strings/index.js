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
        changePos = a.toLowerCase().localeCompare(b.toLowerCase());
      }
      else {
        changePos = a.toLowerCase().localeCompare(b.toLowerCase()) * -1;
      }

      // Нужно чтобы слова с заглавными первыми буквами шли первее чем со строчными
      if (changePos) {
        return changePos;
      } else if (a[0] < b[0]) {
        return -1;
      }
    });

    return arrCopy; // Возвращаем отсортированный массив
  }

  return arr;
};
