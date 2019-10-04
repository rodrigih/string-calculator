export const convertNums = arr => {
  return arr.map(curr => {
    let isNumber = curr.match(/^-?\d+$/);
    return isNumber ? Number(curr) : 0;
  });
};
