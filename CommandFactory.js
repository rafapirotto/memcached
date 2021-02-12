const { Get, Gets } = require("./commands");
const { InvalidCommandError, NoOptionsError } = require("./errors");
const storage = require("./Storage");
const { COMMANDS } = require("./utils/index");

class CommandFactory {
    constructor() {}

    create(parsedRequest) {
        const command = parsedRequest[0];
        const options = parsedRequest.slice(1);
        if (this.commandExists(command) && options.length === 0)
            throw new NoOptionsError();
        switch (command) {
            case COMMANDS.get:
                return new Get(options, storage);
            case COMMANDS.gets:
                return new Gets(options, storage);
            default:
                throw new InvalidCommandError();
        }
    }

    commandExists(command) {
        Object.entries(COMMANDS).forEach((elem) => {
            const value = elem[1];
            if (value === command) return true;
        });
        return false;
    }
}

module.exports = CommandFactory;
