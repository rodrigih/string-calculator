export const convertNums = (arr, upperBound) => {
  return arr.map(curr => {
    let isNumber = curr.match(/^-?\d+$/);

    if (!isNumber) {
      return 0;
    }

    let numVal = Number(curr);
    let underLimit = upperBound ? numVal < upperBound : true;

    return underLimit ? numVal : 0;
  });
};

export const getNegNums = arr => {
  return arr.filter(curr => curr < 0);
};

export const getFormatData = str => {
  let singleCharPattern = /^\/\/(.)\n/;
  let multiCharPattern = /^\/\/\[(.+)\]\n/;

  let singleMatch = str.match(singleCharPattern);
  let multiMatch = str.match(multiCharPattern);

  if (singleMatch) {
    return {
      delim: singleMatch[1],
      numStr: str.replace(singleCharPattern, "")
    };
  }

  if (multiMatch) {
    return {
      delim: multiMatch[1],
      numStr: str.replace(multiCharPattern, "")
    };
  }

  // No custom delimiters specified
  return {
    delim: "",
    numStr: str
  };
};

export const regExpEscape = str => {
  return str.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, "\\$&");
};
