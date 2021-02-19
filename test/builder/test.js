const assert = require('assert');

const storage = require('../../storage/Storage');
const { build } = require('../../domain/builder');
const Connection = require('../../tcp/Connection');
const { TERMINATOR } = require('../../domain/constants/index');
const { objectList } = require('./factory');

const stringToBuffer = (stringRequest) => Buffer.from(stringRequest + TERMINATOR, 'utf8');

class DummySocket {
  write(text) {
    this.text = text;
  }
}

const loadObjectsToStore = () => {
  objectList.forEach((obj) => {
    storage.save(obj);
  });
};

beforeEach(() => {
  storage.initialize();
  loadObjectsToStore();
});

describe('Get single nonexistent key', () => {
  it('Reponse should be END', () => {
    const socket = new DummySocket();
    const data = stringToBuffer('get non_existent_key');
    const connection = new Connection(socket, data);
    const expectedResult = `END${TERMINATOR}`;
    build(connection, storage);
    assert.strictEqual(socket.text, expectedResult);
  });
});
