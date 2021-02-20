const { assert } = require('chai');

const { parse } = require('../../parser/parser');
const { create } = require('../../factory/commandFactory');
const { TERMINATOR } = require('../../domain/constants/index');
const {
  Set, Add, Replace, Append, Prepend, Get, Gets, DataBlock,
} = require('../../domain/commands');
const DummySocket = require('../DummySocket/DummySocket');
const Connection = require('../../tcp/Connection');
const storage = require('../../storage/Storage');
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

const stringToBuffer = (stringRequest) => Buffer.from(stringRequest + TERMINATOR, 'utf8');

const getInstanceOfSetCommand = () => {
  const setDataString = `set ${key} ${flags} ${exptime} ${bytes} ${noreply}`;
  const setData = stringToBuffer(setDataString);
  const setDataSocket = new DummySocket();
  const setConnection = new Connection(setDataSocket, setData);
  const setParsedRequest = parse(setData);
  const setCommand = create(
    setParsedRequest,
    setConnection.getExpectedData(),
    storage,
  );
  return setCommand;
};
const getCommand = (dataString, expectedData) => {
  const data = stringToBuffer(dataString);
  const parsedRequest = parse(data);
  create(
    parsedRequest,
    expectedData,
    storage,
  );
};

describe('commandFactory', () => {
  describe('create()', () => {
    describe('existent commands with correct syntax', () => {
      describe('storage', () => {
        describe('Set', () => {
          it('should return an instance of the Set command', () => {
            const dataString = `set ${key} ${flags} ${exptime} ${bytes} ${noreply}`;
            const data = stringToBuffer(dataString);
            const socket = new DummySocket();
            const connection = new Connection(socket, data);
            const parsedRequest = parse(data);
            const command = create(
              parsedRequest,
              connection.getExpectedData(),
              storage,
            );
            const actual = command instanceof Set;
            const expected = true;
            assert.strictEqual(actual, expected);
          });
        });
        describe('Add', () => {
          it('should return an instance of the Add command', () => {
            const dataString = `add ${key} ${flags} ${exptime} ${bytes} ${noreply}`;
            const data = stringToBuffer(dataString);
            const socket = new DummySocket();
            const connection = new Connection(socket, data);
            const parsedRequest = parse(data);
            const command = create(
              parsedRequest,
              connection.getExpectedData(),
              storage,
            );
            const actual = command instanceof Add;
            const expected = true;
            assert.strictEqual(actual, expected);
          });
        });
        describe('Replace', () => {
          it('should return an instance of the Replace command', () => {
            const dataString = `replace ${key} ${flags} ${exptime} ${bytes} ${noreply}`;
            const data = stringToBuffer(dataString);
            const socket = new DummySocket();
            const connection = new Connection(socket, data);
            const parsedRequest = parse(data);
            const command = create(
              parsedRequest,
              connection.getExpectedData(),
              storage,
            );
            const actual = command instanceof Replace;
            const expected = true;
            assert.strictEqual(actual, expected);
          });
        });
        describe('Append', () => {
          it('should return an instance of the Append command', () => {
            const dataString = `append ${key} ${flags} ${exptime} ${bytes} ${noreply}`;
            const data = stringToBuffer(dataString);
            const socket = new DummySocket();
            const connection = new Connection(socket, data);
            const parsedRequest = parse(data);
            const command = create(
              parsedRequest,
              connection.getExpectedData(),
              storage,
            );
            const actual = command instanceof Append;
            const expected = true;
            assert.strictEqual(actual, expected);
          });
        });
        describe('Prepend', () => {
          it('should return an instance of the Prepend command', () => {
            const dataString = `prepend ${key} ${flags} ${exptime} ${bytes} ${noreply}`;
            const data = stringToBuffer(dataString);
            const socket = new DummySocket();
            const connection = new Connection(socket, data);
            const parsedRequest = parse(data);
            const command = create(
              parsedRequest,
              connection.getExpectedData(),
              storage,
            );
            const actual = command instanceof Prepend;
            const expected = true;
            assert.strictEqual(actual, expected);
          });
        });
      });
      describe('retrieval', () => {
        describe('Get', () => {
          it('should return an instance of the Get command', () => {
            const dataString = 'get key';
            const data = stringToBuffer(dataString);
            const socket = new DummySocket();
            const connection = new Connection(socket, data);
            const parsedRequest = parse(data);
            const command = create(
              parsedRequest,
              connection.getExpectedData(),
              storage,
            );
            const actual = command instanceof Get;
            const expected = true;
            assert.strictEqual(actual, expected);
          });
        });
        describe('Gets', () => {
          it('should return an instance of the Gets command', () => {
            const dataString = 'gets key';
            const data = stringToBuffer(dataString);
            const socket = new DummySocket();
            const connection = new Connection(socket, data);
            const parsedRequest = parse(data);
            const command = create(
              parsedRequest,
              connection.getExpectedData(),
              storage,
            );
            const actual = command instanceof Gets;
            const expected = true;
            assert.strictEqual(actual, expected);
          });
        });
      });
    });
    describe('existent commands with incorrect syntax', () => {
      describe('without options', () => {
        it('should throw a instance of NoOptionsError', () => {
          try {
            getCommand('set', null);
            assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
          } catch (e) {
            if (e instanceof NoOptionsError) assert.strictEqual(e.message, ERROR_MESSAGE);
            else assert.fail(WRONG_EXCEPTION_THROWN);
          }
        });
      });
      describe('when expecting data', () => {
        it('should throw a instance of DataExpectedError', () => {
          try {
            const expectedData = [getInstanceOfSetCommand(), key, flags, exptime, bytes, noreply];
            getCommand(`set ${key} ${flags} ${exptime} ${bytes} ${noreply}`, expectedData);
            assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
          } catch (e) {
            if (e instanceof DataExpectedError) assert.strictEqual(e.message, BAD_DATA_CHUNK);
            else assert.fail(WRONG_EXCEPTION_THROWN);
          }
        });
      });
    });
    describe('inexistent commands with correct syntax', () => {
      it('should return an instance of the DataBlock command', () => {
        const dataString = 'value';
        const data = stringToBuffer(dataString);
        const parsedRequest = parse(data);
        const expectedData = [getInstanceOfSetCommand(), key, flags, exptime, bytes, noreply];
        const command = create(
          parsedRequest,
          expectedData,
          storage,
        );
        const actual = command instanceof DataBlock;
        const expected = true;
        assert.strictEqual(actual, expected);
      });
    });
    describe('inexistent commands with incorrect syntax', () => {
      it('should throw a instance of InvalidCommandError', () => {
        try {
          getCommand('non_existent_command', null);
          assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
        } catch (e) {
          if (e instanceof InvalidCommandError) assert.strictEqual(e.message, ERROR_MESSAGE);
          else assert.fail(WRONG_EXCEPTION_THROWN);
        }
      });
    });
  });
});
