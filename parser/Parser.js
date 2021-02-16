/* eslint-disable class-methods-use-this */
const { parseArgsStringToArgv } = require('string-argv');

const { TERMINATOR } = require('../domain/constants');

class Parser {
  constructor() {}

  parse(request) {
    // request comes inside a Buffer class
    // therefore it is converted to string
    let requestAsString = request.toString('utf-8');
    // new line gets removed
    // eslint-disable-next-line prefer-destructuring
    requestAsString = requestAsString.split(TERMINATOR)[0];
    // data gets transformed to array like ["command","opt1",...,"optn"]
    const parsedRequest = parseArgsStringToArgv(requestAsString);
    return parsedRequest;
  }
}
module.exports = Parser;
