const { parse } = require('../parser/parser');
const { create } = require('../factory/commandFactory');

const build = (connection, store) => {
  const parsedRequest = parse(connection.data);
  const command = create(
    parsedRequest,
    connection.getExpectedData(),
    store,
  );
  const { response, data } = command.execute();
  connection.setExpectedData(data);
  connection.sendResponse(response);
};

module.exports = { build };
