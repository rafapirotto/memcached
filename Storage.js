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

    set({ key, value, flags, exptime, bytes }) {
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
    }
}

module.exports = new Storage();
