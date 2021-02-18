const { EMPTY_SPACE } = require('../../constants/index');
const { END } = require('../../constants/messages');

class Retrieval {
  constructor(options, storage) {
    this.options = options;
    this.storage = storage;
  }

  execute() {
    const keys = this.options;
    return { response: this.getOutput(keys) };
  }

  getOutput(keys, toStringCallback) {
    let response = EMPTY_SPACE;
    keys.forEach((key) => {
      const storageObj = this.storage.find(key);
      if (storageObj) response += toStringCallback(storageObj);
    });
    response += END;
    return response;
  }
}

module.exports = Retrieval;
