const BadDataChunkError = require('./BadDataChunkError');

class WrongByteLengthError extends BadDataChunkError { }

module.exports = WrongByteLengthError;
