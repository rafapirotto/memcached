const { WrongArgumentNumberError, BadCommandLineFormatError } = require('../errors');
const { COMMANDS, EMPTY_SPACE } = require('../constants/index');

class Add {
  constructor(options) {
    this.options = options;
  }

  validateNumberOptions() {
    for (let index = 1; index < 4; index++) {
      const option = this.options[index];
      const optionAsInt = parseInt(option, 10);
      // TODO: validate negative exptime
      const notValid = Number.isNaN(optionAsInt) || this.isFloat(optionAsInt) || optionAsInt < 0;
      if (notValid) throw new BadCommandLineFormatError();
      this.options[index] = optionAsInt;
    }
  }

  execute() {
    const options = this.options.length;
    if (options > 5 || options < 4) throw new WrongArgumentNumberError();
    this.validateNumberOptions();
    this.options.splice(0, 0, COMMANDS.add);
    return { response: this.getOutput(), data: this.options };
  }

  getOutput() {
    return EMPTY_SPACE;
  }
}

module.exports = Add;
