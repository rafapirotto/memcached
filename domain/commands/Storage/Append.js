const Storage = require('./Storage');
const { STORED, NOT_STORED } = require('../../constants/messages');
const { EMPTY_SPACE, NO_REPLY } = require('../../constants/index');

class Append extends Storage {
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
    const obj = super.getStorage().find(objToExecute.key);
    if (obj) {
      obj.bytes += objToExecute.bytes;
      obj.value += objToExecute.value;
      super.getStorage().update(obj);
    }
    if (noreply === NO_REPLY) return EMPTY_SPACE;
    return obj ? STORED : NOT_STORED;
  }
}

module.exports = Append;
