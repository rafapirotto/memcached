const Storage = require('./Storage');
const { STORED, NOT_STORED } = require('../../constants/messages');
const { EMPTY_SPACE, NO_REPLY } = require('../../constants/index');

class Add extends Storage {
  constructor(options, store) {
    super(options, store);
  }

  execute() {
    return super.execute(this);
  }

  doStoreOperation(objToExecute) {
    const {
      noreply,
    } = objToExecute;
    const { found } = super.getStore().customFind(objToExecute.key);
    if (!found) super.getStore().save(objToExecute);
    if (noreply === NO_REPLY) return EMPTY_SPACE;
    return found ? NOT_STORED : STORED;
  }
}

module.exports = Add;
