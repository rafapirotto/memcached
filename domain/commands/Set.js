const { WrongArgumentNumberError } = require('../errors');
const { COMMANDS, EMPTY_SPACE } = require('../constants/index');

class Set {
  constructor(options) {
    this.options = options;
  }

  execute() {
    const options = this.options.length;
    if (options > 5 || options < 4) throw new WrongArgumentNumberError();
    this.options.splice(0, 0, COMMANDS.set);
    return { response: this.getOutput(), data: this.options };
  }

  getOutput() {
    return EMPTY_SPACE;
  }
}

module.exports = Set;
