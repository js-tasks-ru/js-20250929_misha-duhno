/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size = undefined) {
  let currentSymbol = string[0];
  let counter = 0;
  let result = '';

  for (const symb of string) {
    if (symb !== currentSymbol) {
      counter = 0;
      currentSymbol = symb;
    }
    if (size && counter < size || typeof size === 'undefined') {
      counter += 1;
      result += symb;
    }
  }

  return result;
}
