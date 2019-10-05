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
