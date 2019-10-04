export const convertNums = arr => {
  return arr.map(curr => {
    let isNumber = curr.match(/^-?\d+$/);
    return isNumber ? Number(curr) : 0;
  });
};

export const getNegNums = arr => {
  return arr.filter(curr => curr < 0);
};
