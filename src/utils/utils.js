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
  let multiCharPattern = /^\/\/(\[(.+)\])+\n/;

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
      delim: multiMatch[2].split("]["),
      numStr: str.replace(multiCharPattern, "")
    };
  }

  // No custom delimiters specified
  return {
    delim: "",
    numStr: str
  };
};

/*
 * Does not escapre following chars:
 *  - "\": to allow user to escape characters
 *  - "[" and "]": have user manually escape these to remove ambiguity
 *    with multiple multi-character delimiters
 */
export const regExpEscape = str => {
  return str.replace(/[-\{}()*+!<=:?.\/^$|#\s,]/g, "\\$&");
};

export const regExpEscapeAll = str => {
  return str.replace(/[-[\]\{}()*+!<=:?.\/\\^$|#\s,]/g, "\\$&");
};

export const createDelimPattern = arr => {
  var patternStr = arr.map(curr => regExpEscape(curr)).join("|");
  return new RegExp(patternStr);
};
