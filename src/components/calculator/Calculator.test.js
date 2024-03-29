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

const makeSelection = str => {
  wrapper.find("select#operation-selection").simulate("change", {
    target: { value: str }
  });
};

const resetOptions = () => {
  markCheckBox(false);
  enterUpperBound(1000);
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
            .includes("Result")
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

  describe("result div", () => {
    describe("shows equation", () => {
      /* Allow Negative numbers for each test and reset upperBound*/
      beforeAll(() => {
        resetOptions();
        markCheckBox(true);
        enterUpperBound("1000");
      });
      test("with positive numbers", () => {
        enterStr("1,2,3,4");
        expect(
          wrapper
            .find("div.result")
            .text()
            .includes("1 + 2 + 3 + 4 = 10")
        );
      });

      test("with negative numbers including parenthesis", () => {
        enterStr("1,-2,3,4");
        makeSelection("multiply");
        expect(
          wrapper
            .find("div.result")
            .text()
            .includes("1 * (-2) * 3 * 4 = -24")
        );
      });
    });
  });
});

describe("handleCalcStrChange()", () => {
  /* ADDITION Test Suite */
  describe("addition", () => {
    beforeAll(() => {
      resetOptions();
      makeSelection("add");
    });
    describe("with comma delimiter,", () => {
      describe("with default options,", () => {
        describe("and valid numbers", () => {
          test("adds one number", () => {
            enterStr("20");
            expect(wrapper.state("calcResult")).toBe(20);
          });

          test("adds multiple numbers", () => {
            enterStr("10,2,10,10,10");
            expect(wrapper.state("calcResult")).toBe(42);

            enterStr("1,2,3,4,5,6,7,8,9,10,11,12");
            expect(wrapper.state("calcResult")).toBe(78);
          });

          test("adds positive numbers and negative numbers", () => {
            enterStr("80,-20,-10,5");
            expect(wrapper.state("calcResult")).toBe(55);
          });
        });
        describe("and valid and invalid numbers", () => {
          test("adds empty string", () => {
            enterStr("");
            expect(wrapper.state("calcResult")).toBe(0);
          });

          test("ignores invalid numbers", () => {
            enterStr("hello,world,foo,bar");
            expect(wrapper.state("calcResult")).toBe(0);
          });

          test("adds valid numbers and ignores invalid numbers", () => {
            enterStr("hello,5,world,a2,10");
            expect(wrapper.state("calcResult")).toBe(15);
          });
        });
      });

      describe("and allows negative numbers", () => {
        test("does not ignore negative numbers", () => {
          markCheckBox(true);
          enterStr("-2,-2,-2");
          expect(wrapper.state("calcResult")).toBe(-6);
        });

        test("adds multiple positive and negative numbers", () => {
          markCheckBox(true);
          enterStr("80,-20,-10,5");
          expect(wrapper.state("calcResult")).toBe(55);
        });
      });

      describe("and custom upperBound", () => {
        test("ignores numbers greater than upperbound", () => {
          markCheckBox(false);
          enterUpperBound("100");
          enterStr("10,20,30,200,400,500");
          expect(wrapper.state("calcResult")).toBe(60);
        });
      });
    });

    describe("with newline delimiter", () => {
      describe("and valid numbers", () => {
        test("adds multiple numbers", () => {
          let numArr = [10, 2, 10, 10, 10];
          enterStr(numArr.join("\n"));
          expect(wrapper.state("calcResult")).toBe(42);

          numArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
          enterStr(numArr.join("\n"));
          expect(wrapper.state("calcResult")).toBe(78);
        });

        test("adds negative numbers", () => {
          markCheckBox(true);
          let numArr = [-2, -2, -2];
          enterStr(numArr.join("\n"));
          expect(wrapper.state("calcResult")).toBe(-6);
        });

        test("adds positive and negative numbers", () => {
          markCheckBox(true);
          let numArr = [80, -20, -10, 5];
          enterStr(numArr.join("\n"));
          expect(wrapper.state("calcResult")).toBe(55);
        });
      });

      describe("and valid and invalid numbers", () => {
        test("ignores invalid numbers", () => {
          let numArr = ["hello", "world", "foo", "bar"];
          enterStr(numArr.join("\n"));
          expect(wrapper.state("calcResult")).toBe(0);
        });

        test("adds valid numbers and ignores invalid numbers", () => {
          let numArr = ["hello", 5, "world", "a2", 5];
          enterStr(numArr.join("\n"));
          expect(wrapper.state("calcResult")).toBe(10);
        });
      });
    });

    describe("with mixed delimiters", () => {
      describe("and valid numbers", () => {
        test("adds multiple numbers", () => {
          enterStr("17,6\n6,\n10");
          expect(wrapper.state("calcResult")).toBe(39);
        });

        test("adds positive and negative numbers", () => {
          markCheckBox(true);
          enterStr("-10,6\n-6,\n20");
          expect(wrapper.state("calcResult")).toBe(10);
        });
      });

      describe("and valid and invalid numbers", () => {
        test("adds valid numbers and ignores invalid numbers", () => {
          enterStr("hello,world\n2,5\n7\nfoobar");
          expect(wrapper.state("calcResult")).toBe(14);
        });
      });
    });

    describe("with custom single character delimiter", () => {
      /* Allow Negative numbers for each test and reset UpperBound*/
      beforeAll(() => {
        resetOptions();
        markCheckBox(true);
        enterUpperBound("1000");
      });

      describe("with no special character", () => {
        test("adds valid numbers", () => {
          enterStr("//;\n1;2;3;4;5;-10");
          expect(wrapper.state("calcResult")).toBe(5);
        });

        test("adds valid numbers and ignores invalid numbers", () => {
          enterStr("//;\n7;9;hello;4;,5,world;-1");
          expect(wrapper.state("calcResult")).toBe(19);
        });
      });

      describe("with special character", () => {
        test("adds valid numbers", () => {
          enterStr("//.\n1.2.3.4.5.-10.,100,100");
          expect(wrapper.state("calcResult")).toBe(5);
        });

        test("adds valid numbers and ignores invalid numbers", () => {
          enterStr("//[\n10[2,3[10\n5");
          expect(wrapper.state("calcResult")).toBe(25);
        });
      });
    });

    describe("with custom multi-character delimiter", () => {
      /* Allow Negative numbers for each test and reset upperBound*/
      beforeAll(() => {
        resetOptions();
        markCheckBox(true);
        enterUpperBound("1000");
        makeSelection("add");
      });

      describe("with no special characters", () => {
        test("adds valid numbers", () => {
          enterStr("//[***]\n11***22***33");
          expect(wrapper.state("calcResult")).toBe(66);
        });

        test("adds valid numbers and ignores invalid numbers", () => {
          enterStr("//[and]\n-37and100and4,000and19");
          expect(wrapper.state("calcResult")).toBe(82);
        });
      });

      describe("with special character(s)", () => {
        test("adds valid numbers", () => {
          enterStr("//[\\[\\]]\n1[]87[]66\n-34");
          expect(wrapper.state("calcResult")).toBe(120);
        });

        test("adds valid numbers and ignores invalid numbers", () => {
          enterStr("//[(|)]\n111\n222(|)ignore(|)LoremIpsumDimSum(|)333");
          expect(wrapper.state("calcResult")).toBe(666);
        });
      });
    });

    describe("with multiple custom delimiters", () => {
      /* Allow Negative numbers for each test and reset upperBound*/
      beforeAll(() => {
        resetOptions();
        markCheckBox(true);
        enterUpperBound("1000");
        makeSelection("add");
      });

      describe("with no special characters", () => {
        test("adds valid numbers", () => {
          enterStr("//[***][,,,]\n11***22,,,33");
          expect(wrapper.state("calcResult")).toBe(66);
        });

        test("adds valid numbers and ignores invalid numbers", () => {
          enterStr("//[hello][world]\n-37hello100world,000world19");
          expect(wrapper.state("calcResult")).toBe(82);
        });
      });

      describe("with special character(s)", () => {
        test("adds valid numbers", () => {
          enterStr("//[\\[\\]][|]\n1[]87|66\n-34");
          expect(wrapper.state("calcResult")).toBe(120);
        });

        test("adds valid numbers and ignores invalid numbers", () => {
          enterStr("//[(|)][\\\\]\n111\n222(|)ignore\\LoremIpsumDimSum(|)333");
          expect(wrapper.state("calcResult")).toBe(666);
        });
      });
    });
  });

  /* SUBTRACTION Test Suite */
  describe("subtraction", () => {
    beforeAll(() => {
      resetOptions();
      makeSelection("subtract");
    });

    describe("with comma delimiter,", () => {
      describe("with default options,", () => {
        describe("and valid numbers", () => {
          test("subtracts one number", () => {
            enterStr("10");
            expect(wrapper.state("calcResult")).toBe(10);
          });

          test("subtracts multiple numbers", () => {
            enterStr("100,-20,-30");
            expect(wrapper.state("calcResult")).toBe(150);
          });
        });
        describe("and valid and invalid numbers", () => {
          test("subtracts empty string", () => {
            enterStr("");
            expect(wrapper.state("calcResult")).toBe(0);
          });

          test("ignores invalid numbers", () => {
            enterStr("hello,world,foo,bar");
            expect(wrapper.state("calcResult")).toBe(0);
          });

          test("subtracts valid numbers and ignores invalid numbers", () => {
            enterStr("hello,5,world,a2,10");
            expect(wrapper.state("calcResult")).toBe(-15);
          });
        });
      });

      describe("and allows negative numbers", () => {
        test("does not ignore negative numbers", () => {
          markCheckBox(true);
          enterStr("0,-2,-2,-2");
          expect(wrapper.state("calcResult")).toBe(6);
        });

        test("subtracts multiple positive and negative numbers", () => {
          markCheckBox(true);
          enterStr("80,-20,-10,5");
          expect(wrapper.state("calcResult")).toBe(105);
        });
      });

      describe("and custom upperBound", () => {
        test("ignores numbers greater than upperbound", () => {
          markCheckBox(false);
          enterUpperBound("100");
          enterStr("500,400,300,10,7");
          expect(wrapper.state("calcResult")).toBe(-17);
        });
      });
    });

    describe("with custom delimiters", () => {
      /* Allow Negative numbers for each test and reset UpperBound*/
      beforeAll(() => {
        resetOptions();
        makeSelection("subtract");
        markCheckBox(true);
        enterUpperBound("1000");
      });

      test("subtracts valid numbers", () => {
        enterStr("//;\n50;8");
        expect(wrapper.state("calcResult")).toBe(42);
      });

      test("subtracts valid numbers and ignores invalid numbers", () => {
        enterStr("//[and]\n1000and500and-166and2000");
        expect(wrapper.state("calcResult")).toBe(666);
      });

      test("subtracts valid numbers", () => {
        enterStr("//[***][...]\n-11***-22...-33");
        expect(wrapper.state("calcResult")).toBe(44);
      });
    });
  });

  /* MULTIPLICATOIN Test Suite */
  describe("multiplication", () => {
    beforeAll(() => {
      resetOptions();
      makeSelection("multiply");
    });

    describe("with comma delimiter,", () => {
      describe("with default options,", () => {
        describe("and valid numbers", () => {
          test("multiplies one number", () => {
            enterStr("10");
            expect(wrapper.state("calcResult")).toBe(10);
          });

          test("multiplies multiple numbers", () => {
            enterStr("2,3,4");
            expect(wrapper.state("calcResult")).toBe(24);
          });
        });
        describe("and valid and invalid numbers", () => {
          test("multiplies empty string", () => {
            enterStr("");
            expect(wrapper.state("calcResult")).toBe(0);
          });

          test("ignores invalid numbers", () => {
            enterStr("hello,world,foo,bar");
            expect(wrapper.state("calcResult")).toBe(0);
          });

          test("multiplies valid numbers and ignores invalid numbers", () => {
            enterStr("hello,5,world,a2,10");
            expect(wrapper.state("calcResult")).toBe(0);
          });
        });
      });

      describe("and allows negative numbers", () => {
        test("does not ignore negative numbers", () => {
          markCheckBox(true);
          enterStr("-2,-2,-2");
          expect(wrapper.state("calcResult")).toBe(-8);
        });

        test("multiplies multiple positive and negative numbers", () => {
          markCheckBox(true);
          enterStr("10,-10,1,-1");
          expect(wrapper.state("calcResult")).toBe(100);
        });
      });

      describe("and custom upperBound", () => {
        test("ignores numbers greater than upperbound", () => {
          markCheckBox(false);
          enterUpperBound("100");
          enterStr("500,400,300,10,7");
          expect(wrapper.state("calcResult")).toBe(0);
        });
      });
    });

    describe("with custom delimiters", () => {
      /* Allow Negative numbers for each test and reset UpperBound*/
      beforeAll(() => {
        resetOptions();
        makeSelection("multiply");
        markCheckBox(true);
        enterUpperBound("1000");
      });

      test("multiplies valid numbers", () => {
        enterStr("//;\n50;8");
        expect(wrapper.state("calcResult")).toBe(400);
      });

      test("multiplies valid numbers and ignores invalid numbers", () => {
        enterStr("//[and]\n5000and500and166");
        expect(wrapper.state("calcResult")).toEqual(0);
      });

      test("multiplies valid numbers", () => {
        enterStr("//[***][...]\n-11***-22...-33");
        expect(wrapper.state("calcResult")).toBe(-7986);
      });
    });
  });

  /* DIVISION Test Suite */
  describe("division", () => {
    beforeAll(() => {
      resetOptions();
      makeSelection("divide");
    });

    describe("with comma delimiter,", () => {
      describe("with default options,", () => {
        describe("and valid numbers", () => {
          test("divides one number", () => {
            enterStr("10");
            expect(wrapper.state("calcResult")).toBe(10);
          });

          test("divides multiple numbers", () => {
            enterStr("100,10");
            expect(wrapper.state("calcResult")).toBe(10);
          });
        });
        describe("and valid and invalid numbers", () => {
          test("divides empty string", () => {
            enterStr("");
            expect(wrapper.state("calcResult")).toBe(0);
          });

          test("ignores invalid numbers", () => {
            enterStr("hello,1");
            expect(wrapper.state("calcResult")).toBe(0);
          });
        });
      });

      describe("and allows negative numbers", () => {
        test("does not ignore negative numbers", () => {
          markCheckBox(true);
          enterStr("15,-5");
          expect(wrapper.state("calcResult")).toBe(-3);
        });

        test("divides multiple positive and negative numbers", () => {
          markCheckBox(true);
          enterStr("1000,-100,10,-1");
          expect(wrapper.state("calcResult")).toBe(1);
        });
      });

      describe("and custom upperBound", () => {
        test("ignores numbers greater than upperbound", () => {
          markCheckBox(false);
          enterUpperBound("100");
          enterStr("500,10,7");
          expect(wrapper.state("calcResult")).toBe(0);
        });
      });
    });

    describe("with custom delimiters", () => {
      /* Allow Negative numbers for each test and reset UpperBound*/
      beforeAll(() => {
        resetOptions();
        markCheckBox(true);
        enterUpperBound("1000");
      });

      test("divides valid numbers", () => {
        enterStr("//;\n50;10");
        expect(wrapper.state("calcResult")).toBe(5);
      });

      test("divides valid numbers and ignores invalid numbers", () => {
        enterStr("//[and]\n5000and500and166");
        expect(wrapper.state("calcResult")).toEqual(0);
      });

      test("divides valid numbers", () => {
        enterStr("//[***][...]\n-400***-20...10");
        expect(wrapper.state("calcResult")).toBe(2);
      });
    });
  });
});
