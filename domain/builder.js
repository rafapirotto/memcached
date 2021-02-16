/* eslint-disable no-param-reassign */
const Parser = require('../parser/Parser');
const CommandFactory = require('../factory/CommandFactory');

const parser = new Parser();
const commandFactory = new CommandFactory();

const build = (connection) => {
  const parsedRequest = parser.parse(connection.data);
  const command = commandFactory.create(
    parsedRequest,
    connection.getExpectedData(),
  );
  const result = command.execute();
  connection.setExpectedData(result.data);
  connection.sendResponse(result.response);
};

module.exports = { build };
