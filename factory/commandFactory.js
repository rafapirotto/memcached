const {
  Get, Gets, Set, DataBlock, Add, Replace, Prepend, Append,
} = require('../domain/commands/index');
const {
  DataExpectedError,
} = require('../domain/errors/badDataChunk');
const { NoOptionsError, InvalidCommandError } = require('../domain/errors/syntax');

const { COMMANDS } = require('../domain/constants');

const isCommand = (command) => {
  let exists = false;
  Object.entries(COMMANDS).forEach((elem) => {
    const value = elem[1];
    if (value === command) exists = true;
  });
  return exists;
};

const validateRequestSyntax = (command, options, expectedData) => {
  const noreply = expectedData ? expectedData[5] : undefined;
  if (isCommand(command) && options.length === 0) throw new NoOptionsError();
  if (isCommand(command) && expectedData) throw new DataExpectedError(noreply);
  if (!isCommand(command) && !expectedData) throw new InvalidCommandError();
};

const create = (parsedRequest, expectedData, store) => {
  const command = parsedRequest[0];
  const options = parsedRequest.slice(1);
  validateRequestSyntax(command, options, expectedData);
  switch (command) {
    case COMMANDS.get:
      return new Get(options, store);
    case COMMANDS.gets:
      return new Gets(options, store);
    case COMMANDS.set:
      return new Set(options, store);
    case COMMANDS.add:
      return new Add(options, store);
    case COMMANDS.replace:
      return new Replace(options, store);
    case COMMANDS.append:
      return new Append(options, store);
    case COMMANDS.prepend:
      return new Prepend(options, store);
    default:
      return new DataBlock(command, store, expectedData);
  }
};

module.exports = { create };
