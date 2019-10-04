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

describe("Calculator", () => {
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
      enterStr("1,2,-3");
      expect(
        wrapper
          .find("div.error")
          .text()
          .includes("Error")
      ).toBe(true);
    });

    test("does not render result div", () => {
      enterStr("1,2,-3");
      expect(wrapper.find("div.result")).toHaveLength(0);
    });
  });

  test("gives textarea-error class", () => {
    enterStr("-1,2,3");
    expect(wrapper.find("textarea").hasClass("calculator-textarea-error")).toBe(
      true
    );
  });
});

describe("onChange()", () => {
  describe("with comma delimiter", () => {
    describe("and valid numbers", () => {
      test("adds one number", () => {
        enterStr("20");
        expect(wrapper.state("sum")).toBe(20);
      });

      test("adds two numbers", () => {
        enterStr("1,5000");
        expect(wrapper.state("sum")).toBe(5001);
      });

      test("adds multiple numbers", () => {
        enterStr("10,2,10,10,10");
        expect(wrapper.state("sum")).toBe(42);

        enterStr("1,2,3,4,5,6,7,8,9,10,11,12");
        expect(wrapper.state("sum")).toBe(78);
      });

      test("adds negative numbers", () => {
        enterStr("-2,-2,-2");
        expect(wrapper.state("sum")).toBe(-6);
      });

      test("adds positive and negative numbers", () => {
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
        let numArr = [-2, -2, -2];
        enterStr(numArr.join("\n"));
        expect(wrapper.state("sum")).toBe(-6);
      });

      test("adds positive and negative numbers", () => {
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
