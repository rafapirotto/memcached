const { COMMANDS } = require('../../constants/index');
const Storage = require('./Storage');

class Add extends Storage {
  constructor(options) {
    super(options);
  }

  execute() {
    return super.execute(COMMANDS.add);
  }
}

module.exports = Add;
