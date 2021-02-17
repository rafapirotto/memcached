const { TERMINATOR } = require('.');

const ERROR_MESSAGE = 'ERROR';
const BAD_DATA_CHUNK = `CLIENT_ERROR bad data chunk${TERMINATOR}${ERROR_MESSAGE}`;
const BAD_COMMAND_LINE_FORMAT = 'CLIENT_ERROR bad command line format';
const END = 'END';
const STORED = 'STORED';

module.exports = {
  ERROR_MESSAGE, BAD_DATA_CHUNK, BAD_COMMAND_LINE_FORMAT, END, STORED,
};
