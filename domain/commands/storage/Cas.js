const Storage = require('./Storage');
const {
  STORED, NOT_FOUND, EXISTS,
} = require('../../constants/messages');
const { EMPTY_SPACE, NO_REPLY } = require('../../constants/index');

class Cas extends Storage {
  constructor(options) {
    super(options);
    this.minOptionLength = 5;
    this.maxOptionLength = 6;
  }

  doStoreOperation(store) {
    const { noreply, key, cas } = this.options;
    const retrievedObj = store.find(key);
    if (noreply === NO_REPLY) return EMPTY_SPACE;
    if (!retrievedObj) return NOT_FOUND;
    if (cas === retrievedObj.cas) {
      store.update(this.options);
      return STORED;
    }
    return EXISTS;
  }

  convertDataArrayToObject() {
    const [key, flags, exptime, bytes, cas, noreply] = this.options;
    return {
      key, flags, exptime, bytes, cas, noreply,
    };
  }
}

module.exports = Cas;
