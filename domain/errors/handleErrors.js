const {
  BadCommandLineError,
  BadDataChunkError,
  SyntaxError,
} = require('./index');
const { SERVER_ERROR } = require('../constants/messages');

const handleErrors = (callback, errorCallback) => {
  try {
    callback();
  } catch (error) {
    const isClientError = error instanceof SyntaxError
     || error instanceof BadDataChunkError
     || error instanceof BadCommandLineError;
    const message = isClientError ? error.message : SERVER_ERROR;
    errorCallback(message);
  }
};

module.exports = { handleErrors };
