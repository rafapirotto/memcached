const { assert } = require('chai');

const store = require('../../../store/Store');
const { WrongByteLengthError } = require('../../../domain/errors/badDataChunk');
const {
  ERROR_MESSAGE, BAD_DATA_CHUNK,
} = require('../../../domain/constants/messages');
const { WRONG_EXCEPTION_THROWN, EXPECTED_EXCEPTION_NOT_THROWN } = require('../../utils');
const { EMPTY_SPACE } = require('../../../domain/constants');
const { DataBlock, Set } = require('../../../domain/commands');

const key = 'new_key';
const flags = '0';
const exptime = '3600';
const bytes = 2;
const noreply = 'noreply';

const getExpectedData = () => new Set([key, flags, exptime, bytes]);

const getExpectedDataWithNoReply = () => new Set([key, flags, exptime, bytes, noreply]);

const getDataBlockInstance = (data, expectedData) => new DataBlock(data, store, expectedData);

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
            const command = getDataBlockInstance('datablock', expectedData);
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
            const command = getDataBlockInstance('datablock', expectedData);
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
  it(`should return '${EMPTY_SPACE}'`, () => {
    const expectedData = getExpectedDataWithNoReply();
    const command = getDataBlockInstance('22', expectedData);
    const { response: actual } = command.execute();
    const expected = EMPTY_SPACE;
    assert.strictEqual(actual, expected);
  });
});
