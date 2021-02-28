const { assert } = require('chai');
const { Add } = require('../../../../domain/commands');
const { EMPTY_SPACE } = require('../../../../domain/constants/index');
const { STORED, NOT_STORED } = require('../../../../domain/constants/messages');
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
const secondOptionsWithNoReply = secondOptions.concat([noreply]);

describe('add', () => {
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
          it(`should return ${STORED}`, () => {
            const add = new Add(firstOptions);
            add.options = add.convertDataArrayToObject();
            add.options = { ...add.options, value: firstValue };
            const actual = add.doStoreOperation(store);
            const expected = STORED;
            assert.strictEqual(actual, expected);
          });
        });
        describe('with noreply', () => {
          it(`should return '${EMPTY_SPACE}'`, () => {
            const add = new Add(firstOptionsWithNoReply);
            add.options = add.convertDataArrayToObject();
            add.options = { ...add.options, value: firstValue };
            const actual = add.doStoreOperation(store);
            const expected = EMPTY_SPACE;
            assert.strictEqual(actual, expected);
          });
        });
      });
      describe('correct object properties added', () => {
        before(() => {
          store.initialize();
          const add = new Add(firstOptions);
          add.options = add.convertDataArrayToObject();
          add.options = { ...add.options, value: firstValue };
          add.doStoreOperation(store);
        });
        describe('key', () => {
          it('should have saved the key property successfully', () => {
            const { key } = store.find(testKey);
            const actual = key;
            const expected = testKey;
            assert.strictEqual(actual, expected);
          });
        });
        describe('value', () => {
          it('should have saved the value property successfully', () => {
            const { value } = store.find(testKey);
            const actual = value;
            const expected = firstValue;
            assert.strictEqual(actual, expected);
          });
        });
        describe('flags', () => {
          it('should have saved the flags property successfully', () => {
            const { flags } = store.find(testKey);
            const actual = flags;
            const expected = firstFlags;
            assert.strictEqual(actual, expected);
          });
        });
        describe('exptime', () => {
          it('should have saved the exptime property successfully', () => {
            const { exptime } = store.find(testKey);
            const actual = exptime;
            const expected = firstExptime;
            assert.strictEqual(actual, expected);
          });
        });
        describe('bytes', () => {
          it('should have saved the bytes property successfully', () => {
            const { bytes } = store.find(testKey);
            const actual = bytes;
            const expected = firstBytes;
            assert.strictEqual(actual, expected);
          });
        });
        describe('cas', () => {
          it('should return 1 in the cas property successfully', () => {
            const { cas } = store.find(testKey);
            const actual = cas;
            const expected = 1;
            assert.strictEqual(actual, expected);
          });
        });
      });
    });
    describe('existent key', () => {
      describe('correct message returned', () => {
        beforeEach(() => {
          store.initialize();
          const add = new Add(firstOptions);
          add.options = add.convertDataArrayToObject();
          add.options = { ...add.options, value: firstValue };
          add.doStoreOperation(store);
        });
        describe('without noreply', () => {
          it(`should return ${NOT_STORED}`, () => {
            const add = new Add(secondOptions);
            add.options = add.convertDataArrayToObject();
            add.options = { ...add.options, value: secondValue };
            const actual = add.doStoreOperation(store);
            const expected = NOT_STORED;
            assert.strictEqual(actual, expected);
          });
        });
        describe('with noreply', () => {
          it(`should return '${EMPTY_SPACE}'`, () => {
            const add = new Add(secondOptionsWithNoReply);
            add.options = add.convertDataArrayToObject();
            add.options = { ...add.options, value: secondValue };
            const actual = add.doStoreOperation(store);
            const expected = EMPTY_SPACE;
            assert.strictEqual(actual, expected);
          });
        });
      });
      describe('object properties not modified', () => {
        before(() => {
          store.initialize();
          let add = new Add(firstOptions);
          add.options = add.convertDataArrayToObject();
          add.options = { ...add.options, value: firstValue };
          add.doStoreOperation(store);
          add = new Add(secondOptions);
          add.options = add.convertDataArrayToObject();
          add.options = { ...add.options, value: secondValue };
          add.doStoreOperation(store);
        });
        describe('key', () => {
          it('should have not modified the key property', () => {
            const { key } = store.find(testKey);
            const actual = key;
            const expected = testKey;
            assert.strictEqual(actual, expected);
          });
        });
        describe('value', () => {
          it('should have not modified the value property', () => {
            const { value } = store.find(testKey);
            const actual = value;
            const expected = firstValue;
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
          it('should have not modified the bytes property', () => {
            const { bytes } = store.find(testKey);
            const actual = bytes;
            const expected = firstBytes;
            assert.strictEqual(actual, expected);
          });
        });
        describe('cas', () => {
          it('should have not modified the cas property', () => {
            const { cas } = store.find(testKey);
            const actual = cas;
            const expected = 1;
            assert.strictEqual(actual, expected);
          });
        });
      });
    });
  });
});
