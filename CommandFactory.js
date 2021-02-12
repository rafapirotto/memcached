const Get = require("./commands/Get");
const { InvalidCommandError, NoOptionsError } = require("./errors");
const storage = require("./Storage");
const { COMMANDS } = require("./utils/index");

class CommandFactory {
    constructor() {}

    create(parsedRequest) {
        const command = parsedRequest[0];
        const options = parsedRequest.slice(1);
        if (COMMANDS.includes(command) && options.length === 0)
            throw new NoOptionsError();
        switch (command) {
            case COMMANDS[0]:
                return new Get(options, storage);
            default:
                throw new InvalidCommandError();
        }
    }
}

module.exports = CommandFactory;
