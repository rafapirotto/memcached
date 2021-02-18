const handleErrors = (callback, errorCallback) => {
  try {
    callback();
  } catch (error) {
    errorCallback(error.message);
  }
};

module.exports = { handleErrors };
