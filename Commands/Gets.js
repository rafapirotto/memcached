/* eslint-disable class-methods-use-this */
const { TERMINATOR } = require('../utils');

class Gets {
  constructor(options, storage) {
    this.options = options;
    this.storage = storage;
  }

  execute() {
    const keys = this.options;
    return { response: this.getOutput(keys) };
  }

  getOutput(keys) {
    let response = '';
    keys.forEach((key) => {
      const storageObj = this.storage.find(key);
      if (storageObj) response += this.toString(storageObj);
    });
    response += 'END';
    return response;
  }

  toString(obj) {
    const {
      key, flags, bytes, value, cas,
    } = obj;
    return `VALUE ${key} ${flags.toString()} ${bytes.toString()} ${cas}${TERMINATOR}${value}${TERMINATOR}`;
  }
}

module.exports = Gets;
