const { assert } = require('chai');

const { Set } = require('../../domain/commands');
const store = require('../../store/Store');

const firstTestKey = 'existing_key';
const firstFlags = 0;
const firstExptime = 1;
const firstBytes = 2;
const firstValue = '22';

const secondTestKey = 'existing_key_2';
const secondFlags = 0;
const secondExptime = -4;
const secondBytes = 2;
const secondValue = '22';
const noreply = 'noreply';

const thirdTestKey = firstTestKey;
const thirdFlags = 2;
const thirdExptime = 4;
const thirdBytes = 4;
const thirdValue = '4444';

const firstOptions = [firstTestKey, firstFlags, firstExptime, firstBytes];
const firstOptionsWithNoReply = firstOptions.concat([noreply]);
const secondOptions = [secondTestKey, secondFlags, secondExptime, secondBytes];
const secondOptionsWithNoReply = secondOptions.concat([noreply]);
const thirdOptions = [thirdTestKey, thirdFlags, thirdExptime, thirdBytes];
const thirdOptionsWithNoReply = secondOptions.concat([noreply]);

const testObj1 = {
  key: 'existing_key',
  flags: 0,
  exptime: 1,
  bytes: 2,
  value: '22',
};
const testObj2 = {
  key: 'existing_key_2',
  flags: 0,
  exptime: -4,
  bytes: 2,
  value: '22',
};
const testObj3 = {
  key: firstTestKey,
  flags: 2,
  exptime: 4,
  bytes: 4,
  value: '4444',
};

// source: https://www.sitepoint.com/delay-sleep-pause-wait/
const sleep = (milliseconds) => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
};

