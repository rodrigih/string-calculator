import React, { Component } from "react";
import cx from "classnames";
import { convertNums, getNegNums } from "../../utils/utils";
import "./Calculator.css";

class Calculator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      delim: ",",
      altDelim: "\n",
      sum: 0,
      calcString: "",
      hasError: false,
      negNumArr: []
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const { delim, altDelim } = this.state;

    const delimPattern = new RegExp(`${delim}|${altDelim}`);

    let newStr = event.target.value;
    let numArr = newStr.trim().split(delimPattern);
    numArr = convertNums(numArr);

    let sum = numArr.reduce((acc, curr) => acc + curr, 0);

    this.setState({
      sum: sum,
      calcString: newStr,
      negNumArr: getNegNums(numArr)
    });
  }

  render() {
    const { calcString, sum, negNumArr } = this.state;

    let resultDiv = <div className="result"> Sum: {sum} </div>;

    let errorDiv = (
      <div className="flex-column error">
        <b>Error:</b>
        Remove the following negative numbers:
        <div>{negNumArr.join()}</div>
      </div>
    );

    return (
      <div className="calculator flex">
        <div>
          <h2>Enter calculation string</h2>
          <form>
            <textarea
              className={cx({
                "calculator-textarea-error": negNumArr.length,
                "calculator-textarea": !negNumArr.length
              })}
              value={calcString}
              placeholder="Enter calculation"
              onChange={this.handleChange}
            />
          </form>
        </div>
        <div>
          <h2>Result</h2>
          {negNumArr.length ? errorDiv : resultDiv}
          resultDiv
        </div>
      </div>
    );
  }
}

export default Calculator;
