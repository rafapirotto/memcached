const BadDataChunkError = require('./BadDataChunkError');

class DataExpectedError extends BadDataChunkError { }

module.exports = DataExpectedError;
