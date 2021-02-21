const { assert } = require('chai');

const store = require('../../../store/Store');
const { parse } = require('../../../parser/parser');
const { create } = require('../../../factory/commandFactory');
const Connection = require('../../../tcp/Connection');
const { TERMINATOR } = require('../../../domain/constants/index');
const { END } = require('../../../domain/constants/messages');
const DummySocket = require('../../utils/DummySocket/DummySocket');

const stringToBuffer = (stringRequest) => Buffer.from(stringRequest + TERMINATOR, 'utf8');

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

const testObj = {
  key: 'existing_key',
  flags: 0,
  exptime: 0,
  bytes: 2,
  noreply: undefined,
  value: '22',
};

const {
  key,
  flags,
  bytes,
  value,
} = testObj;

describe('retrieval', () => {
  describe('execute()', () => {
    describe('normal flow', () => {
      describe('get existent key', () => {
        // 'get' is used as an example, but any retrieval command should behave in the same way
        store.save(testObj);
        const dataString = `get ${testObj.key}`;
        const command = getCommandInstance(dataString);
        const result = command.execute();
        describe('correct response', () => {
          it('should return the corresponding response', () => {
            const actual = result.response;
            const expected = `VALUE ${key} ${flags} ${bytes}${TERMINATOR}${value}${TERMINATOR}${END}`;
            assert.strictEqual(actual, expected);
          });
        });
        describe('correct result', () => {
          it('should return undefined', () => {
            const actual = result.result;
            const expected = undefined;
            assert.strictEqual(actual, expected);
          });
        });
      });
      describe('get nonexistent key', () => {
        const dataString = 'get nonexistent_key';
        const command = getCommandInstance(dataString);
        const result = command.execute();
        describe('correct response', () => {
          it('should return the corresponding response', () => {
            const actual = result.response;
            const expected = END;
            assert.strictEqual(actual, expected);
          });
        });
        describe('correct result', () => {
          it('should return undefined', () => {
            const actual = result.result;
            const expected = undefined;
            assert.strictEqual(actual, expected);
          });
        });
      });
    });
  });
});
