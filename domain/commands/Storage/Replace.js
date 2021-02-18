const { COMMANDS } = require('../../constants/index');
const Storage = require('./Storage');

class Replace extends Storage {
  constructor(options) {
    super(options);
  }

  execute() {
    return super.execute(COMMANDS.replace);
  }
}

module.exports = Replace;
