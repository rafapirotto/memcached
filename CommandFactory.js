const Get = require("./commands/Get");
const InvalidCommandError = require("./errors/InvalidCommandError");

class CommandFactory {
    constructor() {}

    create(parsedRequest) {
        const command = parsedRequest[0];
        const options = parsedRequest.slice(1);
        switch (command) {
            case "get":
                return new Get(options);
            default:
                throw new InvalidCommandError();
        }
    }
}

module.exports = CommandFactory;
