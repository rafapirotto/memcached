const { Get, Gets, Set, DataBlock } = require("./commands");
const { NoOptionsError, InvalidCommandError } = require("./errors");
const storage = require("./Storage");
const { COMMANDS } = require("./utils/index");

class CommandFactory {
    constructor() {}

    create(parsedRequest) {
        const command = parsedRequest[0];
        const options = parsedRequest.slice(1);
        if (this.commandExists(command) && options.length === 0)
            throw new NoOptionsError();
        if (!this.commandExists(command) && options.length > 0)
            throw new InvalidCommandError();
        // TODO: caso donde pongo "h"
        switch (command) {
            case COMMANDS.get:
                return new Get(options, storage);
            case COMMANDS.gets:
                return new Gets(options, storage);
            case COMMANDS.set:
                return new Set(options);
            default:
                return new DataBlock(command, storage);
        }
    }

    commandExists(command) {
        let exists = false;
        Object.entries(COMMANDS).forEach((elem) => {
            const value = elem[1];
            if (value === command) exists = true;
        });
        return exists;
    }
}

module.exports = CommandFactory;
