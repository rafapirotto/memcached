const { assert } = require('chai');
const { Prepend, Set } = require('../../../../domain/commands');
const { EMPTY_SPACE } = require('../../../../domain/constants/index');
const { NOT_STORED } = require('../../../../domain/constants/messages');
const store = require('../../../../store/Store');

const testKey = 'existing_key';
const firstFlags = 0;
const firstExptime = 0;
const firstBytes = 2;
const firstValue = '22';

const secondFlags = 2;
const secondExptime = 2;
const secondBytes = 3;
const secondValue = '333';
const noreply = 'noreply';

const firstOptions = [testKey, firstFlags, firstExptime, firstBytes];
const firstOptionsWithNoReply = firstOptions.concat([noreply]);
const secondOptions = [testKey, secondFlags, secondExptime, secondBytes];

describe('prepend', () => {
  after(() => {
    store.initialize();
  });
  describe('doStoreOperation()', () => {
    describe('non existent key', () => {
      describe('correct message returned', () => {
        beforeEach(() => {
          store.initialize();
        });
        describe('without noreply', () => {
          it(`should return ${NOT_STORED}`, () => {
            const prepend = new Prepend(firstOptions);
            prepend.options = prepend.convertDataArrayToObject();
            prepend.options = { ...prepend.options, value: firstValue };
            const actual = prepend.doStoreOperation(store);
            const expected = NOT_STORED;
            assert.strictEqual(actual, expected);
          });
        });
        describe('with noreply', () => {
          it(`should return '${EMPTY_SPACE}'`, () => {
            const prepend = new Prepend(firstOptionsWithNoReply);
            prepend.options = prepend.convertDataArrayToObject();
            prepend.options = { ...prepend.options, value: firstValue };
            const actual = prepend.doStoreOperation(store);
            const expected = EMPTY_SPACE;
            assert.strictEqual(actual, expected);
          });
        });
      });
      describe('object not added', () => {
        before(() => {
          store.initialize();
          const prepend = new Prepend(firstOptionsWithNoReply);
          prepend.options = prepend.convertDataArrayToObject();
          prepend.options = { ...prepend.options, value: firstValue };
          prepend.doStoreOperation(store);
        });
        describe('key', () => {
          it('should have not added the key property', () => {
            const { key } = store.find(testKey);
            const actual = key;
            const expected = undefined;
            assert.strictEqual(actual, expected);
          });
        });
        describe('value', () => {
          it('should have not added the value property', () => {
            const { value } = store.find(testKey);
            const actual = value;
            const expected = undefined;
            assert.strictEqual(actual, expected);
          });
        });
        describe('flags', () => {
          it('should have not added the flags property', () => {
            const { flags } = store.find(testKey);
            const actual = flags;
            const expected = undefined;
            assert.strictEqual(actual, expected);
          });
        });
        describe('exptime', () => {
          it('should have not added the exptime property', () => {
            const { exptime } = store.find(testKey);
            const actual = exptime;
            const expected = undefined;
            assert.strictEqual(actual, expected);
          });
        });
        describe('bytes', () => {
          it('should have not added the bytes property', () => {
            const { bytes } = store.find(testKey);
            const actual = bytes;
            const expected = undefined;
            assert.strictEqual(actual, expected);
          });
        });
        describe('cas', () => {
          it('should have not added the cas property', () => {
            const { cas } = store.find(testKey);
            const actual = cas;
            const expected = undefined;
            assert.strictEqual(actual, expected);
          });
        });
      });
    });
    describe('existent key', () => {
      describe('correct object properties replaced', () => {
        before(() => {
          store.initialize();
          const set = new Set(firstOptions);
          set.options = set.convertDataArrayToObject();
          set.options = { ...set.options, value: firstValue };
          set.doStoreOperation(store);
          const prepend = new Prepend(secondOptions);
          prepend.options = prepend.convertDataArrayToObject();
          prepend.options = { ...prepend.options, value: secondValue };
          prepend.doStoreOperation(store);
        });
        describe('key', () => {
          it('should have not replaced the key property successfully', () => {
            const { key } = store.find(testKey);
            const actual = key;
            const expected = testKey;
            assert.strictEqual(actual, expected);
          });
        });
        describe('value', () => {
          it('should have prepended the value property successfully', () => {
            const { value } = store.find(testKey);
            const actual = value;
            const expected = '33322';
            assert.strictEqual(actual, expected);
          });
        });
        describe('flags', () => {
          it('should have not modified the flags property', () => {
            const { flags } = store.find(testKey);
            const actual = flags;
            const expected = firstFlags;
            assert.strictEqual(actual, expected);
          });
        });
        describe('exptime', () => {
          it('should have not modified the exptime property', () => {
            const { exptime } = store.find(testKey);
            const actual = exptime;
            const expected = firstExptime;
            assert.strictEqual(actual, expected);
          });
        });
        describe('bytes', () => {
          it('should have modified the bytes property', () => {
            const { bytes } = store.find(testKey);
            const actual = bytes;
            const expected = 5;
            assert.strictEqual(actual, expected);
          });
        });
        describe('cas', () => {
          it('should return 2 in the cas property successfully', () => {
            const { cas } = store.find(testKey);
            const actual = cas;
            const expected = 2;
            assert.strictEqual(actual, expected);
          });
        });
      });
    });
  });
});
