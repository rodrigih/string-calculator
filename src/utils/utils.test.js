import {convertNums} from './utils';

describe('convertNums Test:', () => {
  test('Empty array', () => {
    const arr = convertNums([]);
    expect(arr).toEqual([]);
  });

  test('Single valid element', () => {
    const arr = convertNums(['20']);
    expect(arr).toEqual([20]);
  });

  test('Valid elements', () => {
    const arr = convertNums(['1', '5000']);
    expect(arr).toEqual([1, 5000]);
  });

  test('Invalid elements', () => {
    const arr = convertNums(['hello', 'world']);
    expect(arr).toEqual([0, 0]);
  });

  test('Valid and invalid elements', () => {
    const arr = convertNums(['foo', '40', 'bar', '2']);
    expect(arr).toEqual([0, 40, 0, 2]);
  });

  test('Negative numbers', () => {
    const arr = convertNums(['-1', '4']);
    expect(arr).toEqual([-1, 4]);
  });

  test('Valid numbers with trailingwhitespace', () => {
    const arr = convertNums(['-1  ', '   4', '3\n']);
    expect(arr).toEqual([0, 0, 0]);
  });
});
