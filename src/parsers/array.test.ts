import { bytesToHex, hexToBytes } from '@metamask/utils';
import { array, getArrayType } from './array';

describe('getArrayType', () => {
  it('returns the type of the array', () => {
    expect(getArrayType('uint256[]')).toStrictEqual(['uint256', undefined]);
    expect(getArrayType('uint256[][]')).toStrictEqual(['uint256[]', undefined]);
    expect(getArrayType('(uint256)[]')).toStrictEqual(['(uint256)', undefined]);
    expect(getArrayType('(uint256[])[]')).toStrictEqual([
      '(uint256[])',
      undefined,
    ]);
  });

  it('throws if a type is not an array type', () => {
    expect(() => getArrayType('uint256')).toThrow(
      'Invalid array type. Expected an array type, but received "uint256".',
    );

    expect(() => getArrayType('(uint256)')).toThrow(
      'Invalid array type. Expected an array type, but received "(uint256)".',
    );
  });
});

describe('array', () => {
  describe('isType', () => {
    it('checks if a type is a tuple type', () => {
      expect(array.isType('uint256[]')).toBe(true);
      expect(array.isType('uint256[][]')).toBe(true);

      expect(array.isType('uint256')).toBe(false);
      expect(array.isType('(uint256)')).toBe(false);
    });
  });

  describe('encode', () => {
    it('encodes an array', () => {
      expect(
        bytesToHex(
          array.encode({
            type: 'uint256[]',
            value: [BigInt(12), BigInt(34), BigInt(56), BigInt(78)],
            buffer: new Uint8Array(),
          }),
        ),
      ).toBe(
        '0x0000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000220000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000004e',
      );
    });

    it('encodes a nested array', () => {
      expect(
        bytesToHex(
          array.encode({
            type: 'uint256[][]',
            value: [
              [BigInt(12), BigInt(34)],
              [BigInt(56), BigInt(78)],
            ],
            buffer: new Uint8Array(),
          }),
        ),
      ).toBe(
        '0x0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000004e',
      );
    });
  });

  describe('decode', () => {
    it('decodes an encoded array', () => {
      const value = hexToBytes(
        '0000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000220000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000004e',
      );

      expect(
        array.decode({ type: 'uint256[]', value, skip: jest.fn() }),
      ).toStrictEqual([BigInt(12), BigInt(34), BigInt(56), BigInt(78)]);
    });

    it('decodes an encoded nested array', () => {
      const value = hexToBytes(
        '0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000004e',
      );

      expect(
        array.decode({ type: 'uint256[][]', value, skip: jest.fn() }),
      ).toStrictEqual([
        [BigInt(12), BigInt(34)],
        [BigInt(56), BigInt(78)],
      ]);
    });
  });
});
