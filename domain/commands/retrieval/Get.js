const { TERMINATOR } = require('../../constants/index');
const Retrieval = require('./Retrieval');

class Get extends Retrieval {
  toString(obj) {
    const {
      key, flags, bytes, value,
    } = obj;
    return `VALUE ${key} ${flags.toString()} ${bytes.toString()}${TERMINATOR}${value}${TERMINATOR}`;
  }
}

module.exports = Get;
