import React, { Component } from "react";
import cx from "classnames";
import {
  convertNums,
  getNegNums,
  getFormatData,
  regExpEscapeAll,
  createDelimPattern
} from "../../utils/utils";
import { OPERATIONS, JOIN_CHARS } from "./constants";
import "./Calculator.css";

class Calculator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      operation: "add",
      altDelim: "\n",
      upperBound: 1000,
      upperBoundStr: "1000",
      allowNegNums: false,
      calcResult: 0,
      numArr: [],
      calcStr: "",
      negNumArr: []
    };

    this.handleUpperBoundChange = this.handleUpperBoundChange.bind(this);
    this.handleCalcStrChange = this.handleCalcStrChange.bind(this);
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  calculateResult(obj) {
    const { calcStr, altDelim, upperBound, operation } = obj;
    const defaultDelim = ",";

    const { delim: customDelim, numStr } = getFormatData(calcStr);
    const delim = customDelim ? customDelim : defaultDelim;
    const delimPattern = Array.isArray(delim)
      ? createDelimPattern([...delim, altDelim])
      : new RegExp(`${regExpEscapeAll(delim)}|${altDelim}`);

    let numArr = numStr.trim().split(delimPattern);
    numArr = convertNums(numArr, upperBound);

    const reducer = OPERATIONS[operation];

    let calcResult = numArr.length === 1 ? numArr[0] : numArr.reduce(reducer);

    return {
      ...obj,
      calcResult: calcResult,
      negNumArr: getNegNums(numArr),
      numArr: numArr
    };
  }

  handleCheckBoxChange(event) {
    const isChecked = event.target.checked;

    this.setState(
      this.calculateResult({ ...this.state, allowNegNums: isChecked })
    );
  }

  handleSelectChange(event) {
    this.setState(
      this.calculateResult({ ...this.state, operation: event.target.value })
    );
  }

  handleUpperBoundChange(event) {
    const newStr = event.target.value;
    const newUpperBound = newStr === "" ? false : Number(newStr);

    /* Invalid upper bound makes no changes */
    if (!newUpperBound && newStr != "") {
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

  createEqDisp() {
    const { numArr, allowNegNums, operation } = this.state;
    const dispNumArr = numArr.map(num =>
      allowNegNums && num < 0 ? `(${num})` : num
    );
    return dispNumArr.join(JOIN_CHARS[operation]);
  }

  render() {
    const {
      calcStr,
      calcResult,
      numArr,
      negNumArr,
      upperBound,
      upperBoundStr,
      allowNegNums
    } = this.state;

    let upperBoundError = Number.isNaN(upperBound);
    let hasNegNumError = !allowNegNums && negNumArr.length;

    let hasError = upperBoundError || hasNegNumError;

    let resultDiv = (
      <div className="result">
        <p>Result: {calcResult}</p>
        {numArr.length ? (
          <p>
            {this.createEqDisp()} = {calcResult}
          </p>
        ) : (
          ""
        )}
      </div>
    );

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

            <div>
              <label>
                Operation:{" "}
                <select
                  id="operation-selection"
                  type="select"
                  value={this.operation}
                  onChange={this.handleSelectChange}
                >
                  <option value="add">addition</option>
                  <option value="subtract">subtraction</option>
                  <option value="multiply">multiplication</option>
                  <option value="divide">division</option>
                </select>
              </label>
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
