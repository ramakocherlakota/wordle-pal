export function extendListWithEmptyStrings(lst, n) {
  if (n < 1) {
    return lst;
  } else {
    return extendListWithEmptyStrings(lst, n-1).concat("");
  }
}

export function listOfEmptyStrings(n) {
  return extendListWithEmptyStrings([], n);
}
