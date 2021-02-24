const ClientError = require('./ClientError');
const { SERVER_ERROR } = require('../constants/messages');

const handleErrors = (callback, errorCallback) => {
  try {
    callback();
  } catch (error) {
    const isClientError = error instanceof ClientError;
    const message = isClientError ? error.message : SERVER_ERROR;
    errorCallback(message);
  }
};

module.exports = { handleErrors };
