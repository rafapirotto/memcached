class Store {
  constructor() {
    this.initialize();
  }

  initialize() {
    this.store = [];
    this.cas = 1;
  }

  delete(index) {
    this.store.splice(index, 1);
  }

  customFind(key) {
    const NOT_FOUND_INDEX = -1;
    const index = this.store.findIndex((obj) => key === obj.key);
    if (index === NOT_FOUND_INDEX) return { found: false };
    return { found: true, index };
  }

  keyHasExpired(obj) {
    const { exptime, lastUpdated } = obj;
    if (exptime === 0) return false;
    const now = new Date();
    const diff = (now.getTime() - lastUpdated.getTime()) / 1000;
    return (diff >= exptime);
  }

  find(key) {
    const { found, index } = this.customFind(key);
    if (found) {
      const obj = this.store[index];
      if (this.keyHasExpired(obj)) {
        this.delete(index);
        return false;
      }
      return obj;
    }
    return false;
  }

  deleteUnusedProps(obj) {
    const objCopy = { ...obj };
    delete objCopy.noreply;
    delete objCopy.commandInstance;
    return objCopy;
  }

  nextCas() {
    return this.cas++;
  }

  insert(obj) {
    // we use this syntax to avoid side effects
    let objCopy = { ...obj };
    objCopy = this.deleteUnusedProps(objCopy);
    objCopy.cas = this.nextCas();
    objCopy.lastUpdated = new Date();
    if (obj.exptime >= 0) this.store.push(objCopy);
  }

  update(obj) {
    let objCopy = { ...obj };
    const { index } = this.customFind(obj.key);
    objCopy = this.deleteUnusedProps(objCopy);
    objCopy.cas = this.nextCas();
    objCopy.lastUpdated = new Date();
    this.store[index] = objCopy;
  }
}

module.exports = new Store();
