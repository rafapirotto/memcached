const { assert } = require('chai');

const storage = require('../../storage/Storage');
const { build } = require('../../domain/builder');
const Connection = require('../../tcp/Connection');
const { TERMINATOR, EMPTY_SPACE } = require('../../domain/constants/index');
const { Set } = require('../../domain/commands');
const DummySocket = require('../utils/DummySocket/DummySocket');

const stringToBuffer = (stringRequest) => Buffer.from(stringRequest + TERMINATOR, 'utf8');

const testObj = {
  key: 'existing_key_1',
  flags: 0,
  exptime: 0,
  bytes: 2,
  noreply: undefined,
  value: '22',
};

const key = 'new_key';
const flags = 0;
const exptime = 3600;
const bytes = 2;

beforeEach(() => {
  storage.initialize();
  storage.save(testObj);
});

describe('connection', () => {
  describe('setExpectedData()', () => {
    describe('with expectedData', () => {
      const socket = new DummySocket();
      const dataString = `set ${key} ${flags} ${exptime} ${bytes}`;
      const data = stringToBuffer(dataString);
      const connection = new Connection(socket, data);
      describe('expected data from the set command', () => {
        build(connection, storage);
        it('should return an instance of the set command', () => {
          const actual = socket.expectedData[0] instanceof Set;
          const expected = true;
          assert.strictEqual(actual, expected);
        });
        it('should return the corresponding key', () => {
          const actual = socket.expectedData[1];
          const expected = key;
          assert.strictEqual(actual, expected);
        });
        it('should return the corresponding flags', () => {
          const actual = socket.expectedData[2];
          const expected = flags;
          assert.strictEqual(actual, expected);
        });
        it('should return the corresponding exptime', () => {
          const actual = socket.expectedData[3];
          const expected = exptime;
          assert.strictEqual(actual, expected);
        });
        it('should return the corresponding bytes', () => {
          const actual = socket.expectedData[4];
          const expected = bytes;
          assert.strictEqual(actual, expected);
        });
      });
    });

    describe('without expected data', () => {
      const socket = new DummySocket();
      const data = stringToBuffer('get existing_key_1');
      const connection = new Connection(socket, data);
      build(connection, storage);
      it('should return undefined', () => {
        const actual = socket.expectedData;
        const expected = undefined;
        assert.strictEqual(actual, expected);
      });
    });
  });

  describe('sendResponse()', () => {
    describe('nonempty response', () => {
      const socket = new DummySocket();
      const data = stringToBuffer('get non_existent_key');
      const connection = new Connection(socket, data);
      build(connection, storage);
      it('should return the corresponding nonempty response', () => {
        const actual = socket.text;
        const expected = `END${TERMINATOR}`;
        assert.strictEqual(actual, expected);
      });
    });

    describe('empty response', () => {
      const socket = new DummySocket();
      const data = stringToBuffer('set new_key 0 3600 2');
      const connection = new Connection(socket, data);
      build(connection, storage);
      it('should return an empty space', () => {
        const actual = socket.text;
        const expected = EMPTY_SPACE;
        assert.strictEqual(actual, expected);
      });
    });
  });

  describe('getExpectedData()', () => {
    describe('without expectedData', () => {
      const socket = new DummySocket();
      const data = stringToBuffer('get key');
      const connection = new Connection(socket, data);
      it('should return undefined', () => {
        const actual = connection.getExpectedData();
        const expected = undefined;
        assert.strictEqual(actual, expected);
      });
    });
    describe('with expectedData', () => {
      const socket = new DummySocket();
      const data = stringToBuffer(`set ${key} ${flags} ${exptime} ${bytes}`);
      const connection = new Connection(socket, data);
      build(connection, storage);
      it('should return an array of length 5 with the corresponding expectedData', () => {
        const actual = connection.getExpectedData().length;
        const expected = 5;
        assert.strictEqual(actual, expected);
      });
    });
  });
});
