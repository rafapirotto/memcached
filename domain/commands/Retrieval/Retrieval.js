const { EMPTY_SPACE } = require('../../constants/index');
const { END } = require('../../constants/messages');

class Retrieval {
  constructor(options, store) {
    this.options = options;
    this.store = store;
  }

  execute() {
    const keys = this.options;
    return { response: this.getOutput(keys) };
  }

  getOutput(keys, toStringCallback) {
    let response = EMPTY_SPACE;
    keys.forEach((key) => {
      const storeObj = this.store.find(key);
      if (storeObj) response += toStringCallback(storeObj);
    });
    response += END;
    return response;
  }
}

module.exports = Retrieval;
