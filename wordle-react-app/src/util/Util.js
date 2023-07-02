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
  const classified = {
    "a": 0,
    "b": 0,
    "c": 0,
    "d": 0,
    "e": 0,
    "f": 0,
    "g": 0,
    "h": 0,
    "i": 0,
    "j": 0,
    "k": 0,
    "l": 0,
    "m": 0,
    "n": 0,
    "o": 0,
    "p": 0,
    "q": 0,
    "r": 0,
    "s": 0,
    "t": 0,
    "u": 0,
    "v": 0,
    "w": 0,
    "x": 0,
    "y": 0,
    "z": 0
  };
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
      if (score[j] === '-' && ! good.includes(ch)) {
        return ch;
      } else {
        return null;
      }
    }).filter(Boolean);
    for (const g in good) {
      classified[good[g]] = 1;
    }
    for (const b in bad) {
      classified[bad[b]] = -1;
    }
  }
  return classified;
} 
