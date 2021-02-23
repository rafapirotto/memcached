const {
  WrongByteLengthError,
} = require('../../errors/badDataChunk');

class DataBlock {
  constructor(data, store, expectedData) {
    this.store = store;
    this.data = data;
    const commandInstance = expectedData[0];
    this.expectedData = commandInstance.convertDataToObject(expectedData);
  }

  validateDataBlock() {
    // byteLength -> returns the number of bytes required to store a string
    const { bytes, noreply } = this.expectedData;
    if (Buffer.byteLength(this.data) !== bytes) {
      throw new WrongByteLengthError(noreply);
    }
  }

  execute() {
    this.validateDataBlock();
    const objToExecute = { ...this.expectedData, value: this.data };
    const { commandInstance } = objToExecute;
    const response = commandInstance.doStoreOperation(objToExecute);
    return { response };
  }
}

module.exports = DataBlock;
