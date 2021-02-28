const { assert } = require('chai');

const { create } = require('../../factory/commandFactory');
const {
  Set, Add, Replace, Append, Prepend, Get, Gets, DataBlock, Cas,
} = require('../../domain/commands');
const store = require('../../store/Store');
const { NoOptionsError, InvalidCommandError } = require('../../domain/errors/syntax');
const { DataExpectedError } = require('../../domain/errors/badDataChunk');
const {
  ERROR_MESSAGE, BAD_DATA_CHUNK,
} = require('../../domain/constants/messages');
const { WRONG_EXCEPTION_THROWN, EXPECTED_EXCEPTION_NOT_THROWN } = require('../utils');

const key = 'new_key';
const flags = '0';
const exptime = '3600';
const bytes = '2';

const getStorageParsedRequest = (command) => [command, key, flags, exptime, bytes];

const getRetrievalParsedRequest = (command) => [command, key];

const getCommandInstance = (parsedRequest, expectedData) => {
  const command = create(
    parsedRequest,
    expectedData,
    store,
  );
  return command;
};

const getExpectedData = () => new Set([key, flags, exptime, bytes]);

describe('commandFactory', () => {
  after(() => {
    store.initialize();
  });
  describe('create()', () => {
    describe('when not expecting data', () => {
      describe('storage commands', () => {
        describe('Set', () => {
          it('should return an instance of the Set command', () => {
            const parsedRequest = getStorageParsedRequest('set');
            const command = getCommandInstance(parsedRequest, null);
            const actual = command instanceof Set;
            const expected = true;
            assert.strictEqual(actual, expected);
          });
        });
        describe('Add', () => {
          it('should return an instance of the Add command', () => {
            const parsedRequest = getStorageParsedRequest('add');
            const command = getCommandInstance(parsedRequest, null);
            const actual = command instanceof Add;
            const expected = true;
            assert.strictEqual(actual, expected);
          });
        });
        describe('Replace', () => {
          it('should return an instance of the Replace command', () => {
            const parsedRequest = getStorageParsedRequest('replace');
            const command = getCommandInstance(parsedRequest, null);
            const actual = command instanceof Replace;
            const expected = true;
            assert.strictEqual(actual, expected);
          });
        });
        describe('Append', () => {
          it('should return an instance of the Append command', () => {
            const parsedRequest = getStorageParsedRequest('append');
            const command = getCommandInstance(parsedRequest, null);
            const actual = command instanceof Append;
            const expected = true;
            assert.strictEqual(actual, expected);
          });
        });
        describe('Prepend', () => {
          it('should return an instance of the Prepend command', () => {
            const parsedRequest = getStorageParsedRequest('prepend');
            const command = getCommandInstance(parsedRequest, null);
            const actual = command instanceof Prepend;
            const expected = true;
            assert.strictEqual(actual, expected);
          });
        });
        describe('Cas', () => {
          it('should return an instance of the Cas command', () => {
            const parsedRequest = getStorageParsedRequest('cas');
            const command = getCommandInstance(parsedRequest, null);
            const actual = command instanceof Cas;
            const expected = true;
            assert.strictEqual(actual, expected);
          });
        });
      });
      describe('retrieval commands', () => {
        describe('Get', () => {
          it('should return an instance of the Get command', () => {
            const parsedRequest = getRetrievalParsedRequest('get');
            const command = getCommandInstance(parsedRequest, null);
            const actual = command instanceof Get;
            const expected = true;
            assert.strictEqual(actual, expected);
          });
        });
        describe('Gets', () => {
          it('should return an instance of the Gets command', () => {
            const parsedRequest = getRetrievalParsedRequest('gets');
            const command = getCommandInstance(parsedRequest, null);
            const actual = command instanceof Gets;
            const expected = true;
            assert.strictEqual(actual, expected);
          });
        });
      });
      describe('data', () => {
        describe('DataBlock', () => {
          it('should throw an instance of InvalidCommandError', () => {
            try {
              const parsedRequest = ['datablock'];
              const command = getCommandInstance(parsedRequest, null, null);
              command.execute();
              assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
            } catch (e) {
              if (e instanceof InvalidCommandError) assert.strictEqual(e.message, ERROR_MESSAGE);
              else assert.fail(WRONG_EXCEPTION_THROWN);
            }
          });
        });
      });
    });
    describe('when expecting data', () => {
      describe('storage commands', () => {
        describe('Set', () => {
          it('should throw an instance of DataExpectedError', () => {
            try {
              const expectedData = getExpectedData();
              const parsedRequest = getStorageParsedRequest('set');
              getCommandInstance(parsedRequest, expectedData);
              assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
            } catch (e) {
              if (e instanceof DataExpectedError) assert.strictEqual(e.message, BAD_DATA_CHUNK);
              else assert.fail(WRONG_EXCEPTION_THROWN);
            }
          });
        });
        describe('Add', () => {
          it('should throw an instance of DataExpectedError', () => {
            try {
              const expectedData = getExpectedData();
              const parsedRequest = getStorageParsedRequest('add');
              getCommandInstance(parsedRequest, expectedData);
              assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
            } catch (e) {
              if (e instanceof DataExpectedError) assert.strictEqual(e.message, BAD_DATA_CHUNK);
              else assert.fail(WRONG_EXCEPTION_THROWN);
            }
          });
        });
        describe('Replace', () => {
          it('should throw an instance of DataExpectedError', () => {
            try {
              const expectedData = getExpectedData();
              const parsedRequest = getStorageParsedRequest('replace');
              getCommandInstance(parsedRequest, expectedData);
              assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
            } catch (e) {
              if (e instanceof DataExpectedError) assert.strictEqual(e.message, BAD_DATA_CHUNK);
              else assert.fail(WRONG_EXCEPTION_THROWN);
            }
          });
        });
        describe('Append', () => {
          it('should throw an instance of DataExpectedError', () => {
            try {
              const expectedData = getExpectedData();
              const parsedRequest = getStorageParsedRequest('append');
              getCommandInstance(parsedRequest, expectedData);
              assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
            } catch (e) {
              if (e instanceof DataExpectedError) assert.strictEqual(e.message, BAD_DATA_CHUNK);
              else assert.fail(WRONG_EXCEPTION_THROWN);
            }
          });
        });
        describe('Prepend', () => {
          it('should throw an instance of DataExpectedError', () => {
            try {
              const expectedData = getExpectedData();
              const parsedRequest = getStorageParsedRequest('prepend');
              getCommandInstance(parsedRequest, expectedData);
              assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
            } catch (e) {
              if (e instanceof DataExpectedError) assert.strictEqual(e.message, BAD_DATA_CHUNK);
              else assert.fail(WRONG_EXCEPTION_THROWN);
            }
          });
        });
      });
      describe('retrieval commands', () => {
        describe('Get', () => {
          it('should throw an instance of DataExpectedError', () => {
            try {
              const expectedData = getExpectedData();
              const parsedRequest = getRetrievalParsedRequest('get');
              getCommandInstance(parsedRequest, expectedData);
              assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
            } catch (e) {
              if (e instanceof DataExpectedError) assert.strictEqual(e.message, BAD_DATA_CHUNK);
              else assert.fail(WRONG_EXCEPTION_THROWN);
            }
          });
        });
        describe('Gets', () => {
          it('should throw an instance of DataExpectedError', () => {
            try {
              const expectedData = getExpectedData();
              const parsedRequest = getRetrievalParsedRequest('gets');
              getCommandInstance(parsedRequest, expectedData);
              assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
            } catch (e) {
              if (e instanceof DataExpectedError) assert.strictEqual(e.message, BAD_DATA_CHUNK);
              else assert.fail(WRONG_EXCEPTION_THROWN);
            }
          });
        });
        describe('data block', () => {
          it('should return an instance of the DataBlock command', () => {
            const expectedData = getExpectedData();
            const parsedRequest = ['datablock'];
            const command = getCommandInstance(parsedRequest, expectedData);
            const actual = command instanceof DataBlock;
            const expected = true;
            assert.strictEqual(actual, expected);
          });
        });
      });
    });
    describe('when no arguments are provided with the command', () => {
      describe('storage commands', () => {
        describe('Set', () => {
          it('should throw an instance of NoOptionsError', () => {
            try {
              const expectedData = getExpectedData();
              const parsedRequest = ['set'];
              getCommandInstance(parsedRequest, expectedData);
              assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
            } catch (e) {
              if (e instanceof NoOptionsError) assert.strictEqual(e.message, ERROR_MESSAGE);
              else assert.fail(WRONG_EXCEPTION_THROWN);
            }
          });
        });
        describe('Add', () => {
          it('should throw an instance of NoOptionsError', () => {
            try {
              const expectedData = getExpectedData();
              const parsedRequest = ['add'];
              getCommandInstance(parsedRequest, expectedData);
              assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
            } catch (e) {
              if (e instanceof NoOptionsError) assert.strictEqual(e.message, ERROR_MESSAGE);
              else assert.fail(WRONG_EXCEPTION_THROWN);
            }
          });
        });
        describe('Replace', () => {
          it('should throw an instance of NoOptionsError', () => {
            try {
              const expectedData = getExpectedData();
              const parsedRequest = ['replace'];
              getCommandInstance(parsedRequest, expectedData);
              assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
            } catch (e) {
              if (e instanceof NoOptionsError) assert.strictEqual(e.message, ERROR_MESSAGE);
              else assert.fail(WRONG_EXCEPTION_THROWN);
            }
          });
        });
        describe('Append', () => {
          it('should throw an instance of NoOptionsError', () => {
            try {
              const expectedData = getExpectedData();
              const parsedRequest = ['append'];
              getCommandInstance(parsedRequest, expectedData);
              assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
            } catch (e) {
              if (e instanceof NoOptionsError) assert.strictEqual(e.message, ERROR_MESSAGE);
              else assert.fail(WRONG_EXCEPTION_THROWN);
            }
          });
        });
        describe('Prepend', () => {
          it('should throw an instance of NoOptionsError', () => {
            try {
              const expectedData = getExpectedData();
              const parsedRequest = ['prepend'];
              getCommandInstance(parsedRequest, expectedData);
              assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
            } catch (e) {
              if (e instanceof NoOptionsError) assert.strictEqual(e.message, ERROR_MESSAGE);
              else assert.fail(WRONG_EXCEPTION_THROWN);
            }
          });
        });
      });
      describe('retrieval commands', () => {
        describe('Get', () => {
          it('should throw an instance of NoOptionsError', () => {
            try {
              const expectedData = getExpectedData();
              const parsedRequest = ['get'];
              getCommandInstance(parsedRequest, expectedData);
              assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
            } catch (e) {
              if (e instanceof NoOptionsError) assert.strictEqual(e.message, ERROR_MESSAGE);
              else assert.fail(WRONG_EXCEPTION_THROWN);
            }
          });
          describe('Gets', () => {
            it('should throw an instance of NoOptionsError', () => {
              try {
                const expectedData = getExpectedData();
                const parsedRequest = ['gets'];
                getCommandInstance(parsedRequest, expectedData);
                assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
              } catch (e) {
                if (e instanceof NoOptionsError) assert.strictEqual(e.message, ERROR_MESSAGE);
                else assert.fail(WRONG_EXCEPTION_THROWN);
              }
            });
          });
        });
      });
    });
  });
});
