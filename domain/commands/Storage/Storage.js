const {
  BadCommandLineFormatError,
} = require('../../errors/badCommandLine');
const { WrongArgumentNumberError } = require('../../errors/syntax');
const { EMPTY_SPACE } = require('../../constants/index');

class Storage {
  constructor(options) {
    this.options = options;
  }

  isFloat(numberAsString) {
    return numberAsString.indexOf('.') !== -1;
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

  optionsLengthIsInvalid() {
    const optionNumber = this.options.length;
    return optionNumber < 4 || optionNumber > 5;
  }

  validateOptionsLength() {
    if (this.optionsLengthIsInvalid()) throw new WrongArgumentNumberError();
  }

  execute() {
    this.validateOptionsLength();
    this.validateNumberOptions();
    return { response: this.getOutput(), data: this };
  }

  convertDataArrayToObject() {
    const [key, flags, exptime, bytes, noreply] = this.options;
    return {
      key, flags, exptime, bytes, noreply,
    };
  }
}

module.exports = Storage;
