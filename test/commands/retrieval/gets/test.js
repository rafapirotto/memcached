const { assert } = require('chai');
const { Gets } = require('../../../../domain/commands');
const { TERMINATOR } = require('../../../../domain/constants/index');
const { END } = require('../../../../domain/constants/messages');
const store = require('../../../../store/Store');

const testObj = {
  key: 'existing_key',
  flags: 0,
  exptime: 0,
  bytes: 2,
  noreply: undefined,
  value: '22',
  cas: 1,
};

const {
  key,
  flags,
  bytes,
  value,
  cas,
} = testObj;

const nonExistingKey = 'non_existing_key';

const getOutput = (keys) => {
  const get = new Gets(keys, store);
  return get.getOutput(keys);
};

describe('gets', () => {
  after(() => {
    store.initialize();
  });
  describe('toString()', () => {
    it('should return the corresponding string', () => {
      const get = new Gets(null, store);
      const actual = get.toString(testObj);
      const expected = `VALUE ${key} ${flags} ${bytes} ${cas}${TERMINATOR}${value}${TERMINATOR}`;
      assert.strictEqual(actual, expected);
    });
  });
  describe('getOutput()', () => {
    before(() => {
      store.insert(testObj);
    });

    describe('existing keys', () => {
      describe('single key', () => {
        it('should return the corresponding string', () => {
          const actual = getOutput([key]);
          const expected = `VALUE ${key} ${flags} ${bytes} ${cas}${TERMINATOR}${value}${TERMINATOR}${END}`;
          assert.strictEqual(actual, expected);
        });
      });
      describe('multiple keys', () => {
        it('should return the corresponding string', () => {
          const actual = getOutput([key, key, key]);
          const expectedString = `VALUE ${key} ${flags} ${bytes} ${cas}${TERMINATOR}${value}${TERMINATOR}`;
          const expected = `${expectedString}${expectedString}${expectedString}${END}`;
          assert.strictEqual(actual, expected);
        });
      });
    });
    describe('nonexisting keys', () => {
      describe('single key', () => {
        it(`should return ${END}`, () => {
          const actual = getOutput([nonExistingKey]);
          const expected = END;
          assert.strictEqual(actual, expected);
        });
      });
      describe('multiple keys', () => {
        it(`should return ${END}`, () => {
          const actual = getOutput([nonExistingKey, nonExistingKey, nonExistingKey]);
          const expected = END;
          assert.strictEqual(actual, expected);
        });
      });
    });
    describe('existing and nonexisting keys', () => {
      it('should return the existent key', () => {
        const actual = getOutput([nonExistingKey, key, nonExistingKey]);
        const expected = `VALUE ${key} ${flags} ${bytes} ${cas}${TERMINATOR}${value}${TERMINATOR}${END}`;
        assert.strictEqual(actual, expected);
      });
    });
  });
});
