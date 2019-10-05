import { convertNums } from "./utils";

describe("convertNums()", () => {
  describe("that has no extra parameters", () => {
    test("converts empty array", () => {
      const arr = convertNums([]);
      expect(arr).toEqual([]);
    });

    test("converts array with single valid element", () => {
      const arr = convertNums(["20"]);
      expect(arr).toEqual([20]);
    });

    test("converts array with valid elements", () => {
      const arr = convertNums(["1", "5000"]);
      expect(arr).toEqual([1, 5000]);
    });

    test("ignores invalid elements", () => {
      const arr = convertNums(["foo", "40", "bar", "2"]);
      expect(arr).toEqual([0, 40, 0, 2]);
    });

    test("adds negative numbers", () => {
      const arr = convertNums(["-1", "4"]);
      expect(arr).toEqual([-1, 4]);
    });
  });

  describe("that has an upperbound", () => {
    test("ignores numbers greater than upperbound", () => {
      const arr = convertNums(["1", "5000", "1", "40"], 100);
      expect(arr).toEqual([1, 0, 1, 40]);
    });
  });
});
