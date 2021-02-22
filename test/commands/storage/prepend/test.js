const { assert } = require('chai');
const { Prepend, Set } = require('../../../../domain/commands');
const { EMPTY_SPACE } = require('../../../../domain/constants/index');
const { NOT_STORED } = require('../../../../domain/constants/messages');
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

describe('prepend', () => {
  /*
  only doStoreOperation methods is tested
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
          it(`should return ${NOT_STORED}`, () => {
            const prepend = new Prepend(null, store);
            const actual = prepend.doStoreOperation(testObj1);
            const expected = NOT_STORED;
            assert.strictEqual(actual, expected);
          });
        });
        describe('with noreply', () => {
          it(`should return '${EMPTY_SPACE}'`, () => {
            const prepend = new Prepend(null, store);
            const actual = prepend.doStoreOperation({ ...testObj1, noreply: 'noreply' });
            const expected = EMPTY_SPACE;
            assert.strictEqual(actual, expected);
          });
        });
      });
      describe('object not added', () => {
        before(() => {
          store.initialize();
          const prepend = new Prepend(null, store);
          prepend.doStoreOperation(testObj1);
        });
        describe('key', () => {
          it('should have not added the key property', () => {
            const { key } = store.find(testObj1.key);
            const actual = key;
            const expected = undefined;
            assert.strictEqual(actual, expected);
          });
        });
        describe('value', () => {
          it('should have not added the value property', () => {
            const { value } = store.find(testObj1.key);
            const actual = value;
            const expected = undefined;
            assert.strictEqual(actual, expected);
          });
        });
        describe('flags', () => {
          it('should have not added the flags property', () => {
            const { flags } = store.find(testObj1.key);
            const actual = flags;
            const expected = undefined;
            assert.strictEqual(actual, expected);
          });
        });
        describe('exptime', () => {
          it('should have not added the exptime property', () => {
            const { exptime } = store.find(testObj1.key);
            const actual = exptime;
            const expected = undefined;
            assert.strictEqual(actual, expected);
          });
        });
        describe('bytes', () => {
          it('should have not added the bytes property', () => {
            const { bytes } = store.find(testObj1.key);
            const actual = bytes;
            const expected = undefined;
            assert.strictEqual(actual, expected);
          });
        });
        describe('cas', () => {
          it('should have not added the cas property', () => {
            const { cas } = store.find(testObj1.key);
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
          const set = new Set(null, store);
          const prepend = new Prepend(null, store);
          set.doStoreOperation(testObj1);
          prepend.doStoreOperation(testObj2);
        });
        describe('key', () => {
          it('should have not replaced the key property successfully', () => {
            console.log('store', store);
            const { key } = store.find(testObj2.key);
            const actual = key;
            const expected = testObj1.key;
            assert.strictEqual(actual, expected);
          });
        });
        describe('value', () => {
          it('should have prepended the value property successfully', () => {
            const { value } = store.find(testObj2.key);
            const actual = value;
            const expected = '33322';
            assert.strictEqual(actual, expected);
          });
        });
        describe('flags', () => {
          it('should have not modified the flags property', () => {
            const { flags } = store.find(testObj2.key);
            const actual = flags;
            const expected = testObj1.flags;
            assert.strictEqual(actual, expected);
          });
        });
        describe('exptime', () => {
          it('should have not modified the exptime property', () => {
            const { exptime } = store.find(testObj2.key);
            const actual = exptime;
            const expected = testObj1.exptime;
            assert.strictEqual(actual, expected);
          });
        });
        describe('bytes', () => {
          it('should have modified the bytes property', () => {
            const { bytes } = store.find(testObj2.key);
            const actual = bytes;
            const expected = 5;
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
