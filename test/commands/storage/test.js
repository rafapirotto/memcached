const { assert } = require('chai');

const store = require('../../../store/Store');
const { parse } = require('../../../parser/parser');
const { create } = require('../../../factory/commandFactory');
const Connection = require('../../../tcp/Connection');
const { TERMINATOR, EMPTY_SPACE } = require('../../../domain/constants/index');
const { Add, Append } = require('../../../domain/commands');
const DummySocket = require('../../utils/DummySocket/DummySocket');
const { WRONG_EXCEPTION_THROWN, EXPECTED_EXCEPTION_NOT_THROWN } = require('../../utils');
const { WrongArgumentNumberError } = require('../../../domain/errors/syntax');
const { BadCommandLineFormatError } = require('../../../domain/errors/badCommandLine');
const {
  ERROR_MESSAGE, BAD_COMMAND_LINE_FORMAT,
} = require('../../../domain/constants/messages');

const stringToBuffer = (stringRequest) => Buffer.from(stringRequest + TERMINATOR, 'utf8');

const key = 'new_key';
const flags = 0;
const exptime = 3600;
const bytes = 2;

const getCommandInstance = (dataString) => {
  const socket = new DummySocket();
  const data = stringToBuffer(dataString);
  const connection = new Connection(socket, data);
  const parsedRequest = parse(connection.data);
  const command = create(
    parsedRequest,
    connection.getExpectedData(),
    store,
  );
  return command;
};

const getResult = (dataString) => {
  const command = getCommandInstance(dataString);
  const result = command.execute();
  return result;
};

