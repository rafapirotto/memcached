const {
  BadCommandLineFormatError,
} = require('../../errors/badCommandLine');
const { WrongArgumentNumberError } = require('../../errors/syntax');
const { EMPTY_SPACE } = require('../../constants/index');

class Storage {
  constructor(options) {
    this.setOptions(options);
    this.minOptionLength = 4;
    this.maxOptionLength = 5;
  }

  setOptions(options) {
    this.options = options;
  }

  getOptions() {
    return this.options;
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
    const min = this.minOptionLength;
    for (let index = 1; index < min; index++) {
      const isInvalid = this.isInvalidOption(index);
      if (isInvalid) throw new BadCommandLineFormatError();
      const option = this.options[index];
      this.options[index] = this.convertToNumber(option);
    }
  }

  getOutput() {
    return EMPTY_SPACE;
  }

  optionsLengthIsInvalid() {
    const optionNumber = this.options.length;
    const min = this.minOptionLength;
    const max = this.maxOptionLength;
    return optionNumber < min || optionNumber > max;
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
