const assert = require('assert');

const storage = require('../../storage/Storage');
const { build } = require('../../domain/builder');
const Connection = require('../../tcp/Connection');
const { TERMINATOR, EMPTY_SPACE } = require('../../domain/constants/index');
const { Set } = require('../../domain/commands');

const stringToBuffer = (stringRequest) => Buffer.from(stringRequest + TERMINATOR, 'utf8');

class DummySocket {
  write(text) {
    this.text = text;
  }
}

const testObj = {
  key: 'existing_key_1',
  flags: 0,
  exptime: 0,
  bytes: 2,
  noreply: undefined,
  value: '22',
};

beforeEach(() => {
  storage.initialize();
  storage.save(testObj);
});

describe('builder', () => {
  describe('setExpectedData()', () => {
    describe('with expectedData', () => {
      describe('expected data from the set command', () => {
        const key = 'new_key';
        const flags = 0;
        const exptime = 3600;
        const bytes = 2;
        const dataString = `set ${key} ${flags} ${exptime} ${bytes}`;
        it('should return an instance of the set command', () => {
          const socket = new DummySocket();
          const data = stringToBuffer(dataString);
          const connection = new Connection(socket, data);
          build(connection, storage);
          const actual = socket.expectedData[0] instanceof Set;
          const expected = true;
          assert.strictEqual(actual, expected);
        });
        it('should return the corresponding key', () => {
          const socket = new DummySocket();
          const data = stringToBuffer(dataString);
          const connection = new Connection(socket, data);
          build(connection, storage);
          const actual = socket.expectedData[1];
          const expected = key;
          assert.strictEqual(actual, expected);
        });
        it('should return the corresponding flags', () => {
          const socket = new DummySocket();
          const data = stringToBuffer(dataString);
          const connection = new Connection(socket, data);
          build(connection, storage);
          const actual = socket.expectedData[2];
          const expected = flags;
          assert.strictEqual(actual, expected);
        });
        it('should return the corresponding exptime', () => {
          const socket = new DummySocket();
          const data = stringToBuffer(dataString);
          const connection = new Connection(socket, data);
          build(connection, storage);
          const actual = socket.expectedData[3];
          const expected = exptime;
          assert.strictEqual(actual, expected);
        });
        it('should return the corresponding bytes', () => {
          const socket = new DummySocket();
          const data = stringToBuffer(dataString);
          const connection = new Connection(socket, data);
          build(connection, storage);
          const actual = socket.expectedData[4];
          const expected = bytes;
          assert.strictEqual(actual, expected);
        });
      });
    });

    describe('without expected data', () => {
      it('should return undefined', () => {
        const socket = new DummySocket();
        const data = stringToBuffer('get existing_key_1');
        const connection = new Connection(socket, data);
        build(connection, storage);
        const actual = socket.expectedData;
        const expected = undefined;
        assert.strictEqual(actual, expected);
      });
    });
  });

  describe('sendResponse()', () => {
    describe('nonempty response', () => {
      it('should return a nonempty response', () => {
        const socket = new DummySocket();
        const data = stringToBuffer('get non_existent_key');
        const connection = new Connection(socket, data);
        build(connection, storage);
        const actual = socket.text;
        const expected = `END${TERMINATOR}`;
        assert.strictEqual(actual, expected);
      });
    });

    describe('empty response', () => {
      it('should return an empty space', () => {
        const socket = new DummySocket();
        const data = stringToBuffer('set new_key 0 3600 2');
        const connection = new Connection(socket, data);
        build(connection, storage);
        const actual = socket.text;
        const expected = EMPTY_SPACE;
        assert.strictEqual(actual, expected);
      });
    });
  });
});
