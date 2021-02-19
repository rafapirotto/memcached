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
}

module.exports = new Storage();
