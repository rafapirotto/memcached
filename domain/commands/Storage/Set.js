const Storage = require('./Storage');
const { STORED } = require('../../constants/messages');
const { EMPTY_SPACE, NO_REPLY } = require('../../constants/index');

class Set extends Storage {
  constructor(options) {
    super(options);
  }

  execute() {
    return super.execute();
  }

  doStoreOperation(store) {
    const { key, noreply } = this.options;
    const { found } = store.customFind(key);
    if (found) store.update(this.options);
    else store.insert(this.options);
    if (noreply === NO_REPLY) return EMPTY_SPACE;
    return STORED;
  }
}

module.exports = Set;
