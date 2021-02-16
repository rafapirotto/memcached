const {
  InvalidCommandError,
  NoOptionsError,
  WrongArgumentNumberError,
  DataExpectedError,
  WrongByteLengthError,
  BadCommandLineFormatError,
} = require('./index');

const {
  ERROR_MESSAGE,
  BAD_DATA_CHUNK,
  BAD_COMMAND_LINE_FORMAT,
} = require('../constants/messages');

const handleErrors = (callback, errorCallback) => {
  try {
    callback();
  } catch (error) {
    if (
      error instanceof InvalidCommandError
              || error instanceof NoOptionsError
              || error instanceof WrongArgumentNumberError
    ) {
      errorCallback(ERROR_MESSAGE);
    } else if (
      error instanceof DataExpectedError
              || error instanceof WrongByteLengthError
    ) {
      errorCallback(BAD_DATA_CHUNK);
    } else if (error instanceof BadCommandLineFormatError) {
      errorCallback(BAD_COMMAND_LINE_FORMAT);
    }
  }
};

module.exports = { handleErrors };
