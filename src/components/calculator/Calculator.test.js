import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Calculator from "./Calculator";

Enzyme.configure({ adapter: new Adapter() });

const wrapper = shallow(<Calculator />);

const enterStr = str => {
  wrapper.find("textarea").simulate("change", {
    target: { value: str }
  });
};

const enterUpperBound = str => {
  wrapper.find("input#upperBound").simulate("change", {
    target: { value: str }
  });
};

const markCheckBox = bool => {
  wrapper.find("input#allow-negatives").simulate("change", {
    target: { checked: bool }
  });
};

describe("Calculator", () => {
  describe("textarea input", () => {
    describe("with valid numbers", () => {
      test("renders result div", () => {
        enterStr("1,2,3");
        expect(
          wrapper
            .find("div.result")
            .text()
            .includes("Sum")
        ).toBe(true);
      });

      test("does not render error div", () => {
        enterStr("1,2,3");
        expect(wrapper.find("div.error")).toHaveLength(0);
      });

      test("gives textarea class", () => {
        enterStr("1,2,3");
        expect(wrapper.find("textarea").hasClass("calculator-textarea")).toBe(
          true
        );
      });
    });

    describe("with negative numbers", () => {
      test("renders error div", () => {
        markCheckBox(false);
        enterStr("1,2,-3");
        expect(wrapper.find("div.error")).toHaveLength(1);
      });

      test("does not render result div", () => {
        enterStr("1,2,-3");
        expect(wrapper.find("div.result")).toHaveLength(0);
      });
      test("gives textarea-error class", () => {
        enterStr("-1,2,3");
        expect(
          wrapper.find("textarea").hasClass("calculator-textarea-error")
        ).toBe(true);
      });
    });
  });

  describe("upperBound input", () => {
    describe("with valid number", () => {
      test("does not render error div", () => {
        enterStr("");
        enterUpperBound("10");
        expect(wrapper.find("div.error")).toHaveLength(0);
      });

      test("correctly updates state ", () => {
        enterUpperBound("10");
        expect(wrapper.state("upperBound")).toBe(10);
        expect(wrapper.state("upperBoundStr")).toEqual("10");
      });
    });

    describe("with invalid number", () => {
      test("renders error div", () => {
        enterUpperBound("10hello");
        expect(wrapper.find("div.error")).toHaveLength(1);
      });
    });
  });
});

describe("handleCalcStrChange()", () => {
  describe("with comma delimiter,", () => {
    describe("with default options,", () => {
      describe("and valid numbers", () => {
        test("adds one number", () => {
          enterStr("20");
          expect(wrapper.state("sum")).toBe(20);
        });

        test("adds multiple numbers", () => {
          enterStr("10,2,10,10,10");
          expect(wrapper.state("sum")).toBe(42);

          enterStr("1,2,3,4,5,6,7,8,9,10,11,12");
          expect(wrapper.state("sum")).toBe(78);
        });

        test("adds positive numbers and negative numbers", () => {
          enterStr("80,-20,-10,5");
          expect(wrapper.state("sum")).toBe(55);
        });
      });
      describe("and valid and invalid numbers", () => {
        test("adds empty string", () => {
          enterStr("");
          expect(wrapper.state("sum")).toBe(0);
        });

        test("ignores invalid numbers", () => {
          enterStr("hello,world,foo,bar");
          expect(wrapper.state("sum")).toBe(0);
        });

        test("adds valid numbers and ignores invalid numbers", () => {
          enterStr("hello,5,world,a2,10");
          expect(wrapper.state("sum")).toBe(15);
        });
      });
    });

    describe("and allows negative numbers", () => {
      test("does not ignore negative numbers", () => {
        markCheckBox(true);
        enterStr("-2,-2,-2");
        expect(wrapper.state("sum")).toBe(-6);
      });

      test("adds multiple positive and negative numbers", () => {
        markCheckBox(true);
        enterStr("80,-20,-10,5");
        expect(wrapper.state("sum")).toBe(55);
      });
    });

    describe("and custom upperBound", () => {
      test("ignores numbers greater than upperbound", () => {
        markCheckBox(false);
        enterUpperBound("100");
        enterStr("10,20,30,200,400,500");
        expect(wrapper.state("sum")).toBe(60);
      });
    });
  });

  describe("with newline delimiter", () => {
    describe("and valid numbers", () => {
      test("adds multiple numbers", () => {
        let numArr = [10, 2, 10, 10, 10];
        enterStr(numArr.join("\n"));
        expect(wrapper.state("sum")).toBe(42);

        numArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        enterStr(numArr.join("\n"));
        expect(wrapper.state("sum")).toBe(78);
      });

      test("adds negative numbers", () => {
        markCheckBox(true);
        let numArr = [-2, -2, -2];
        enterStr(numArr.join("\n"));
        expect(wrapper.state("sum")).toBe(-6);
      });

      test("adds positive and negative numbers", () => {
        markCheckBox(true);
        let numArr = [80, -20, -10, 5];
        enterStr(numArr.join("\n"));
        expect(wrapper.state("sum")).toBe(55);
      });
    });

    describe("and valid and invalid numbers", () => {
      test("ignores invalid numbers", () => {
        let numArr = ["hello", "world", "foo", "bar"];
        enterStr(numArr.join("\n"));
        expect(wrapper.state("sum")).toBe(0);
      });

      test("adds valid numbers and ignores invalid numbers", () => {
        let numArr = ["hello", 5, "world", "a2", 5];
        enterStr(numArr.join("\n"));
        expect(wrapper.state("sum")).toBe(10);
      });
    });
  });

  describe("with mixed delimiters", () => {
    describe("and valid numbers", () => {
      test("adds multiple numbers", () => {
        enterStr("17,6\n6,\n10");
        expect(wrapper.state("sum")).toBe(39);
      });

      test("adds positive and negative numbers", () => {
        markCheckBox(true);
        enterStr("-10,6\n-6,\n20");
        expect(wrapper.state("sum")).toBe(10);
      });
    });

    describe("and valid and invalid numbers", () => {
      test("adds valid numbers and ignores invalid numbers", () => {
        enterStr("hello,world\n2,5\n7\nfoobar");
        expect(wrapper.state("sum")).toBe(14);
      });
    });
  });
});
