const {
  WrongByteLengthError,
} = require('../../errors/badDataChunk');

class DataBlock {
  // expectedData contains an instance of the expected command with its corresponding options
  constructor(data, store, expectedData) {
    this.store = store;
    this.data = data;
    this.expectedData = expectedData;
  }

  validateDataBlock() {
    // byteLength -> returns the number of bytes required to store a string
    const optionsAsObject = this.expectedData.convertDataArrayToObject();
    this.expectedData.setOptions(optionsAsObject);
    const { bytes, noreply } = this.expectedData.getOptions();
    if (Buffer.byteLength(this.data) !== bytes) throw new WrongByteLengthError(noreply);
  }

  execute() {
    this.validateDataBlock();
    const optionsWithValue = { ...this.expectedData.options, value: this.data };
    this.expectedData.setOptions(optionsWithValue);
    const response = this.expectedData.doStoreOperation(this.store);
    return { response };
  }
}

module.exports = DataBlock;
