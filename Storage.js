class Storage {
    constructor() {
        // this.storage = [];
        this.cas = 0;
        this.storage = [
            {
                key: "test1",
                bytes: 2,
                value: "25",
                flags: 0,
                exptime: 900,
                cas: 1,
            },
            {
                key: "test2",
                bytes: 2,
                value: "24",
                flags: 0,
                exptime: 900,
                cas: 2,
            },
            {
                key: "test3",
                bytes: 2,
                value: "23",
                flags: 0,
                exptime: 900,
                cas: 3,
            },
        ];
    }

    find(key) {
        return this.storage.find((obj) => key === obj.key);
    }

    nextCas() {
        return this.cas++;
    }

    set({ key, value, flags, exptime, bytes }) {
        const objIndex = this.storage.findIndex((obj) => obj.key === key);
        const objToInsert = {
            key,
            value,
            flags,
            exptime,
            bytes,
        };
        if (objIndex !== -1) {
            objToInsert.cas = this.storage[objIndex].cas;
            this.storage[objIndex] = objToInsert;
        } else {
            objToInsert.cas = this.nextCas();
            this.storage.push(objToInsert);
        }
    }
}

module.exports = new Storage();
