const assert = require('assert');

const { parse } = require('../../parser/parser');
const { TERMINATOR, EMPTY_SPACE } = require('../../domain/constants/index');

const stringToBuffer = (stringRequest) => Buffer.from(stringRequest + TERMINATOR, 'utf8');

describe('parser', () => {
  describe('parse()', () => {
    describe('non empty string', () => {
      const key = 'new_key';
      const flags = '0';
      const exptime = '3600';
      const bytes = '2';
      const noreply = 'noreply';
      const dataString = `set ${key} ${flags} ${exptime} ${bytes} ${noreply}`;
      const expectedArray = ['set', key, flags, exptime, bytes, noreply];
      const data = stringToBuffer(dataString);
      const parsedRequest = parse(data);
      describe('correct array length', () => {
        it('should return the number of corresponding arguments', () => {
          const actual = parsedRequest.length;
          const expected = expectedArray.length;
          assert.strictEqual(actual, expected);
        });
      });
      describe('correct content of array', () => {
        it('should return the corresponding command as the first element in the array', () => {
          const actual = parsedRequest[0];
          const expected = expectedArray[0];
          assert.strictEqual(actual, expected);
        });
        it('should return the corresponding key as the second element in the array', () => {
          const actual = parsedRequest[1];
          const expected = expectedArray[1];
          assert.strictEqual(actual, expected);
        });
        it('should return the corresponding flags as the third element in the array', () => {
          const actual = parsedRequest[2];
          const expected = expectedArray[2];
          assert.strictEqual(actual, expected);
        });
        it('should return the corresponding exptime as the fourth element in the array', () => {
          const actual = parsedRequest[3];
          const expected = expectedArray[3];
          assert.strictEqual(actual, expected);
        });
        it('should return the corresponding bytes as the fifth element in the array', () => {
          const actual = parsedRequest[4];
          const expected = expectedArray[4];
          assert.strictEqual(actual, expected);
        });
        it('should return the corresponding noreply value as the sixth element in the array', () => {
          const actual = parsedRequest[5];
          const expected = expectedArray[5];
          assert.strictEqual(actual, expected);
        });
      });
    });
    describe('empty string', () => {
      const data = stringToBuffer(EMPTY_SPACE);
      const parsedRequest = parse(data);
      describe('correct array length', () => {
        it('should return 1', () => {
          const actual = parsedRequest.length;
          const expected = 1;
          assert.strictEqual(actual, expected);
        });
      });
      describe('correct content of array', () => {
        it('should return an array containing only the empty space', () => {
          const actual = parsedRequest[0];
          const expected = EMPTY_SPACE;
          assert.strictEqual(actual, expected);
        });
      });
    });
  });
});
