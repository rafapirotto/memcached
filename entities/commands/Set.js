const Command = require("./Command");

class Set extends Command {
    constructor(options) {
        super(length, length);
        this.options = options;
    }
    validateSyntax() {
        //TODO
    }
}

module.exports = Set;
