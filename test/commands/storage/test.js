const { assert } = require('chai');

const storage = require('../../../storage/Storage');
const { parse } = require('../../../parser/parser');
const { create } = require('../../../factory/commandFactory');
const Connection = require('../../../tcp/Connection');
const { TERMINATOR, EMPTY_SPACE } = require('../../../domain/constants/index');
const { Add } = require('../../../domain/commands');
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
    storage,
  );
  return command;
};

describe('storage', () => {
  describe('execute()', () => {
    describe('normal flow', () => {
      // 'add' is used as an example, but any storage command should behave in the same way
      const dataString = `add ${key} ${flags} ${exptime} ${bytes}`;
      const command = getCommandInstance(dataString);
      const result = command.execute();
      describe('correct response', () => {
        it('should return an empty space', () => {
          const actual = result.response;
          const expected = EMPTY_SPACE;
          assert.strictEqual(actual, expected);
        });
      });
      describe('correct data length', () => {
        it('should return 5', () => {
          const actual = result.data.length;
          const expected = 5;
          assert.strictEqual(actual, expected);
        });
      });
      describe('correct data content', () => {
        describe('command', () => {
          it('should return an instance of the Add command', () => {
            const actual = result.data[0] instanceof Add;
            const expected = true;
            assert.strictEqual(actual, expected);
          });
        });
        describe('key', () => {
          it('should return the corresponding key', () => {
            const actual = result.data[1];
            const expected = key;
            assert.strictEqual(actual, expected);
          });
        });
        describe('flags', () => {
          it('should return the corresponding flags', () => {
            const actual = result.data[2];
            const expected = flags;
            assert.strictEqual(actual, expected);
          });
        });
        describe('exptime', () => {
          it('should return the corresponding exptime', () => {
            const actual = result.data[3];
            const expected = exptime;
            assert.strictEqual(actual, expected);
          });
        });
        describe('bytes', () => {
          it('should return the corresponding bytes', () => {
            const actual = result.data[4];
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
              const dataString = `add ${key} -1 ${exptime} ${bytes}`;
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
              const actual = result.data[3];
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
});
