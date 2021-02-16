const { TERMINATOR } = require('../domain/constants/index');

class Connection {
  constructor(socket, data) {
    this.socket = socket;
    this.data = data;
  }

  setExpectedData(newData) {
    this.socket.expectedData = newData;
  }

  getExpectedData() {
    return this.socket.expectedData;
  }

  sendResponse(text) {
    if (text.length > 0) this.socket.write(`${text}${TERMINATOR}`);
    else this.socket.write(text);
  }
}

module.exports = Connection;
