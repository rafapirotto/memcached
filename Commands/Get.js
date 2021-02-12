const { TERMINATOR } = require("../utils");

class Get {
    constructor(options, storage) {
        this.options = options;
        this.storage = storage;
    }

    execute() {
        const keysToRetrieve = this.options;
        let retrievedKeys = [];
        keysToRetrieve.forEach((keyToRetrieve) => {
            const retrievedKey = this.storage.find(keyToRetrieve);
            if (retrievedKey) retrievedKeys.push(retrievedKey);
        });
        return this.getOutput(retrievedKeys);
    }

    getOutput(retrievedKeys) {
        let response = "";
        retrievedKeys.forEach((retrievedKey) => {
            const { key, flags, bytes, value } = retrievedKey;
            response += `VALUE ${key} ${flags.toString()} ${bytes.toString()}${TERMINATOR}${value}${TERMINATOR}`;
        });
        response += "END";
        return response;
    }
}

module.exports = Get;
