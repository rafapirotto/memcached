class InvalidCommandError extends Error {
  constructor(message) {
    super(message);
  }
}
module.exports = InvalidCommandError;
