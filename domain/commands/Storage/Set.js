const Storage = require('./Storage');
const { STORED } = require('../../constants/messages');
const { EMPTY_SPACE, NO_REPLY } = require('../../constants/index');

class Set extends Storage {
  constructor(options, store) {
    super(options, store);
  }

  execute() {
    return super.execute();
  }

  doStoreOperation(objToExecute) {
    const { key, noreply } = objToExecute;
    const { found } = super.getStore().customFind(key);
    if (found) super.getStore().update(objToExecute);
    else super.getStore().insert(objToExecute);
    if (noreply === NO_REPLY) return EMPTY_SPACE;
    return STORED;
  }
}

module.exports = Set;
