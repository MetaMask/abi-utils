import { fromHex, toHex } from '../utils';
import { array, getArrayType } from './array';

describe('getArrayType', () => {
  it('returns the type of the array', () => {
    expect(getArrayType('uint256[]')).toBe('uint256');
    expect(getArrayType('uint256[][]')).toBe('uint256[]');
    expect(getArrayType('(uint256)[]')).toBe('(uint256)');
    expect(getArrayType('(uint256[])[]')).toBe('(uint256[])');
  });

  it('throws if a type is not an array type', () => {
    expect(() => getArrayType('uint256')).toThrow();
    expect(() => getArrayType('(uint256)')).toThrow();
  });
});

describe('array', () => {
  describe('isType', () => {
    it('checks if a type is a tuple type', () => {
      expect(array.isType?.('uint256[]')).toBe(true);
      expect(array.isType?.('uint256[][]')).toBe(true);

      expect(array.isType?.('uint256')).toBe(false);
      expect(array.isType?.('(uint256)')).toBe(false);
    });
  });

  describe('encode', () => {
    it('encodes an array', () => {
      expect(
        toHex(
          array.encode({
            type: 'uint256[]',
            value: [12n, 34n, 56n, 78n],
            buffer: new Uint8Array(),
          }),
        ),
      ).toBe(
        '0000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000220000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000004e',
      );
    });

    it('encodes a nested array', () => {
      expect(
        toHex(
          array.encode({
            type: 'uint256[][]',
            value: [
              [12n, 34n],
              [56n, 78n],
            ],
            buffer: new Uint8Array(),
          }),
        ),
      ).toBe(
        '0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000004e',
      );
    });
  });

  describe('decode', () => {
    it('decodes an encoded array', () => {
      const value = fromHex(
        '0000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000220000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000004e',
      );

      expect(
        array.decode({ type: 'uint256[]', value, skip: jest.fn() }),
      ).toStrictEqual([12n, 34n, 56n, 78n]);
    });

    it('decodes an encoded nested array', () => {
      const value = fromHex(
        '0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000004e',
      );

      expect(
        array.decode({ type: 'uint256[][]', value, skip: jest.fn() }),
      ).toStrictEqual([
        [12n, 34n],
        [56n, 78n],
      ]);
    });
  });
});