describe('storage', () => {
  after(() => {
    store.initialize();
  });
  describe('execute()', () => {
    describe('normal flow', () => {
      describe('correct response', () => {
        it('should return an empty space', () => {
          const result = getResult(`prepend ${key} ${flags} ${exptime} ${bytes}`);
          const actual = result.response;
          const expected = EMPTY_SPACE;
          assert.strictEqual(actual, expected);
        });
      });
      describe('correct data length', () => {
        it('should return 5', () => {
          const result = getResult(`add ${key} ${flags} ${exptime} ${bytes}`);
          const actual = result.data.options.length;
          const expected = 4;
          assert.strictEqual(actual, expected);
        });
      });
      describe('correct data content', () => {
        describe('command', () => {
          it('should return an instance of the Append command', () => {
            const result = getResult(`append ${key} ${flags} ${exptime} ${bytes}`);
            const actual = result.data instanceof Append;
            const expected = true;
            assert.strictEqual(actual, expected);
          });
        });
        describe('key', () => {
          it('should return the corresponding key', () => {
            const result = getResult(`add ${key} ${flags} ${exptime} ${bytes}`);
            const actual = result.data.options[0];
            const expected = key;
            assert.strictEqual(actual, expected);
          });
        });
        describe('flags', () => {
          it('should return the corresponding flags', () => {
            const result = getResult(`add ${key} ${flags} ${exptime} ${bytes}`);
            const actual = result.data.options[1];
            const expected = flags;
            assert.strictEqual(actual, expected);
          });
        });
        describe('exptime', () => {
          it('should return the corresponding exptime', () => {
            const result = getResult(`add ${key} ${flags} ${exptime} ${bytes}`);
            const actual = result.data.options[2];
            const expected = exptime;
            assert.strictEqual(actual, expected);
          });
        });
        describe('bytes', () => {
          it('should return the corresponding bytes', () => {
            const result = getResult(`add ${key} ${flags} ${exptime} ${bytes}`);
            const actual = result.data.options[3];
            const expected = bytes;
            assert.strictEqual(actual, expected);
          });
        });
      });
    });
    describe('alternative flow', () => {
      describe('wrong number of arguments', () => {
        describe('more than required', () => {
          it('should throw an instance of WrongArgumentNumberError', () => {
            const dataString = `cas ${key} ${flags} ${exptime} ${bytes} other args args`;
            const command = getCommandInstance(dataString);
            try {
              command.execute();
              assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
            } catch (e) {
              if (e instanceof WrongArgumentNumberError) {
                assert.strictEqual(e.message, ERROR_MESSAGE);
              } else assert.fail(WRONG_EXCEPTION_THROWN);
            }
          });
        });
        describe('less than required', () => {
          it('should throw an instance of WrongArgumentNumberError', () => {
            const dataString = `add ${key} ${flags} ${exptime} ${bytes} other args`;
            const command = getCommandInstance(dataString);
            try {
              command.execute();
              assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
            } catch (e) {
              if (e instanceof WrongArgumentNumberError) {
                assert.strictEqual(e.message, ERROR_MESSAGE);
              } else assert.fail(WRONG_EXCEPTION_THROWN);
            }
          });
        });
      });
      describe('wrong arguments', () => {
        describe('negative arguments', () => {
          describe('flags', () => {
            it('should throw an instance of BadCommandLineFormatError', () => {
              const dataString = `replace ${key} -1 ${exptime} ${bytes}`;
              const command = getCommandInstance(dataString);
              try {
                command.execute();
                assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
              } catch (e) {
                if (e instanceof BadCommandLineFormatError) {
                  assert.strictEqual(e.message, BAD_COMMAND_LINE_FORMAT);
                } else assert.fail(WRONG_EXCEPTION_THROWN);
              }
            });
          });
          describe('exptime', () => {
            it('should return the corresponding exptime', () => {
              const dataString = `add ${key} ${flags} -${exptime} ${bytes}`;
              const command = getCommandInstance(dataString);
              const result = command.execute();
              const actual = result.data.options[2];
              const expected = -exptime;
              assert.strictEqual(actual, expected);
            });
          });
          describe('bytes', () => {
            it('should throw an instance of BadCommandLineFormatError', () => {
              const dataString = `add ${key} ${flags} ${exptime} -${bytes}`;
              const command = getCommandInstance(dataString);
              try {
                command.execute();
                assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
              } catch (e) {
                if (e instanceof BadCommandLineFormatError) {
                  assert.strictEqual(e.message, BAD_COMMAND_LINE_FORMAT);
                } else assert.fail(WRONG_EXCEPTION_THROWN);
              }
            });
          });
        });
        describe('float arguments', () => {
          describe('flags', () => {
            it('should throw an instance of BadCommandLineFormatError', () => {
              const dataString = `add ${key} 1.0 ${exptime} ${bytes}`;
              const command = getCommandInstance(dataString);
              try {
                command.execute();
                assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
              } catch (e) {
                if (e instanceof BadCommandLineFormatError) {
                  assert.strictEqual(e.message, BAD_COMMAND_LINE_FORMAT);
                } else assert.fail(WRONG_EXCEPTION_THROWN);
              }
            });
          });
          describe('exptime', () => {
            it('should throw an instance of BadCommandLineFormatError', () => {
              const dataString = `add ${key} ${flags} ${exptime}.0 ${bytes}`;
              const command = getCommandInstance(dataString);
              try {
                command.execute();
                assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
              } catch (e) {
                if (e instanceof BadCommandLineFormatError) {
                  assert.strictEqual(e.message, BAD_COMMAND_LINE_FORMAT);
                } else assert.fail(WRONG_EXCEPTION_THROWN);
              }
            });
          });
          describe('bytes', () => {
            it('should throw an instance of BadCommandLineFormatError', () => {
              const dataString = `add ${key} ${flags} ${exptime} ${bytes}.0`;
              const command = getCommandInstance(dataString);
              try {
                command.execute();
                assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
              } catch (e) {
                if (e instanceof BadCommandLineFormatError) {
                  assert.strictEqual(e.message, BAD_COMMAND_LINE_FORMAT);
                } else assert.fail(WRONG_EXCEPTION_THROWN);
              }
            });
          });
        });
      });
      describe('string arguments when integer required', () => {
        describe('flags', () => {
          it('should throw an instance of BadCommandLineFormatError', () => {
            const dataString = `add ${key} one ${exptime} ${bytes}`;
            const command = getCommandInstance(dataString);
            try {
              command.execute();
              assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
            } catch (e) {
              if (e instanceof BadCommandLineFormatError) {
                assert.strictEqual(e.message, BAD_COMMAND_LINE_FORMAT);
              } else assert.fail(WRONG_EXCEPTION_THROWN);
            }
          });
        });
        describe('exptime', () => {
          it('should throw an instance of BadCommandLineFormatError', () => {
            const dataString = `add ${key} ${flags} one ${bytes}`;
            const command = getCommandInstance(dataString);
            try {
              command.execute();
              assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
            } catch (e) {
              if (e instanceof BadCommandLineFormatError) {
                assert.strictEqual(e.message, BAD_COMMAND_LINE_FORMAT);
              } else assert.fail(WRONG_EXCEPTION_THROWN);
            }
          });
        });
        describe('bytes', () => {
          it('should throw an instance of BadCommandLineFormatError', () => {
            const dataString = `add ${key} ${flags} ${exptime} one`;
            const command = getCommandInstance(dataString);
            try {
              command.execute();
              assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
            } catch (e) {
              if (e instanceof BadCommandLineFormatError) {
                assert.strictEqual(e.message, BAD_COMMAND_LINE_FORMAT);
              } else assert.fail(WRONG_EXCEPTION_THROWN);
            }
          });
        });
      });
    });
  });
  describe('validateNumberOptions()', () => {
    const options = ['key', '1', '2', '3', 'noreply'];
    const add = new Add(options, store);
    add.validateNumberOptions();
    describe('flags', () => {
      it('should return number 1', () => {
        const actual = add.options[1];
        const expected = 1;
        assert.strictEqual(actual, expected);
      });
    });
    describe('exptime', () => {
      it('should return number 2', () => {
        const actual = add.options[2];
        const expected = 2;
        assert.strictEqual(actual, expected);
      });
    });
    describe('bytes', () => {
      it('should return number 3', () => {
        const actual = add.options[3];
        const expected = 3;
        assert.strictEqual(actual, expected);
      });
    });
  });
  describe('validateOptionsLength()', () => {
    before(() => {
      store.initialize();
    });
    describe('correct length 1', () => {
      const options = ['key', '1', '2', '3', 'noreply'];
      const add = new Add(options, store);
      add.validateOptionsLength();
      it('should return number 6', () => {
        const actual = add.options.length;
        const expected = 5;
        assert.strictEqual(actual, expected);
      });
    });
    describe('correct length 2', () => {
      const options = ['key', '1', '2', '3'];
      const add = new Add(options, store);
      add.validateOptionsLength();
      it('should return number 5', () => {
        const actual = add.options.length;
        const expected = 4;
        assert.strictEqual(actual, expected);
      });
    });
    describe('more options than  required', () => {
      it('should throw an instance of WrongArgumentNumberError', () => {
        const options = ['key', '1', '2', '3', '4', '6', 'noreply'];
        const add = new Add(options, store);
        try {
          add.validateOptionsLength();
          assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
        } catch (e) {
          if (e instanceof WrongArgumentNumberError) assert.strictEqual(e.message, ERROR_MESSAGE);
          else assert.fail(WRONG_EXCEPTION_THROWN);
        }
      });
    });
    describe('less options than  required', () => {
      it('should throw an instance of WrongArgumentNumberError', () => {
        const options = ['key', '1', 'noreply'];
        const add = new Add(options, store);
        try {
          add.validateOptionsLength();
          assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
        } catch (e) {
          if (e instanceof WrongArgumentNumberError) assert.strictEqual(e.message, ERROR_MESSAGE);
          else assert.fail(WRONG_EXCEPTION_THROWN);
        }
      });
    });
  });
});
