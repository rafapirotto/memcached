const {
  DataExpectedError, WrongByteLengthError,
} = require('../../errors/badDataChunk');

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

  convertDataToObject(expectedData) {
    const [commandInstance, key, flags, exptime, bytes, noreply] = expectedData;
    return {
      commandInstance, key, flags, exptime, bytes, noreply,
    };
  }

  execute() {
    this.validateDataBlock();
    const objToExecute = { ...this.expectedData, value: this.data };
    // TODO: fix
    const response = objToExecute.commandInstance.doStorageOperation(objToExecute);
    return { response };
  }
}

module.exports = DataBlock;
