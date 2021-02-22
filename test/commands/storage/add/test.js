const { assert } = require('chai');
const { Add } = require('../../../../domain/commands');
const { EMPTY_SPACE } = require('../../../../domain/constants/index');
const { STORED, NOT_STORED } = require('../../../../domain/constants/messages');
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

describe('add', () => {
  /*
  only doStorageOperation methods is tested
  reason: execute() was already tested in the storage command tests
  because it just calls the superclass method
  */
  after(() => {
    store.initialize();
  });
  describe('doStorageOperation()', () => {
    describe('non existent key', () => {
      describe('correct message returned', () => {
        beforeEach(() => {
          store.initialize();
        });
        describe('without noreply', () => {
          it(`should return ${STORED}`, () => {
            const add = new Add(null, store);
            const actual = add.doStorageOperation(testObj1);
            const expected = STORED;
            assert.strictEqual(actual, expected);
          });
        });
        describe('with noreply', () => {
          it(`should return '${EMPTY_SPACE}'`, () => {
            const add = new Add(null, store);
            const actual = add.doStorageOperation({ ...testObj1, noreply: 'noreply' });
            const expected = EMPTY_SPACE;
            assert.strictEqual(actual, expected);
          });
        });
      });
      describe('correct object properties added', () => {
        before(() => {
          store.initialize();
          const add = new Add(null, store);
          add.doStorageOperation(testObj1);
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
          const add = new Add(null, store);
          add.doStorageOperation(testObj1);
          add.doStorageOperation(testObj2);
        });
        describe('without noreply', () => {
          it(`should return ${NOT_STORED}`, () => {
            const add = new Add(null, store);
            const actual = add.doStorageOperation(testObj2);
            const expected = NOT_STORED;
            assert.strictEqual(actual, expected);
          });
        });
        describe('with noreply', () => {
          const add = new Add(null, store);
          it(`should return '${EMPTY_SPACE}'`, () => {
            const actual = add.doStorageOperation({ ...testObj2, noreply: 'noreply' });
            const expected = EMPTY_SPACE;
            assert.strictEqual(actual, expected);
          });
        });
      });
      describe('object properties not modified', () => {
        before(() => {
          store.initialize();
          const add = new Add(null, store);
          add.doStorageOperation(testObj1);
          add.doStorageOperation(testObj2);
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
          it('should have not modified the value property', () => {
            const { value } = store.find(testObj2.key);
            const actual = value;
            const expected = testObj1.value;
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
          it('should have not modified the bytes property', () => {
            const { bytes } = store.find(testObj2.key);
            const actual = bytes;
            const expected = testObj1.bytes;
            assert.strictEqual(actual, expected);
          });
        });
        describe('cas', () => {
          it('should have not modified the cas property', () => {
            const { cas } = store.find(testObj2.key);
            const actual = cas;
            const expected = 1;
            assert.strictEqual(actual, expected);
          });
        });
      });
    });
  });
});
