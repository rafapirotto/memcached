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

const testKey = 'existing_key';
const firstFlags = 0;
const firstExptime = 0;
const firstBytes = 2;
const firstValue = '22';
const firstCas = 1;

const secondFlags = 2;
const secondExptime = 2;
const secondBytes = 3;
const secondValue = '333';
const noreply = 'noreply';
const secondCas = 2;

const thirdFlags = 4;
const thirdExptime = 4;
const thirdBytes = 4;
const thirdValue = '4444';
const thirdCas = 1;

const firstOptions = [testKey, firstFlags, firstExptime, firstBytes, firstCas];
const firstOptionsWithNoReply = firstOptions.concat([noreply]);
const secondOptions = [testKey, secondFlags, secondExptime, secondBytes, secondCas];
const secondOptionsWithNoReply = secondOptions.concat([noreply]);
const thirdOptions = [testKey, thirdFlags, thirdExptime, thirdBytes, thirdCas];
const thirdOptionsWithNoReply = secondOptions.concat([noreply]);

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
            const set = new Set(secondOptions);
            set.options = set.convertDataArrayToObject();
            set.options = { ...set.options, value: firstValue };
            set.doStoreOperation(store);
          });
          describe('without noreply', () => {
            it(`should return ${STORED}`, () => {
              const cas = new Cas(thirdOptions);
              cas.options = cas.convertDataArrayToObject();
              cas.options = { ...cas.options, value: thirdValue };
              const actual = cas.doStoreOperation(store);
              const expected = STORED;
              assert.strictEqual(actual, expected);
            });
          });
          describe('with noreply', () => {
            it(`should return '${EMPTY_SPACE}'`, () => {
              const cas = new Cas(thirdOptionsWithNoReply);
              cas.options = cas.convertDataArrayToObject();
              cas.options = { ...cas.options, value: thirdValue };
              const actual = cas.doStoreOperation(store);
              const expected = EMPTY_SPACE;
              assert.strictEqual(actual, expected);
            });
          });
        });
        describe('correct object properties modified', () => {
          before(() => {
            store.initialize();
            const set = new Set(firstOptions);
            set.options = set.convertDataArrayToObject();
            set.options = { ...set.options, value: firstValue };
            set.doStoreOperation(store);
            const cas = new Cas(thirdOptions);
            cas.options = cas.convertDataArrayToObject();
            cas.options = { ...cas.options, value: thirdValue };
            cas.doStoreOperation(store);
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
            it('should have modified the value property successfully', () => {
              const { value } = store.find(testKey);
              const actual = value;
              const expected = thirdValue;
              assert.strictEqual(actual, expected);
            });
          });
          describe('flags', () => {
            it('should have modified the flags property successfully', () => {
              const { flags } = store.find(testKey);
              const actual = flags;
              const expected = thirdFlags;
              assert.strictEqual(actual, expected);
            });
          });
          describe('exptime', () => {
            it('should have modified the exptime property successfully', () => {
              const { exptime } = store.find(testKey);
              const actual = exptime;
              const expected = thirdExptime;
              assert.strictEqual(actual, expected);
            });
          });
          describe('bytes', () => {
            it('should have modified the bytes property successfully', () => {
              const { bytes } = store.find(testKey);
              const actual = bytes;
              const expected = thirdBytes;
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
      describe('different cas value', () => {
        describe('correct message returned', () => {
          before(() => {
            store.initialize();
            const set = new Set(firstOptions);
            set.options = set.convertDataArrayToObject();
            set.options = { ...set.options, value: firstValue };
            set.doStoreOperation(store);
          });
          describe('without noreply', () => {
            it(`should return ${EXISTS}`, () => {
              const cas = new Cas(secondOptions);
              cas.options = cas.convertDataArrayToObject();
              cas.options = { ...cas.options, value: secondValue };
              const actual = cas.doStoreOperation(store);
              const expected = EXISTS;
              assert.strictEqual(actual, expected);
            });
          });
          describe('with noreply', () => {
            it(`should return '${EMPTY_SPACE}'`, () => {
              const cas = new Cas(secondOptionsWithNoReply);
              cas.options = cas.convertDataArrayToObject();
              cas.options = { ...cas.options, value: secondValue };
              const actual = cas.doStoreOperation(store);
              const expected = EMPTY_SPACE;
              assert.strictEqual(actual, expected);
            });
          });
        });
        describe('correct object properties modified', () => {
          before(() => {
            store.initialize();
            const set = new Set(firstOptions);
            set.options = set.convertDataArrayToObject();
            set.options = { ...set.options, value: firstValue };
            set.doStoreOperation(store);
            const cas = new Cas(secondOptions);
            cas.options = cas.convertDataArrayToObject();
            cas.options = { ...cas.options, value: secondValue };
            cas.doStoreOperation(store);
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
            it('should return 1 in the cas property successfully', () => {
              const { cas } = store.find(testKey);
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
            const cas = new Cas(firstOptions);
            cas.options = cas.convertDataArrayToObject();
            cas.options = { ...cas.options, value: firstValue };
            const actual = cas.doStoreOperation(store);
            const expected = NOT_FOUND;
            assert.strictEqual(actual, expected);
          });
        });
        describe('with noreply', () => {
          it(`should return '${EMPTY_SPACE}'`, () => {
            const cas = new Cas(firstOptionsWithNoReply);
            cas.options = cas.convertDataArrayToObject();
            cas.options = { ...cas.options, value: firstValue };
            const actual = cas.doStoreOperation(store);
            const expected = EMPTY_SPACE;
            assert.strictEqual(actual, expected);
          });
        });
      });
      describe('object properties not modified', () => {
        before(() => {
          store.initialize();
          const cas = new Cas(secondOptions);
          cas.options = cas.convertDataArrayToObject();
          cas.options = { ...cas.options, value: secondValue };
          cas.doStoreOperation(store);
        });
        describe('key', () => {
          it('should return undefined', () => {
            const { key } = store.find(testKey);
            const actual = key;
            const expected = undefined;
            assert.strictEqual(actual, expected);
          });
        });
        describe('value', () => {
          it('should return undefined', () => {
            const { value } = store.find(testKey);
            const actual = value;
            const expected = undefined;
            assert.strictEqual(actual, expected);
          });
        });
        describe('flags', () => {
          it('should return undefined', () => {
            const { flags } = store.find(testKey);
            const actual = flags;
            const expected = undefined;
            assert.strictEqual(actual, expected);
          });
        });
        describe('exptime', () => {
          it('should return undefined', () => {
            const { exptime } = store.find(testKey);
            const actual = exptime;
            const expected = undefined;
            assert.strictEqual(actual, expected);
          });
        });
        describe('bytes', () => {
          it('should return undefined', () => {
            const { bytes } = store.find(testKey);
            const actual = bytes;
            const expected = undefined;
            assert.strictEqual(actual, expected);
          });
        });
        describe('cas', () => {
          it('should return undefined', () => {
            const { cas } = store.find(testKey);
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
  describe('convertDataArrayToObject()', () => {
    it('should return 6', () => {
      const cas = new Cas(null);
      cas.options = [testKey, firstFlags, firstExptime, firstBytes, firstCas, noreply];
      const actual = Object.keys(cas.convertDataArrayToObject()).length;
      const expected = 6;
      assert.strictEqual(actual, expected);
    });
  });
});
