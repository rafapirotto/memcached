class BadCommandLineFormatError extends Error {
  constructor(message) {
    super(message);
  }
}
module.exports = BadCommandLineFormatError;
