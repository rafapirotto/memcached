const {
  WrongByteLengthError,
  BadCommandLineFormatError,
  DataExpectedError,
} = require('../errors');
const { STORED } = require('../constants/messages');
const { EMPTY_SPACE, NO_REPLY } = require('../constants/index');

class DataBlock {
  constructor(data, storage, expectedData) {
    this.storage = storage;
    this.data = data;
    this.expectedData = expectedData;
  }

  execute() {
    if (!this.expectedData) throw new DataExpectedError();
    const [command, key, flags, exptime, bytes, noreply] = this.expectedData;
    // TODO: remove console.log
    console.log(command);
    let parsedBytes = 0;
    try {
      parsedBytes = parseInt(bytes, 10);
    } catch (error) {
      throw new BadCommandLineFormatError();
    }
    if (Buffer.byteLength(this.data) !== parsedBytes) {
      throw new WrongByteLengthError();
    }
    // byteLength -> returns the number of bytes required to store a string
    // TODO: switch with different commands: add, replace,etc
    this.storage.set({
      key,
      value: this.data,
      flags,
      exptime,
      bytes,
    });
    if (noreply === NO_REPLY) return { response: EMPTY_SPACE };
    return { response: this.getOutput() };
  }

  getOutput() {
    return STORED;
  }
}

module.exports = DataBlock;
