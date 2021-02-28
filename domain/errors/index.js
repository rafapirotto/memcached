const BadCommandLineError = require('./badCommandLine/BadCommandLineError');
const BadDataChunkError = require('./badDataChunk/BadDataChunkError');
const SyntaxError = require('./syntax/SyntaxError');

module.exports = {
  BadCommandLineError,
  BadDataChunkError,
  SyntaxError,
};
