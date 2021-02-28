const { TERMINATOR } = require('./index');

const ERROR_MESSAGE = 'ERROR';
const BAD_DATA_CHUNK = `CLIENT_ERROR bad data chunk${TERMINATOR}${ERROR_MESSAGE}`;
const BAD_COMMAND_LINE_FORMAT = 'CLIENT_ERROR bad command line format';
const END = 'END';
const STORED = 'STORED';
const NOT_STORED = 'NOT_STORED';
const SERVER_ERROR = 'SERVER_ERROR';
const EXISTS = 'EXISTS';
const NOT_FOUND = 'NOT_FOUND';

module.exports = {
  ERROR_MESSAGE,
  BAD_DATA_CHUNK,
  BAD_COMMAND_LINE_FORMAT,
  END,
  STORED,
  NOT_STORED,
  SERVER_ERROR,
  EXISTS,
  NOT_FOUND,
};
