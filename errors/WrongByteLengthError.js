class WrongByteLengthError extends Error {
    constructor(message) {
        super(message);
    }
}
module.exports = WrongByteLengthError;
