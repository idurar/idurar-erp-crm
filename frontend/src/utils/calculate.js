import currency from 'currency.js';

const calculate = {
  add: (firstValue, secondValue) => {
    return currency(firstValue).add(secondValue);
  },
  sub: (firstValue, secondValue) => {
    return currency(firstValue).subtract(secondValue);
  },
  multiply: (firstValue, secondValue) => {
    return currency(firstValue).multiply(secondValue);
  },
  divide: (firstValue, secondValue) => {
    return currency(firstValue).divide(secondValue);
  },
};

export default calculate;
