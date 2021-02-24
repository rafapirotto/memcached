const {
  BadCommandLineFormatError,
} = require('../../errors/badCommandLine');
const { WrongArgumentNumberError } = require('../../errors/syntax');
const { EMPTY_SPACE } = require('../../constants/index');

class Storage {
  constructor(options, store) {
    this.options = options;
    this.store = store;
  }

  isFloat(numberAsString) {
    return numberAsString.indexOf('.') !== -1;
  }

  getStore() {
    return this.store;
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
    for (let index = 1; index < 4; index++) {
      const option = this.options[index];
      const optionAsInt = Number(option);
      const isInvalid = this.isInvalidOption(index);
      if (isInvalid) throw new BadCommandLineFormatError();
      this.options[index] = optionAsInt;
    }
  }

  getOutput() {
    return EMPTY_SPACE;
  }

  validateOptionsLength() {
    const optionNumber = this.options.length;
    if (optionNumber < 4 || optionNumber > 5) throw new WrongArgumentNumberError();
  }

  execute() {
    this.validateOptionsLength();
    this.validateNumberOptions();
    this.options.splice(0, 0, this);
    return { response: this.getOutput(), data: this.options };
  }

  convertDataToObject(expectedData) {
    const [commandInstance, key, flags, exptime, bytes, noreply] = expectedData;
    return {
      commandInstance, key, flags, exptime, bytes, noreply,
    };
  }
}

module.exports = Storage;
