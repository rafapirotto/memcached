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
    const diffInSeconds = (now.getTime() - lastUpdated.getTime()) / 1000;
    return (diffInSeconds >= exptime);
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
    // this syntax is used to avoid side effects
    const objCopy = { ...obj };
    delete objCopy.noreply;
    return objCopy;
  }

  nextCas() {
    return this.cas++;
  }

  insert(obj) {
    const newObj = this.deleteUnusedProps(obj);
    newObj.cas = this.nextCas();
    newObj.lastUpdated = new Date();
    if (obj.exptime >= 0) this.store.push(newObj);
  }

  update(obj) {
    const { index } = this.customFind(obj.key);
    if (obj.exptime >= 0) {
      const objCopy = { ...obj };
      objCopy.cas = this.nextCas();
      objCopy.lastUpdated = new Date();
      this.store[index] = objCopy;
    } else this.delete(index);
  }
}

module.exports = new Store();
