import React, {Component} from 'react';
import {convertNums} from '../../utils/utils';
import './Calculator.css';

class Calculator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      delim: ',',
      altDelim: "\n",
      sum: 0,
      calcString: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const {delim,altDelim} = this.state;

    const delimPattern = new RegExp(`${delim}|${altDelim}`);

    let newStr = event.target.value;
    let numArr = newStr.trim().split(delimPattern);
    numArr = convertNums(numArr);

    let sum = numArr.reduce((acc, curr) => acc + curr, 0);

    this.setState({
      sum: sum,
      calcString: newStr,
    });
  }

  render() {
    const {calcString, sum} = this.state;

    return (
      <div className="calculator flex">
        <div>
          <h2>Enter calculation string</h2>
          <form>
            <textarea
              value={calcString}
              placeholder="Enter calculation"
              onChange={this.handleChange}
            />
          </form>
        </div>
        <div>
          <h2>Result</h2>
          <div className="result"> Sum: {sum} </div>
        </div>
      </div>
    );
  }
}

export default Calculator;
