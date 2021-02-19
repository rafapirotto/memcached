const { parse } = require('../parser/parser');
const { create } = require('../factory/commandFactory');

const build = (connection, storage) => {
  const parsedRequest = parse(connection.data);
  const command = create(
    parsedRequest,
    connection.getExpectedData(),
    storage,
  );
  const result = command.execute();
  connection.setExpectedData(result.data);
  connection.sendResponse(result.response);
};

module.exports = { build };
