const { STORED, NOT_STORED } = require('../domain/constants/messages');
const { EMPTY_SPACE, NO_REPLY, COMMANDS } = require('../domain/constants/index');

class Storage {
  constructor() {
    this.storage = [];
    this.cas = 0;
  }

  find(key) {
    return this.storage.find((obj) => key === obj.key);
  }

  nextCas() {
    return this.cas++;
  }

  set(
    expectedData, value,
  ) {
    const {
      key, flags, exptime, bytes, noreply,
    } = expectedData;
    const objIndex = this.storage.findIndex((obj) => obj.key === key);
    const found = objIndex !== -1;
    const objToInsert = {
      key,
      value,
      flags,
      exptime,
      bytes,
    };
    if (found) {
      objToInsert.cas = this.storage[objIndex].cas;
      this.storage[objIndex] = objToInsert;
    } else {
      objToInsert.cas = this.nextCas();
      this.storage.push(objToInsert);
    }
    if (noreply === NO_REPLY) return EMPTY_SPACE;
    return STORED;
  }

  add(
    expectedData, value,
  ) {
    const {
      key, flags, exptime, bytes,
    } = expectedData;
    const objIndex = this.storage.findIndex((obj) => obj.key === key);
    const found = objIndex !== -1;
    const objToInsert = {
      key,
      value,
      flags,
      exptime,
      bytes,
    };
    if (found) return NOT_STORED;
    objToInsert.cas = this.nextCas();
    this.storage.push(objToInsert);
    return STORED;
  }

  execute(expectedData, data) {
    const { command } = expectedData;
    switch (command) {
      case COMMANDS.set:
        return this.set(expectedData, data);
      case COMMANDS.add:
        return this.add(expectedData, data);
      default:
        return null;
    }
  }
}

module.exports = new Storage();
