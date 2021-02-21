class Storage {
  constructor() {
    this.initialize();
  }

  initialize() {
    this.store = [];
    this.cas = 0;
  }

  customFind(key) {
    const NOT_FOUND_INDEX = -1;
    const index = this.store.findIndex((obj) => key === obj.key);
    if (index === NOT_FOUND_INDEX) return { found: false };
    return { found: true, index };
  }

  find(key) {
    const { found, index } = this.customFind(key);
    if (found) return this.store[index];
    return false;
  }

  nextCas() {
    return this.cas++;
  }

  save(obj) {
    delete obj.commandInstance;
    obj.cas = this.nextCas();
    if (obj.exptime >= 0) this.store.push(obj);
  }

  update(obj) {
    const { index } = this.customFind(obj.key);
    obj.cas = this.store[index].cas;
    this.store[index] = obj;
  }
}

module.exports = new Storage();