describe('store', () => {
  after(() => {
    store.initialize();
  });
  describe('initialize()', () => {
    describe('store', () => {
      before(() => {
        store.initialize();
      });
      it('should return reset the store to an empty array', () => {
        const actual = store.store.length;
        const expected = 0;
        assert.strictEqual(actual, expected);
      });
    });
    describe('cas', () => {
      it('should return reset the cas value to 1', () => {
        const actual = store.cas;
        const expected = 1;
        assert.strictEqual(actual, expected);
      });
    });
  });
  describe('customFind()', () => {
    describe('existing key', () => {
      before(() => {
        const set = new Set(firstOptions);
        set.options = set.convertDataArrayToObject();
        set.options = { ...set.options, value: firstValue };
        set.doStoreOperation(store);
      });
      describe('returned object', () => {
        it('should return the found property with the value true', () => {
          const { found: actual } = store.customFind(firstTestKey);
          const expected = true;
          assert.strictEqual(actual, expected);
        });
        it('should return the index property with the value 0', () => {
          const { index: actual } = store.customFind(firstTestKey);
          const expected = 0;
          assert.strictEqual(actual, expected);
        });
      });
    });
    describe('nonexisting key', () => {
      before(() => {
        store.initialize();
      });
      describe('returned object', () => {
        it('should return the found property with the value false', () => {
          const { found: actual } = store.customFind(firstTestKey);
          const expected = false;
          assert.strictEqual(actual, expected);
        });
        it('should return the index property with the value undefined', () => {
          const { index: actual } = store.customFind(firstTestKey);
          const expected = undefined;
          assert.strictEqual(actual, expected);
        });
      });
    });
  });
  describe('find()', () => {
    describe('existing key', () => {
      before(() => {
        store.initialize();
        let set = new Set(firstOptions);
        set.options = set.convertDataArrayToObject();
        set.options = { ...set.options, value: firstValue };
        set.doStoreOperation(store);
        set = new Set(secondOptions);
        set.options = set.convertDataArrayToObject();
        set.options = { ...set.options, value: secondValue };
        set.doStoreOperation(store);
      });
      describe('found object', () => {
        it('should return the corresponding key', () => {
          const actual = store.find(firstTestKey).key;
          const expected = firstTestKey;
          assert.strictEqual(actual, expected);
        });
        it('should return the corresponding flags', () => {
          const actual = store.find(firstTestKey).flags;
          const expected = firstFlags;
          assert.strictEqual(actual, expected);
        });
        it('should return the corresponding exptime', () => {
          const actual = store.find(firstTestKey).exptime;
          const expected = firstExptime;
          assert.strictEqual(actual, expected);
        });
        it('should return the corresponding bytes', () => {
          const actual = store.find(firstTestKey).bytes;
          const expected = firstBytes;
          assert.strictEqual(actual, expected);
        });
        it('should return the corresponding value', () => {
          const actual = store.find(firstTestKey).value;
          const expected = firstValue;
          assert.strictEqual(actual, expected);
        });
      });
      describe('expired key', () => {
        describe('has not expired yet', () => {
          it('should find the key', () => {
            const actual = store.find(firstTestKey).key;
            const expected = firstTestKey;
            assert.strictEqual(actual, expected);
          });
        });
        describe('has expired', () => {
          describe('positive value', () => {
            it('should not find the key', () => {
              sleep(1000);
              const actual = store.find(firstTestKey).key;
              const expected = undefined;
              assert.strictEqual(actual, expected);
            });
          });
          describe('negative value (key expires right away)', () => {
            it('should not find the key', () => {
              const actual = store.find(secondTestKey).key;
              const expected = undefined;
              assert.strictEqual(actual, expected);
            });
          });
        });
      });
    });
    describe('nonexisting key', () => {
      before(() => {
        store.initialize();
      });
      it('should return false', () => {
        const actual = store.find(firstTestKey);
        const expected = false;
        assert.strictEqual(actual, expected);
      });
    });
  });
  describe('nextCas()', () => {
    before(() => {
      store.initialize();
      const set = new Set(firstOptions);
      set.options = set.convertDataArrayToObject();
      set.options = { ...set.options, value: firstValue };
      set.doStoreOperation(store);
    });
    it('should have incremented by one the cas value', () => {
      const actual = store.cas;
      const expected = 2;
      assert.strictEqual(actual, expected);
    });
  });
  describe('insert()', () => {
    before(() => {
      store.initialize();
      store.insert(testObj1);
      store.insert(testObj2);
    });
    describe('delete the commandInstance property', () => {
      it('should have deleted the commandInstance property', () => {
        const actual = store.find(firstTestKey).commandInstance;
        const expected = undefined;
        assert.strictEqual(actual, expected);
      });
    });
    describe('increase cas value', () => {
      it('should have the cas value of 1', () => {
        const actual = store.find(firstTestKey).cas;
        const expected = 1;
        assert.strictEqual(actual, expected);
      });
    });
    describe('save with positive exptime', () => {
      it('should save the object correctly', () => {
        const actual = store.find(firstTestKey).key;
        const expected = firstTestKey;
        assert.strictEqual(actual, expected);
      });
    });
    describe('save with negative exptime', () => {
      it('should not save the object', () => {
        const actual = store.find(secondTestKey);
        const expected = false;
        assert.strictEqual(actual, expected);
      });
    });
  });
  describe('update()', () => {
    before(() => {
      store.initialize();
      store.insert(testObj1);
      store.update(testObj3);
    });
    describe('updated object properties', () => {
      it('should have not updated the object key', () => {
        const { key: actual } = store.find(thirdTestKey);
        const expected = firstTestKey;
        assert.strictEqual(actual, expected);
      });
      it('should have updated the object flags', () => {
        const { flags: actual } = store.find(thirdTestKey);
        const expected = thirdFlags;
        assert.strictEqual(actual, expected);
      });
      it('should have updated the object exptime', () => {
        const { exptime: actual } = store.find(thirdTestKey);
        const expected = thirdExptime;
        assert.strictEqual(actual, expected);
      });
      it('should have updated the object bytes', () => {
        const { bytes: actual } = store.find(thirdTestKey);
        const expected = thirdBytes;
        assert.strictEqual(actual, expected);
      });
      it('should have updated the object value', () => {
        const { value: actual } = store.find(thirdTestKey);
        const expected = thirdValue;
        assert.strictEqual(actual, expected);
      });
      it('should have deleted the object', () => {
        store.update({ ...testObj3, exptime: -2 });
        const actual = store.find(thirdTestKey);
        const expected = false;
        assert.strictEqual(actual, expected);
      });
    });
  });
  describe('delete()', () => {
    before(() => {
      store.initialize();
      store.insert(testObj1);
      const { index } = store.customFind(firstTestKey);
      store.delete(index);
    });
    describe('delete object', () => {
      it('should delete the object', () => {
        const actual = store.find(firstTestKey);
        const expected = false;
        assert.strictEqual(actual, expected);
      });
      it('should reduce the store length', () => {
        const actual = store.store.length;
        const expected = 0;
        assert.strictEqual(actual, expected);
      });
    });
  });
});
