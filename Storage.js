class Storage {
    constructor() {
        // this.storage = [];
        this.storage = [
            { key: "test1", bytes: 2, value: "25", flags: 0, exptime: 900 },
            { key: "test2", bytes: 2, value: "24", flags: 0, exptime: 900 },
            { key: "test3", bytes: 2, value: "23", flags: 0, exptime: 900 },
        ];
    }
    find(key) {
        return this.storage.find((obj) => key === obj.key);
    }
}

module.exports = new Storage();
