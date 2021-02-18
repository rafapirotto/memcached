class BadCommandLineError extends Error {
  constructor(message) {
    super(message);
  }
}
module.exports = BadCommandLineError;
