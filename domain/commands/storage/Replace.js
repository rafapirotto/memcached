const Storage = require('./Storage');
const { STORED, NOT_STORED } = require('../../constants/messages');
const { EMPTY_SPACE, NO_REPLY } = require('../../constants/index');

class Replace extends Storage {
  doStoreOperation(store) {
    const { noreply, key } = this.options;
    const { found } = store.customFind(key);
    if (found) store.update(this.options);
    if (noreply === NO_REPLY) return EMPTY_SPACE;
    return found ? STORED : NOT_STORED;
  }
}

module.exports = Replace;
