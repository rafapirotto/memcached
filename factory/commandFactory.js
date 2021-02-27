const {
  Get, Gets, Set, DataBlock, Add, Replace, Prepend, Append, Cas,
} = require('../domain/commands/index');
const { DataExpectedError } = require('../domain/errors/badDataChunk');
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
      return new Set(options);
    case COMMANDS.add:
      return new Add(options);
    case COMMANDS.replace:
      return new Replace(options);
    case COMMANDS.append:
      return new Append(options);
    case COMMANDS.prepend:
      return new Prepend(options);
    case COMMANDS.cas:
      return new Cas(options);
    default:
      // 'command' here means the data sent
      return new DataBlock(command, store, expectedData);
  }
};

module.exports = { create };
