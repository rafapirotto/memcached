const { STORED, NOT_STORED } = require('../domain/constants/messages');
const { EMPTY_SPACE, NO_REPLY, COMMANDS } = require('../domain/constants/index');

class Storage {
  constructor() {
    this.storage = [];
    this.cas = 0;
  }

  customFind(key) {
    const NOT_FOUND_INDEX = -1;
    const index = this.storage.findIndex((obj) => key === obj.key);
    if (index === NOT_FOUND_INDEX) return { found: false };
    return { found: true, index };
  }

  find(key) {
    const { found, index } = this.customFind(key);
    if (found) return this.storage[index];
    return false;
  }

  nextCas() {
    return this.cas++;
  }

  save(obj) {
    obj.cas = this.nextCas();
    this.storage.push(obj);
  }

  update(obj, objIndex) {
    obj.cas = this.storage[objIndex].cas;
    this.storage[objIndex] = obj;
  }

  set(
    expectedData, value,
  ) {
    const {
      key, noreply,
    } = expectedData;
    const { found, index } = this.customFind(key);
    expectedData.value = value;
    if (found) this.update(expectedData, index);
    else this.save(expectedData);
    if (noreply === NO_REPLY) return EMPTY_SPACE;
    return STORED;
  }

  add(
    expectedData, value,
  ) {
    const { found } = this.customFind(expectedData.key);
    expectedData.value = value;
    if (found) return NOT_STORED;
    this.save(expectedData);
    return STORED;
  }

  execute(expectedData, value) {
    const { command } = expectedData;
    switch (command) {
      case COMMANDS.set:
        return this.set(expectedData, value);
      case COMMANDS.add:
        return this.add(expectedData, value);
      default:
        return null;
    }
  }
}

module.exports = new Storage();
