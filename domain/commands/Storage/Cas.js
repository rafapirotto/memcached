const Storage = require('./Storage');
const {
  STORED, NOT_FOUND, EXISTS,
} = require('../../constants/messages');
const { EMPTY_SPACE, NO_REPLY } = require('../../constants/index');
const { WrongArgumentNumberError } = require('../../errors/syntax');
const {
  BadCommandLineFormatError,
} = require('../../errors/badCommandLine');

class Cas extends Storage {
  constructor(options, store) {
    super(options, store);
  }

  execute() {
    return super.execute();
  }

  validateNumberOptions() {
    const exptimeIndex = 2;
    for (let index = 1; index < 5; index++) {
      const option = this.options[index];
      const optionAsInt = Number(option);
      const notValid = Number.isNaN(optionAsInt)
      || this.isFloat(option)
      || (optionAsInt < 0 && exptimeIndex !== index);
      if (notValid) throw new BadCommandLineFormatError();
      this.options[index] = optionAsInt;
    }
  }

  validateOptionsLength() {
    if (this.options.length !== 5) throw new WrongArgumentNumberError();
  }

  doStoreOperation(objToExecute) {
    const {
      noreply,
    } = objToExecute;
    const retrievedObj = super.getStore().find(objToExecute.key);
    if (noreply === NO_REPLY) return EMPTY_SPACE;
    if (!retrievedObj) return NOT_FOUND;
    if (objToExecute.cas === retrievedObj.cas) {
      super.getStore().update(objToExecute);
      return STORED;
    }
    return EXISTS;
  }

  convertDataToObject(expectedData) {
    const [commandInstance, key, flags, exptime, bytes, cas, noreply] = expectedData;
    return {
      commandInstance, key, flags, exptime, bytes, cas, noreply,
    };
  }
}

module.exports = Cas;
