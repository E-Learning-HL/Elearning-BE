export function toInOperator(arr: number[]) {
  const arr_set = new Set(arr);
  if (arr_set.size == 0) {
    return '()';
  }
  let x = '(';
  for (var i of arr_set) {
    x += i + ',';
  }

  x = x.substring(0, x.length - 1);
  x = x + ')';
  return x;
}
