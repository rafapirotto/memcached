const { assert } = require('chai');
const { Set } = require('../../../../domain/commands');
const { EMPTY_SPACE } = require('../../../../domain/constants/index');
const { STORED } = require('../../../../domain/constants/messages');
const store = require('../../../../store/Store');

const testObj1 = {
  key: 'existing_key',
  flags: 0,
  exptime: 0,
  bytes: 2,
  value: '22',
};
const testObj2 = {
  key: 'existing_key',
  flags: 2,
  exptime: 2,
  bytes: 3,
  value: '333',
};

describe('set', () => {
  /*
  only doStoreOperation method is tested
  reason: execute() was already tested in the storage command tests
  because it just calls the superclass method
  */
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
            const set = new Set(null, store);
            const actual = set.doStoreOperation(testObj1);
            const expected = STORED;
            assert.strictEqual(actual, expected);
          });
        });
        describe('with noreply', () => {
          it(`should return '${EMPTY_SPACE}'`, () => {
            const set = new Set(null, store);
            const actual = set.doStoreOperation({ ...testObj1, noreply: 'noreply' });
            const expected = EMPTY_SPACE;
            assert.strictEqual(actual, expected);
          });
        });
      });
      describe('correct object properties added', () => {
        before(() => {
          store.initialize();
          const set = new Set(null, store);
          set.doStoreOperation(testObj1);
        });
        describe('key', () => {
          it('should have saved the key property successfully', () => {
            const { key } = store.find(testObj1.key);
            const actual = key;
            const expected = testObj1.key;
            assert.strictEqual(actual, expected);
          });
        });
        describe('value', () => {
          it('should have saved the value property successfully', () => {
            const { value } = store.find(testObj1.key);
            const actual = value;
            const expected = testObj1.value;
            assert.strictEqual(actual, expected);
          });
        });
        describe('flags', () => {
          it('should have saved the flags property successfully', () => {
            const { flags } = store.find(testObj1.key);
            const actual = flags;
            const expected = testObj1.flags;
            assert.strictEqual(actual, expected);
          });
        });
        describe('exptime', () => {
          it('should have saved the exptime property successfully', () => {
            const { exptime } = store.find(testObj1.key);
            const actual = exptime;
            const expected = testObj1.exptime;
            assert.strictEqual(actual, expected);
          });
        });
        describe('bytes', () => {
          it('should have saved the bytes property successfully', () => {
            const { bytes } = store.find(testObj1.key);
            const actual = bytes;
            const expected = testObj1.bytes;
            assert.strictEqual(actual, expected);
          });
        });
        describe('cas', () => {
          it('should return 1 in the cas property successfully', () => {
            const { cas } = store.find(testObj1.key);
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
        });
        describe('without noreply', () => {
          it(`should return ${STORED}`, () => {
            const set = new Set(null, store);
            const actual = set.doStoreOperation(testObj2);
            const expected = STORED;
            assert.strictEqual(actual, expected);
          });
        });
        describe('with noreply', () => {
          const set = new Set(null, store);
          it(`should return '${EMPTY_SPACE}'`, () => {
            const actual = set.doStoreOperation({ ...testObj2, noreply: 'noreply' });
            const expected = EMPTY_SPACE;
            assert.strictEqual(actual, expected);
          });
        });
      });
      describe('correct object properties modified', () => {
        before(() => {
          store.initialize();
          const set = new Set(null, store);
          set.doStoreOperation(testObj1);
          set.doStoreOperation(testObj2);
        });
        describe('key', () => {
          it('should have not modified the key property', () => {
            const { key } = store.find(testObj2.key);
            const actual = key;
            const expected = testObj1.key;
            assert.strictEqual(actual, expected);
          });
        });
        describe('value', () => {
          it('should have modified the value property successfully', () => {
            const { value } = store.find(testObj2.key);
            const actual = value;
            const expected = testObj2.value;
            assert.strictEqual(actual, expected);
          });
        });
        describe('flags', () => {
          it('should have modified the flags property successfully', () => {
            const { flags } = store.find(testObj2.key);
            const actual = flags;
            const expected = testObj2.flags;
            assert.strictEqual(actual, expected);
          });
        });
        describe('exptime', () => {
          it('should have modified the exptime property successfully', () => {
            const { exptime } = store.find(testObj2.key);
            const actual = exptime;
            const expected = testObj2.exptime;
            assert.strictEqual(actual, expected);
          });
        });
        describe('bytes', () => {
          it('should have modified the bytes property successfully', () => {
            const { bytes } = store.find(testObj2.key);
            const actual = bytes;
            const expected = testObj2.bytes;
            assert.strictEqual(actual, expected);
          });
        });
        describe('cas', () => {
          it('should return 2 in the cas property successfully', () => {
            const { cas } = store.find(testObj2.key);
            const actual = cas;
            const expected = 2;
            assert.strictEqual(actual, expected);
          });
        });
      });
    });
  });
});
