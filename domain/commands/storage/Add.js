const Storage = require('./Storage');
const { STORED, NOT_STORED } = require('../../constants/messages');
const { EMPTY_SPACE, NO_REPLY } = require('../../constants/index');

class Add extends Storage {
  doStoreOperation(store) {
    const { noreply, key } = this.options;
    const { found } = store.customFind(key);
    if (!found) store.insert(this.options);
    if (noreply === NO_REPLY) return EMPTY_SPACE;
    return found ? NOT_STORED : STORED;
  }
}

module.exports = Add;
