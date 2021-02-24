const Storage = require('./Storage');
const { STORED, NOT_STORED } = require('../../constants/messages');
const { EMPTY_SPACE, NO_REPLY } = require('../../constants/index');

class Replace extends Storage {
  constructor(options, store) {
    super(options, store);
  }

  execute() {
    return super.execute();
  }

  doStoreOperation(objToExecute) {
    const { noreply } = objToExecute;
    const { found } = super.getStore().customFind(objToExecute.key);
    if (found) super.getStore().update(objToExecute);
    if (noreply === NO_REPLY) return EMPTY_SPACE;
    return found ? STORED : NOT_STORED;
  }
}

module.exports = Replace;
