const Storage = require('./Storage');
const { STORED } = require('../../constants/messages');
const { EMPTY_SPACE, NO_REPLY } = require('../../constants/index');

class Set extends Storage {
  constructor(options, storage) {
    super(options, storage);
  }

  execute() {
    return super.execute(this);
  }

  doStorageOperation(objToExecute) {
    const {
      key, noreply,
    } = objToExecute;
    const { found } = super.getStorage().customFind(key);
    if (found) super.getStorage().update(objToExecute);
    else super.getStorage().save(objToExecute);
    if (noreply === NO_REPLY) return EMPTY_SPACE;
    return STORED;
  }
}

module.exports = Set;
