const {
  Get, Gets, Set, DataBlock,
} = require('../domain/commands/index');
const {
  NoOptionsError, InvalidCommandError, DataExpectedError,
} = require('../domain/errors');
const storage = require('../storage/Storage');
const { COMMANDS } = require('../domain/constants');

const commandExists = (command) => {
  let exists = false;
  Object.entries(COMMANDS).forEach((elem) => {
    const value = elem[1];
    if (value === command) exists = true;
  });
  return exists;
};

const create = (parsedRequest, expectedData) => {
  const command = parsedRequest[0];
  const options = parsedRequest.slice(1);
  if (commandExists(command) && options.length === 0) { throw new NoOptionsError(); }
  if (commandExists(command) && expectedData) { throw new DataExpectedError(); }
  if (!commandExists(command) && !expectedData) { throw new InvalidCommandError(); }
  switch (command) {
    case COMMANDS.get:
      return new Get(options, storage);
    case COMMANDS.gets:
      return new Gets(options, storage);
    case COMMANDS.set:
      return new Set(options);
    default:
      return new DataBlock(command, storage, expectedData);
  }
};

module.exports = { create };
