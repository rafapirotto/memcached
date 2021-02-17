const {
  WrongByteLengthError,
  DataExpectedError,
} = require('../errors');
const { STORED } = require('../constants/messages');
const { EMPTY_SPACE, NO_REPLY, COMMANDS } = require('../constants/index');

class DataBlock {
  constructor(data, storage, expectedData) {
    this.storage = storage;
    this.data = data;
    this.expectedData = this.convertDataToObject(expectedData);
  }

  validateDataBlock() {
    if (!this.expectedData) throw new DataExpectedError();
    // byteLength -> returns the number of bytes required to store a string
    if (Buffer.byteLength(this.data) !== this.expectedData.bytes) throw new WrongByteLengthError();
  }

  set() {
    this.storage.set(this.expectedData, this.data);
  }

  convertDataToObject(expectedData) {
    const [command, key, flags, exptime, bytes, noreply] = expectedData;
    return {
      command, key, flags, exptime, bytes, noreply,
    };
  }

  handleCommandAction() {
    this.validateDataBlock();
    const { command } = this.expectedData;
    switch (command) {
      case COMMANDS.set:
        this.set();
        break;
      default:
        break;
    }
  }

  getOutput() {
    const { noreply } = this.expectedData;
    if (noreply === NO_REPLY) return { response: EMPTY_SPACE };
    return { response: STORED };
  }

  execute() {
    this.handleCommandAction();
    return this.getOutput();
  }
}

module.exports = DataBlock;
