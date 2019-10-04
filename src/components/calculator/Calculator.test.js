import React from 'react';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Calculator from './Calculator';

Enzyme.configure({adapter: new Adapter()});

const wrapper = shallow(<Calculator />);

describe('Test Addition', () => {
  test('Sum of empty string', () => {
    expect(wrapper.state('sum')).toBe(0);
  });

  test('One valid number', () => {
    wrapper.find('textarea').simulate('change', {
      target: {value: '20'},
    });
    expect(wrapper.state('sum')).toBe(20);
  });

  test('Sum of two valid numbers', () => {
    wrapper.find('textarea').simulate('change', {
      target: {value: '1,5000'},
    });

    expect(wrapper.state('sum')).toBe(5001);
  });

  test('Sum of two valid numbers with extra elements', () => {
    wrapper.find('textarea').simulate('change', {
      target: {value: '10,2,10,10,10'},
    });

    expect(wrapper.state('sum')).toBe(12);
  });

  test('Sum of one valid and one invalid number', () => {
    wrapper.find('textarea').simulate('change', {
      target: {value: 'foobar,20'},
    });

    expect(wrapper.state('sum')).toBe(20);
  });

  test('Sum of one valid and one invalid number with extra elements', () => {
    wrapper.find('textarea').simulate('change', {
      target: {value: 'foobar,20,20,2'},
    });

    expect(wrapper.state('sum')).toBe(20);
  });

  test('Sum of two invalid numbers', () => {
    wrapper.find('textarea').simulate('change', {
      target: {value: 'hello,world'},
    });

    expect(wrapper.state('sum')).toBe(0);
  });

  test('Sum of two invalid numbers with extra elements', () => {
    wrapper.find('textarea').simulate('change', {
      target: {value: 'hello,world,foo,bar,baz'},
    });

    expect(wrapper.state('sum')).toBe(0);
  });

  test('Negative number and positive number', () => {
    wrapper.find('textarea').simulate('change', {
      target: {value: '-1,2'},
    });

    expect(wrapper.state('sum')).toBe(1);
  });

  test('Negative numbers only', () => {
    wrapper.find('textarea').simulate('change', {
      target: {value: '-1,-5000'},
    });

    expect(wrapper.state('sum')).toBe(-5001);
  });

  test('Valid numbers with trailing whitespace', () => {
    wrapper.find('textarea').simulate('change', {
      target: {value: '-1 , -5000,50\n'},
    });

    expect(wrapper.state('sum')).toBe(0);
  });
});
