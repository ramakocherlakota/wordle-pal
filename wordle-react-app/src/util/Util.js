export function extendList(lst, n, supplier) {
  const actualSupplier = supplier || (() => [""]);
  if (n < 1) {
    return lst;
  } else {
    return extendList(lst, n-1, supplier).concat(actualSupplier());
  }
}

export function listOfEmptyStrings(n) {
  return extendList([], n, () => "");
}

export function listOfEmptyLists(n) {
  return extendList([], n, () => [[]]); // damn concat
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

export function isMobile() {
  return window.innerWidth < 547;
}

export function ifDesktop(str) {
  if (!isMobile()) {
    return str;
  } else {
    return "";
  }
}

export function jsonFromLS(key, defaultValue) {
  let inLS = null
  try {
    inLS = window.localStorage.getItem(key);
    if (inLS) {
      return JSON.parse(inLS);
    } 
  } catch {
    console.log("Malformed JSON in localStorage for key " + key);
    console.log(inLS);
  }
  return defaultValue;
}

export function classifyLetters(guesses, scoreList) {
  const classified = {yes: new Set(), no: new Set()};
  for (let i=0; i<guesses.length; i++) {
    const guess = guesses[i];
    const score = scoreList[i];
    const good = guess.split("").map((ch, j) => {
      if (score[j] !== '-') {
        return ch;
      } else {
        return null;
      }
    }).filter(Boolean);
    const bad = guess.split("").map((ch, j) => {
      if (score[j] === '-') {
        return ch;
      } else {
        return null;
      }
    }).filter(Boolean);
    for (const g in good) {
      classified.yes.add(good[g]);
    }
    for (const b in bad) {
      classified.no.add(bad[b]);
    }
  }
  return classified;
} 
