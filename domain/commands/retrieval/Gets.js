const { TERMINATOR } = require('../../constants/index');
const Retrieval = require('./Retrieval');

class Gets extends Retrieval {
  toString(obj) {
    const {
      key, flags, bytes, value, cas,
    } = obj;
    return `VALUE ${key} ${flags.toString()} ${bytes.toString()} ${cas}${TERMINATOR}${value}${TERMINATOR}`;
  }

  getOutput(keys) {
    return super.getOutput(keys, this.toString);
  }
}

module.exports = Gets;
