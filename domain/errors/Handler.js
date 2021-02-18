const {
  BadCommandLineError,
  BadDataChunkError,
  SyntaxError,
} = require('./index');

const {
  ERROR_MESSAGE,
  BAD_DATA_CHUNK,
  BAD_COMMAND_LINE_FORMAT,
  SERVER_ERROR,
} = require('../constants/messages');

const handleErrors = (callback, errorCallback) => {
  try {
    callback();
  } catch (error) {
    switch (true) {
      case error instanceof SyntaxError:
        errorCallback(ERROR_MESSAGE);
        break;
      case error instanceof BadDataChunkError:
        errorCallback(BAD_DATA_CHUNK);
        break;
      case error instanceof BadCommandLineError:
        errorCallback(BAD_COMMAND_LINE_FORMAT);
        break;
      default:
        errorCallback(SERVER_ERROR);
        break;
    }
  }
};

module.exports = { handleErrors };
