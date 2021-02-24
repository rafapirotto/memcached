const { assert } = require('chai');
const { Cas, Set } = require('../../../../domain/commands');
const { EMPTY_SPACE } = require('../../../../domain/constants/index');
const {
  STORED, NOT_FOUND, EXISTS, ERROR_MESSAGE, BAD_COMMAND_LINE_FORMAT,
} = require('../../../../domain/constants/messages');
const store = require('../../../../store/Store');
const { EXPECTED_EXCEPTION_NOT_THROWN, WRONG_EXCEPTION_THROWN } = require('../../../utils');
const { WrongArgumentNumberError } = require('../../../../domain/errors/syntax');
const { BadCommandLineFormatError } = require('../../../../domain/errors/badCommandLine');

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
  execute() method not tested
  reason: was already tested in the storage command tests
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
  describe('validateNumberOptions()', () => {
    describe('correct values', () => {
      before(() => {
        store.initialize();
      });
      const options = ['key', '1', '2', '3', '4', 'noreply'];
      const cas = new Cas(options, store);
      cas.validateNumberOptions();
      describe('flags', () => {
        it('should return number 1', () => {
          const actual = cas.options[1];
          const expected = 1;
          assert.strictEqual(actual, expected);
        });
      });
      describe('exptime', () => {
        it('should return number 2', () => {
          const actual = cas.options[2];
          const expected = 2;
          assert.strictEqual(actual, expected);
        });
      });
      describe('bytes', () => {
        it('should return number 3', () => {
          const actual = cas.options[3];
          const expected = 3;
          assert.strictEqual(actual, expected);
        });
      });
      describe('cas', () => {
        it('should return number 4', () => {
          const actual = cas.options[4];
          const expected = 4;
          assert.strictEqual(actual, expected);
        });
      });
    });
    describe('wrong values', () => {
      before(() => {
        store.initialize();
      });
      describe('flags', () => {
        it('should throw an instance of BadCommandLineFormatError', () => {
          const options = ['key', '1.0', '2', '3', '4', 'noreply'];
          const cas = new Cas(options, store);
          try {
            cas.validateNumberOptions();
            assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
          } catch (e) {
            if (e instanceof BadCommandLineFormatError) {
              assert.strictEqual(e.message, BAD_COMMAND_LINE_FORMAT);
            } else assert.fail(WRONG_EXCEPTION_THROWN);
          }
        });
      });
      describe('exptime', () => {
        it('should throw an instance of BadCommandLineFormatError', () => {
          const options = ['key', '1', 'two', '3', '4', 'noreply'];
          const cas = new Cas(options, store);
          try {
            cas.validateNumberOptions();
            assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
          } catch (e) {
            if (e instanceof BadCommandLineFormatError) {
              assert.strictEqual(e.message, BAD_COMMAND_LINE_FORMAT);
            } else assert.fail(WRONG_EXCEPTION_THROWN);
          }
        });
      });
      describe('exptime', () => {
        it('should throw an instance of BadCommandLineFormatError', () => {
          const options = ['key', '1', '2', '-3', '4', 'noreply'];
          const cas = new Cas(options, store);
          try {
            cas.validateNumberOptions();
            assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
          } catch (e) {
            if (e instanceof BadCommandLineFormatError) {
              assert.strictEqual(e.message, BAD_COMMAND_LINE_FORMAT);
            } else assert.fail(WRONG_EXCEPTION_THROWN);
          }
        });
      });
    });
  });
  describe('validateOptionsLength()', () => {
    before(() => {
      store.initialize();
    });
    describe('correct length 1', () => {
      const options = ['key', '1', '2', '3', '4', 'noreply'];
      const cas = new Cas(options, store);
      cas.validateOptionsLength();
      it('should return number 6', () => {
        const actual = cas.options.length;
        const expected = 6;
        assert.strictEqual(actual, expected);
      });
    });
    describe('correct length 2', () => {
      const options = ['key', '1', '2', '3', '4'];
      const cas = new Cas(options, store);
      cas.validateOptionsLength();
      it('should return number 5', () => {
        const actual = cas.options.length;
        const expected = 5;
        assert.strictEqual(actual, expected);
      });
    });
    describe('more options than  required', () => {
      it('should throw an instance of WrongArgumentNumberError', () => {
        const options = ['key', '1', '2', '3', '4', '6', 'noreply'];
        const cas = new Cas(options, store);
        try {
          cas.validateOptionsLength();
          assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
        } catch (e) {
          if (e instanceof WrongArgumentNumberError) assert.strictEqual(e.message, ERROR_MESSAGE);
          else assert.fail(WRONG_EXCEPTION_THROWN);
        }
      });
    });
    describe('less options than  required', () => {
      it('should throw an instance of WrongArgumentNumberError', () => {
        const options = ['key', '1', '4', 'noreply'];
        const cas = new Cas(options, store);
        try {
          cas.validateOptionsLength();
          assert.fail(EXPECTED_EXCEPTION_NOT_THROWN);
        } catch (e) {
          if (e instanceof WrongArgumentNumberError) assert.strictEqual(e.message, ERROR_MESSAGE);
          else assert.fail(WRONG_EXCEPTION_THROWN);
        }
      });
    });
  });
  describe('convertDataToObject()', () => {
    it('convertDataToObject()', () => {
      const {
        key, flags, exptime, bytes, noreply,
      } = testObj1;
      const expectedArray = ['cas', key, flags, exptime, bytes, noreply];
      const cas = new Cas(null, store);
      const actual = Object.keys(cas.convertDataToObject(expectedArray)).length;
      const expected = 7;
      assert.strictEqual(actual, expected);
    });
  });
});
