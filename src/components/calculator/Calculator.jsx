import React, { Component } from "react";
import cx from "classnames";
import {
  convertNums,
  getNegNums,
  getFormatData,
  regExpEscape
} from "../../utils/utils";
import "./Calculator.css";

class Calculator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      delim: ",",
      altDelim: "\n",
      upperBound: 1000,
      upperBoundStr: "1000",
      allowNegNums: false,
      sum: 0,
      calcStr: "",
      negNumArr: []
    };

    this.handleUpperBoundChange = this.handleUpperBoundChange.bind(this);
    this.handleCalcStrChange = this.handleCalcStrChange.bind(this);
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
  }

  calculateResult(obj) {
    const { calcStr, delim: defaultDelim, altDelim, upperBound } = obj;

    const { delim: customDelim, numStr } = getFormatData(calcStr);
    const delim = customDelim ? regExpEscape(customDelim) : defaultDelim;
    const delimPattern = new RegExp(`${delim}|${altDelim}`);

    let numArr = numStr.trim().split(delimPattern);
    numArr = convertNums(numArr, upperBound);
    let sum = numArr.reduce((acc, curr) => acc + curr, 0);

    return { ...obj, sum: sum, negNumArr: getNegNums(numArr) };
  }

  handleCheckBoxChange(event) {
    const isChecked = event.target.checked;

    this.setState(
      this.calculateResult({ ...this.state, allowNegNums: isChecked })
    );
  }

  handleUpperBoundChange(event) {
    const newStr = event.target.value;
    const newUpperBound = Number(newStr);

    /* Invalid upper bound makes no changes */
    if (!newUpperBound) {
      this.setState({
        upperBound: newUpperBound,
        upperBoundStr: newStr
      });
      return;
    }

    this.setState(
      this.calculateResult({
        ...this.state,
        upperBound: newUpperBound,
        upperBoundStr: newStr
      })
    );
  }

  handleCalcStrChange(event) {
    const newStr = event.target.value;

    this.setState(this.calculateResult({ ...this.state, calcStr: newStr }));
  }

  render() {
    const {
      calcStr,
      sum,
      negNumArr,
      upperBound,
      upperBoundStr,
      allowNegNums
    } = this.state;

    let upperBoundError = Number.isNaN(upperBound);
    let hasNegNumError = !allowNegNums && negNumArr.length;

    let hasError = upperBoundError || hasNegNumError;

    let resultDiv = <div className="result"> Sum: {sum} </div>;

    let negNumErrorDiv = (
      <div className="flex-column error">
        <b>Error:</b>
        Remove the following negative numbers:
        <div>{negNumArr.join()}</div>
      </div>
    );

    let upperBoundErrorDiv = (
      <div className="flex-column error">
        <b>Error:</b>
        Enter a valid number for the upper bound.
      </div>
    );

    let errorDiv = upperBoundError ? upperBoundErrorDiv : negNumErrorDiv;

    return (
      <div className="calculator flex">
        <div>
          <h2>Enter calculation string</h2>
          <form onSubmit={e => e.preventDefault()}>
            <div>
              <label htmlFor="upperBound">Upper Bound: </label>
              <input
                type="text"
                className={cx({
                  "calculator-input": !upperBoundError,
                  "calculator-input-error": upperBoundError
                })}
                id="upperBound"
                name="upperBound"
                value={upperBoundStr}
                onChange={this.handleUpperBoundChange}
              />
            </div>

            <div>
              <label htmlFor="allow-negatives">Allow negatives: </label>
              <input
                type="checkbox"
                name="allow-negatives"
                id="allow-negatives"
                value="allow-negatives"
                checked={allowNegNums}
                onChange={this.handleCheckBoxChange}
              />
            </div>

            <textarea
              className={cx({
                "calculator-textarea-error": hasNegNumError,
                "calculator-textarea": !hasNegNumError
              })}
              value={calcStr}
              placeholder="Enter calculation"
              onChange={this.handleCalcStrChange}
            />
          </form>
        </div>

        <div>
          <h2>Result</h2>
          {hasError ? errorDiv : resultDiv}
        </div>
      </div>
    );
  }
}

export default Calculator;
