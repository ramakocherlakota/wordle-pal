export function extendList(lst, n, supplier) {
  const actualSupplier = supplier || (() => [""]);
  if (n < 1) {
    return lst;
  } else {
    return extendList(lst, n-1).concat(actualSupplier());
  }
}

export function listOfEmptyStrings(n) {
  return extendList([], n, () => "");
}

export function listWithAdjustedLength(lst, n, supplier) {
  if (n > lst.length) {
    return extendList(lst, n - lst.length, supplier);
  } else {
    return lst.slice(0, n);
  }
}

export function deleteAt(lst, at) {
  return lst.filter((it, i) => {
    return i !== at;
  });
}

export function addAt(lst, at, add) {
  return lst.slice(0, at).concat(add).concat(lst.slice(at));
}

export function replaceInList(lst, val, at) {
  return lst.map((it, idx) => {
    if (idx === at) {
      return val;
    } else {
      return it;
    }
  });
}

