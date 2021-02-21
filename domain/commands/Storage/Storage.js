const {
  BadCommandLineFormatError,
} = require('../../errors/badCommandLine');
const { WrongArgumentNumberError } = require('../../errors/syntax');
const { EMPTY_SPACE } = require('../../constants/index');

class Storage {
  constructor(options, storage) {
    this.options = options;
    this.storage = storage;
  }

  isFloat(numberAsString) {
    return numberAsString.indexOf('.') !== -1;
  }

  getStorage() {
    return this.storage;
  }

  validateNumberOptions() {
    const exptimeIndex = 2;
    for (let index = 1; index < 4; index++) {
      const option = this.options[index];
      const optionAsInt = Number(option);
      // TODO: validate negative exptime
      const notValid = Number.isNaN(optionAsInt)
      || this.isFloat(option)
      || (optionAsInt < 0 && exptimeIndex !== index);
      if (notValid) throw new BadCommandLineFormatError();
      this.options[index] = optionAsInt;
    }
  }

  getOutput() {
    return EMPTY_SPACE;
  }

  execute(commandInstance) {
    const options = this.options.length;
    if (options > 5 || options < 4) throw new WrongArgumentNumberError();
    this.validateNumberOptions();
    this.options.splice(0, 0, commandInstance);
    return { response: this.getOutput(), data: this.options };
  }
}

module.exports = Storage;
