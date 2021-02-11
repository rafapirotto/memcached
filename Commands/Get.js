const { TERMINATOR } = require("../utils");

class Get {
    constructor(options) {
        this.options = options;
    }

    execute(storage) {
        const keyToRetrieve = this.options[0];
        const retrievedData = storage.find(({ key }) => key === keyToRetrieve);
        return this.getOutput(retrievedData);
    }

    getOutput(obj) {
        let response = "END";
        if (obj) {
            const { key, flags, bytes, value } = obj;
            response = `VALUE ${key} ${flags.toString()} ${bytes.toString()}${TERMINATOR}${value}${TERMINATOR}END`;
        }
        return response;
    }
}

module.exports = Get;
