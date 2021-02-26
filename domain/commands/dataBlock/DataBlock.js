const {
  WrongByteLengthError,
} = require('../../errors/badDataChunk');

class DataBlock {
  constructor(data, store, expectedData) {
    this.store = store;
    this.data = data;
    this.expectedData = expectedData;
  }

  validateDataBlock() {
    // byteLength -> returns the number of bytes required to store a string
    this.expectedData.options = this.expectedData.convertDataArrayToObject();
    const optionsAsObject = this.expectedData.options;
    const { bytes, noreply } = optionsAsObject;
    if (Buffer.byteLength(this.data) !== bytes) throw new WrongByteLengthError(noreply);
  }

  execute() {
    this.validateDataBlock();
    this.expectedData.options = { ...this.expectedData.options, value: this.data };
    const response = this.expectedData.doStoreOperation(this.store);
    return { response };
  }
}

module.exports = DataBlock;
