const Storage = require('./Storage');
const { STORED, NOT_STORED } = require('../../constants/messages');
const { EMPTY_SPACE, NO_REPLY } = require('../../constants/index');

class Replace extends Storage {
  constructor(options, storage) {
    super(options, storage);
  }

  execute() {
    return super.execute(this);
  }

  doStorageOperation(objToExecute) {
    const {
      noreply,
    } = objToExecute;
    const { found, index } = super.getStorage().customFind(objToExecute.key);
    if (found) super.getStorage().update(objToExecute, index);
    if (noreply === NO_REPLY) return EMPTY_SPACE;
    return found ? STORED : NOT_STORED;
  }
}

module.exports = Replace;
