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

  convertToNumber(string) {
    return Number(string);
  }

  isInvalidOption(index) {
    const option = this.options[index];
    const optionAsInt = this.convertToNumber(option);
    const exptimeIndex = 2;
    return Number.isNaN(optionAsInt)
      || this.isFloat(option)
      || (optionAsInt < 0 && exptimeIndex !== index);
  }

  validateNumberOptions() {
    for (let index = 1; index < 5; index++) {
      const isInvalid = this.isInvalidOption(index);
      if (isInvalid) throw new BadCommandLineFormatError();
      const option = this.options[index];
      this.options[index] = this.convertToNumber(option);
    }
  }

  optionsLengthIsInvalid() {
    const optionNumber = this.options.length;
    return optionNumber < 5 || optionNumber > 6;
  }

  validateOptionsLength() {
    if (this.optionsLengthIsInvalid()) throw new WrongArgumentNumberError();
  }

  doStoreOperation(objToExecute) {
    const { noreply } = objToExecute;
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
