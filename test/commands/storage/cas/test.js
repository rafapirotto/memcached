const { assert } = require('chai');
const { Cas, Set } = require('../../../../domain/commands');
const { EMPTY_SPACE } = require('../../../../domain/constants/index');
const { STORED, NOT_FOUND, EXISTS } = require('../../../../domain/constants/messages');
const store = require('../../../../store/Store');

const testObj1 = {
  key: 'existing_key',
  flags: 0,
  exptime: 0,
  bytes: 2,
  value: '22',
  cas: 1,
};
const testObj2 = {
  key: 'existing_key',
  flags: 2,
  exptime: 2,
  bytes: 3,
  value: '333',
  cas: 2,
};
const testObj3 = {
  key: 'existing_key',
  flags: 4,
  exptime: 4,
  bytes: 4,
  value: '4444',
  cas: 1,
};

describe('cas', () => {
  /*
  only doStoreOperation method is tested
  reason: execute() was already tested in the storage command tests
  because it just calls the superclass method
  */
  after(() => {
    store.initialize();
  });
  describe('doStoreOperation()', () => {
    describe('existent key', () => {
      describe('same cas value', () => {
        describe('correct message returned', () => {
          before(() => {
            store.initialize();
            const set = new Set(null, store);
            set.doStoreOperation(testObj1);
          });
          describe('without noreply', () => {
            it(`should return ${STORED}`, () => {
              const cas = new Cas(null, store);
              const actual = cas.doStoreOperation(testObj3);
              const expected = STORED;
              assert.strictEqual(actual, expected);
            });
          });
          describe('with noreply', () => {
            it(`should return '${EMPTY_SPACE}'`, () => {
              const cas = new Cas(null, store);
              const actual = cas.doStoreOperation({ ...testObj3, noreply: 'noreply' });
              const expected = EMPTY_SPACE;
              assert.strictEqual(actual, expected);
            });
          });
        });
        describe('correct object properties modified', () => {
          before(() => {
            store.initialize();
            const set = new Set(null, store);
            const cas = new Cas(null, store);
            set.doStoreOperation(testObj1);
            cas.doStoreOperation(testObj3);
          });
          describe('key', () => {
            it('should have not modified the key property', () => {
              const { key } = store.find(testObj3.key);
              const actual = key;
              const expected = testObj1.key;
              assert.strictEqual(actual, expected);
            });
          });
          describe('value', () => {
            it('should have modified the value property successfully', () => {
              const { value } = store.find(testObj3.key);
              const actual = value;
              const expected = testObj3.value;
              assert.strictEqual(actual, expected);
            });
          });
          describe('flags', () => {
            it('should have modified the flags property successfully', () => {
              const { flags } = store.find(testObj3.key);
              const actual = flags;
              const expected = testObj3.flags;
              assert.strictEqual(actual, expected);
            });
          });
          describe('exptime', () => {
            it('should have modified the exptime property successfully', () => {
              const { exptime } = store.find(testObj3.key);
              const actual = exptime;
              const expected = testObj3.exptime;
              assert.strictEqual(actual, expected);
            });
          });
          describe('bytes', () => {
            it('should have modified the bytes property successfully', () => {
              const { bytes } = store.find(testObj3.key);
              const actual = bytes;
              const expected = testObj3.bytes;
              assert.strictEqual(actual, expected);
            });
          });
          describe('cas', () => {
            it('should return 2 in the cas property successfully', () => {
              const { cas } = store.find(testObj3.key);
              const actual = cas;
              const expected = 2;
              assert.strictEqual(actual, expected);
            });
          });
        });
      });
      describe('different cas value', () => {
        describe('correct message returned', () => {
          before(() => {
            store.initialize();
            const set = new Set(null, store);
            set.doStoreOperation(testObj1);
          });
          describe('without noreply', () => {
            it(`should return ${EXISTS}`, () => {
              const cas = new Cas(null, store);
              const actual = cas.doStoreOperation(testObj2);
              const expected = EXISTS;
              assert.strictEqual(actual, expected);
            });
          });
          describe('with noreply', () => {
            it(`should return '${EMPTY_SPACE}'`, () => {
              const cas = new Cas(null, store);
              const actual = cas.doStoreOperation({ ...testObj2, noreply: 'noreply' });
              const expected = EMPTY_SPACE;
              assert.strictEqual(actual, expected);
            });
          });
        });
        describe('correct object properties modified', () => {
          before(() => {
            store.initialize();
            const set = new Set(null, store);
            const cas = new Cas(null, store);
            set.doStoreOperation(testObj1);
            cas.doStoreOperation(testObj2);
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
              const { value } = store.find(testObj3.key);
              const actual = value;
              const expected = testObj1.value;
              assert.strictEqual(actual, expected);
            });
          });
          describe('flags', () => {
            it('should have not modified the flags property', () => {
              const { flags } = store.find(testObj3.key);
              const actual = flags;
              const expected = testObj1.flags;
              assert.strictEqual(actual, expected);
            });
          });
          describe('exptime', () => {
            it('should have not modified the exptime property', () => {
              const { exptime } = store.find(testObj3.key);
              const actual = exptime;
              const expected = testObj1.exptime;
              assert.strictEqual(actual, expected);
            });
          });
          describe('bytes', () => {
            it('should have not modified the bytes property', () => {
              const { bytes } = store.find(testObj3.key);
              const actual = bytes;
              const expected = testObj1.bytes;
              assert.strictEqual(actual, expected);
            });
          });
          describe('cas', () => {
            it('should return 1 in the cas property successfully', () => {
              const { cas } = store.find(testObj3.key);
              const actual = cas;
              const expected = 1;
              assert.strictEqual(actual, expected);
            });
          });
        });
      });
    });
    describe('non existent key', () => {
      describe('correct message returned', () => {
        beforeEach(() => {
          store.initialize();
        });
        describe('without noreply', () => {
          it(`should return ${NOT_FOUND}`, () => {
            const cas = new Cas(null, store);
            const actual = cas.doStoreOperation(testObj1);
            const expected = NOT_FOUND;
            assert.strictEqual(actual, expected);
          });
        });
        describe('with noreply', () => {
          it(`should return '${EMPTY_SPACE}'`, () => {
            const cas = new Cas(null, store);
            const actual = cas.doStoreOperation({ ...testObj1, noreply: 'noreply' });
            const expected = EMPTY_SPACE;
            assert.strictEqual(actual, expected);
          });
        });
      });
      describe('object properties not modified', () => {
        before(() => {
          store.initialize();
          const cas = new Cas(null, store);
          cas.doStoreOperation(testObj2);
        });
        describe('key', () => {
          it('should return undefined', () => {
            const { key } = store.find(testObj2.key);
            const actual = key;
            const expected = undefined;
            assert.strictEqual(actual, expected);
          });
        });
        describe('value', () => {
          it('should return undefined', () => {
            const { value } = store.find(testObj2.key);
            const actual = value;
            const expected = undefined;
            assert.strictEqual(actual, expected);
          });
        });
        describe('flags', () => {
          it('should return undefined', () => {
            const { flags } = store.find(testObj2.key);
            const actual = flags;
            const expected = undefined;
            assert.strictEqual(actual, expected);
          });
        });
        describe('exptime', () => {
          it('should return undefined', () => {
            const { exptime } = store.find(testObj2.key);
            const actual = exptime;
            const expected = undefined;
            assert.strictEqual(actual, expected);
          });
        });
        describe('bytes', () => {
          it('should return undefined', () => {
            const { bytes } = store.find(testObj2.key);
            const actual = bytes;
            const expected = undefined;
            assert.strictEqual(actual, expected);
          });
        });
        describe('cas', () => {
          it('should return undefined', () => {
            const { cas } = store.find(testObj2.key);
            const actual = cas;
            const expected = undefined;
            assert.strictEqual(actual, expected);
          });
        });
      });
    });
  });
});
