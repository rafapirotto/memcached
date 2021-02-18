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
    objToExecute,
  ) {
    const {
      key, noreply,
    } = objToExecute;
    const { found, index } = this.customFind(key);
    if (found) this.update(objToExecute, index);
    else this.save(objToExecute);
    if (noreply === NO_REPLY) return EMPTY_SPACE;
    return STORED;
  }

  add(
    objToExecute,
  ) {
    const {
      noreply,
    } = objToExecute;
    const { found } = this.customFind(objToExecute.key);
    if (!found) this.save(objToExecute);
    if (noreply === NO_REPLY) return EMPTY_SPACE;
    return found ? NOT_STORED : STORED;
  }

  replace(
    objToExecute,
  ) {
    const {
      noreply,
    } = objToExecute;
    const { found, index } = this.customFind(objToExecute.key);
    if (found) this.update(objToExecute, index);
    if (noreply === NO_REPLY) return EMPTY_SPACE;
    return found ? STORED : NOT_STORED;
  }

  execute(objToExecute) {
    const { command } = objToExecute;
    switch (command) {
      case COMMANDS.set:
        return this.set(objToExecute);
      case COMMANDS.add:
        return this.add(objToExecute);
      case COMMANDS.replace:
        return this.replace(objToExecute);
      default:
        return null;
    }
  }
}

module.exports = new Storage();
