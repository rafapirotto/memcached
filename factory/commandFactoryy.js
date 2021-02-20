const {
  Get, Gets, Set, DataBlock, Add, Replace, Prepend, Append,
} = require('../domain/commands/index');
const {
  DataExpectedError,
} = require('../domain/errors/badDataChunk');
const { NoOptionsError, InvalidCommandError } = require('../domain/errors/syntax');

const { COMMANDS } = require('../domain/constants');

const commandExists = (command) => {
  let exists = false;
  Object.entries(COMMANDS).forEach((elem) => {
    const value = elem[1];
    if (value === command) exists = true;
  });
  return exists;
};

const validateRequestSyntax = (command, options, expectedData) => {
  if (commandExists(command) && options.length === 0) throw new NoOptionsError();
  if (commandExists(command) && expectedData) throw new DataExpectedError();
  if (!commandExists(command) && !expectedData) throw new InvalidCommandError();
};

const create = (parsedRequest, expectedData, storage) => {
  const command = parsedRequest[0];
  const options = parsedRequest.slice(1);
  validateRequestSyntax(command, options, expectedData);
  switch (command) {
    case COMMANDS.get:
      return new Get(options, storage);
    case COMMANDS.gets:
      return new Gets(options, storage);
    case COMMANDS.set:
      return new Set(options, storage);
    case COMMANDS.add:
      return new Add(options, storage);
    case COMMANDS.replace:
      return new Replace(options, storage);
    case COMMANDS.append:
      return new Append(options, storage);
    case COMMANDS.prepend:
      return new Prepend(options, storage);
    default:
      return new DataBlock(command, storage, expectedData);
  }
};

module.exports = { create };
