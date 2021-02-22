const Storage = require('./Storage');
const { STORED, NOT_STORED } = require('../../constants/messages');
const { EMPTY_SPACE, NO_REPLY } = require('../../constants/index');

class Prepend extends Storage {
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
    const obj = super.getStore().find(objToExecute.key);
    if (obj) {
      obj.bytes += objToExecute.bytes;
      obj.value = objToExecute.value + obj.value;
      super.getStore().update(obj);
    }
    if (noreply === NO_REPLY) return EMPTY_SPACE;
    return obj ? STORED : NOT_STORED;
  }
}

module.exports = Prepend;
