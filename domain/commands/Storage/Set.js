const { COMMANDS } = require('../../constants/index');
const Storage = require('./Storage');

class Set extends Storage {
  constructor(options) {
    super(options);
  }

  execute() {
    return super.execute(COMMANDS.set);
  }
}

module.exports = Set;
