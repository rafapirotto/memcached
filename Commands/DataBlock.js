const { WrongByteLength, BadCommandLineFormatError } = require("../errors");

class DataBlock {
    constructor(data, storage) {
        this.storage = storage;
        this.data = data;
    }

    execute(expectedData) {
        const [command, key, flags, exptime, bytes, noreply] = expectedData;
        let parsedBytes = 0;
        try {
            parsedBytes = parseInt(bytes, 10);
        } catch (error) {
            console.log(error);
            console.log(error.message);
            throw new BadCommandLineFormatError();
        }
        if (Buffer.byteLength(this.data) !== parsedBytes)
            throw new WrongByteLength();
        //byteLength -> returns the number of bytes required to store a string
        //TODO: switch with different commands: add, replace,etc
        this.storage.set({ key, value: this.data, flags, exptime, bytes });
        if (noreply === "noreply") return { response: "" };
        return { response: this.getOutput() };
    }

    getOutput() {
        return "STORED";
    }
}

module.exports = DataBlock;
