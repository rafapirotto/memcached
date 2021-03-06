const Storage = require('./Storage');
const { STORED, NOT_STORED } = require('../../constants/messages');
const { EMPTY_SPACE, NO_REPLY } = require('../../constants/index');

class Prepend extends Storage {
  doStoreOperation(store) {
    const {
      noreply, key, bytes, value,
    } = this.options;
    const obj = store.find(key);
    if (obj) {
      obj.bytes += bytes;
      obj.value = value + obj.value;
      store.update(obj);
    }
    if (noreply === NO_REPLY) return EMPTY_SPACE;
    return obj ? STORED : NOT_STORED;
  }
}

module.exports = Prepend;
