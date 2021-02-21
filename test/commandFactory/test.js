const { assert } = require('chai');

const { create } = require('../../factory/commandFactory');
const {
  Set, Add, Replace, Append, Prepend, Get, Gets, DataBlock,
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
const noreply = 'noreply';

const getDataBlockCommandInstance = (parsedRequest, expectedData) => {
  const command = create(
    parsedRequest,
    expectedData,
    store,
  );
  return command;
};

const getStorageCommandInstance = (command, expectedData, request = null) => {
  const parsedRequest = !request ? [command, key, flags, exptime, bytes, noreply] : request;
  const commandToReturn = create(
    parsedRequest,
    expectedData,
    store,
  );
  return commandToReturn;
};

const getRetrievalCommandInstance = (command, expectedData, request = null) => {
  const parsedRequest = !request ? [command, key] : request;
  const commandToReturn = create(
    parsedRequest,
    expectedData,
    store,
  );
  return commandToReturn;
};

const getExpectedData = () => [getStorageCommandInstance('set', null), key, flags, exptime, bytes, noreply];

describe('commandFactory', () => {
  describe('create()', () => {
    describe('when not expecting data', () => {
      describe('storage commands', () => {
        describe('Set', () => {
          it('should return an instance of the Set command', () => {
            const command = getStorageCommandInstance('set', null);
            const actual = command instanceof Set;
            const expected = true;
            assert.strictEqual(actual, expected);
          });
        });
        describe('Add', () => {
          it('should return an instance of the Add command', () => {
            const command = getStorageCommandInstance('add', null);
            const actual = command instanceof Add;
            const expected = true;
            assert.strictEqual(actual, expected);
          });
        });
        describe('Replace', () => {
          it('should return an instance of the Replace command', () => {
            const command = getStorageCommandInstance('replace', null);
            const actual = command instanceof Replace;
            const expected = true;
            assert.strictEqual(actual, expected);
          });
        });
        describe('Append', () => {
          it('should return an instance of the Append command', () => {
            const command = getStorageCommandInstance('append', null);
            const actual = command instanceof Append;
            const expected = true;
            assert.strictEqual(actual, expected);
          });
        });
        describe('Prepend', () => {
          it('should return an instance of the Prepend command', () => {
            const command = getStorageCommandInstance('prepend', null);
            const actual = command instanceof Prepend;
            const expected = true;
            assert.strictEqual(actual, expected);
          });
        });
      });
      describe('retrieval commands', () => {
        describe('Get', () => {
          it('should return an instance of the Get command', () => {
            const command = getRetrievalCommandInstance('get', null);
            const actual = command instanceof Get;
            const expected = true;
            assert.strictEqual(actual, expected);
          });
        });
        describe('Gets', () => {
          it('should return an instance of the Gets command', () => {
            const command = getRetrievalCommandInstance('gets', null);
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
              getDataBlockCommandInstance(['datablock'], null);
              assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
            } catch (e) {
              if (e instanceof InvalidCommandError) assert.strictEqual(e.message, ERROR_MESSAGE);
              else assert.fail(WRONG_EXCEPTION_THROWN);
            }
          });
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
            getStorageCommandInstance('set', expectedData);
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
            getStorageCommandInstance('add', expectedData);
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
            getStorageCommandInstance('replace', expectedData);
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
            getStorageCommandInstance('append', expectedData);
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
            getStorageCommandInstance('prepend', expectedData);
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
            getRetrievalCommandInstance('get', expectedData);
            assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
          } catch (e) {
            if (e instanceof DataExpectedError) assert.strictEqual(e.message, BAD_DATA_CHUNK);
            else assert.fail(WRONG_EXCEPTION_THROWN);
          }
        });
        describe('Gets', () => {
          it('should throw an instance of DataExpectedError', () => {
            try {
              const expectedData = getExpectedData();
              getRetrievalCommandInstance('gets', expectedData);
              assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
            } catch (e) {
              if (e instanceof DataExpectedError) assert.strictEqual(e.message, BAD_DATA_CHUNK);
              else assert.fail(WRONG_EXCEPTION_THROWN);
            }
          });
        });
      });
      describe('data block', () => {
        it('should return an instance of the DataBlock command', () => {
          const expectedData = getExpectedData();
          const command = getDataBlockCommandInstance(['datablock'], expectedData);
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
            getStorageCommandInstance('set', null, ['set']);
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
            getStorageCommandInstance('add', null, ['add']);
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
            getStorageCommandInstance('replace', null, ['replace']);
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
            getStorageCommandInstance('append', null, ['append']);
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
            getStorageCommandInstance('prepend', null, ['prepend']);
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
            getRetrievalCommandInstance('get', null, ['get']);
            assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
          } catch (e) {
            if (e instanceof NoOptionsError) assert.strictEqual(e.message, ERROR_MESSAGE);
            else assert.fail(WRONG_EXCEPTION_THROWN);
          }
        });
        describe('Gets', () => {
          it('should throw an instance of NoOptionsError', () => {
            try {
              getRetrievalCommandInstance('gets', null, ['gets']);
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
