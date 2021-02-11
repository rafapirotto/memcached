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
        if (obj)
            response = `VALUE ${keyToRetrieve} ${obj.flags.toString()} ${obj.bytes.toString()}${TERMINATOR}${
                obj.value
            }${TERMINATOR}END`;
        return response;
    }
}

module.exports = Get;
