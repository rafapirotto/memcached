const {
  WrongByteLengthError,
} = require('../../errors/badDataChunk');

class DataBlock {
  constructor(data, store, expectedCommand) {
    this.store = store;
    this.data = data;
    this.expectedCommand = expectedCommand;
  }

  validateDataBlock() {
    // byteLength -> returns the number of bytes required to store a string
    const optionsObject = this.expectedCommand.convertDataArrayToObject();
    this.expectedCommand.setOptions(optionsObject);
    const { bytes, noreply } = this.expectedCommand.getOptions();
    if (Buffer.byteLength(this.data) !== bytes) throw new WrongByteLengthError(noreply);
  }

  execute() {
    this.validateDataBlock();
    const optionsWithValue = { ...this.expectedCommand.options, value: this.data };
    this.expectedCommand.setOptions(optionsWithValue);
    const response = this.expectedCommand.doStoreOperation(this.store);
    return { response };
  }
}

module.exports = DataBlock;
