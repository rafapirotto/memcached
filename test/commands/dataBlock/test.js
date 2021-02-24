const { assert } = require('chai');

const { create } = require('../../../factory/commandFactory');
const store = require('../../../store/Store');
const { WrongByteLengthError } = require('../../../domain/errors/badDataChunk');
const {
  ERROR_MESSAGE, BAD_DATA_CHUNK,
} = require('../../../domain/constants/messages');
const { WRONG_EXCEPTION_THROWN, EXPECTED_EXCEPTION_NOT_THROWN } = require('../../utils');

const key = 'new_key';
const flags = '0';
const exptime = '3600';
const bytes = 2;
const noreply = 'noreply';

const getStorageCommandInstance = (command, expectedData, request = null) => {
  const parsedRequest = !request ? [command, key, flags, exptime, bytes, noreply] : request;
  const commandToReturn = create(
    parsedRequest,
    expectedData,
    store,
  );
  return commandToReturn;
};

const getExpectedData = () => [getStorageCommandInstance('set', null), key, flags, exptime, bytes];

const getDataBlockCommandInstance = (parsedRequest, expectedData) => {
  const command = create(
    parsedRequest,
    expectedData,
    store,
  );
  return command;
};

const getExpectedDataWithNoReply = () => [getStorageCommandInstance('set', null), key, flags, exptime, bytes, noreply];

describe('validateDataBlock()', () => {
  after(() => {
    store.initialize();
  });
  describe('when byteLength is different from expected', () => {
    describe('instance of WrongByteLengthError thrown', () => {
      describe('expected data with noreply param', () => {
        it(`should return ${ERROR_MESSAGE} as the error message`, () => {
          try {
            const expectedData = getExpectedDataWithNoReply();
            const command = getDataBlockCommandInstance(['datablock'], expectedData);
            command.validateDataBlock();
            assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
          } catch (e) {
            if (e instanceof WrongByteLengthError) assert.strictEqual(e.message, ERROR_MESSAGE);
            else assert.fail(WRONG_EXCEPTION_THROWN);
          }
        });
      });
      describe('expected data without noreply param', () => {
        it(`should return ${BAD_DATA_CHUNK} as the error message`, () => {
          try {
            const expectedData = getExpectedData();
            const command = getDataBlockCommandInstance(['datablock'], expectedData);
            command.validateDataBlock();
            assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
          } catch (e) {
            if (e instanceof WrongByteLengthError) {
              assert.strictEqual(e.message, BAD_DATA_CHUNK);
            } else assert.fail(WRONG_EXCEPTION_THROWN);
          }
        });
      });
    });
  });
});
describe('execute()', () => {
  it('should return undefined', () => {
    const expectedData = getExpectedDataWithNoReply();
    const command = getDataBlockCommandInstance(['22'], expectedData);
    const { result: actual } = command.execute();
    const expected = undefined;
    assert.strictEqual(actual, expected);
  });
});
