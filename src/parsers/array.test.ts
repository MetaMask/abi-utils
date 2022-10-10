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

  describe('getByteLength', () => {
    it('returns the byte length of an array', () => {
      expect(array.getByteLength('uint256[]')).toBe(32);
      expect(array.getByteLength('uint256[][]')).toBe(32);
      expect(array.getByteLength('(uint256)[]')).toBe(32);
      expect(array.getByteLength('(uint256[])[]')).toBe(32);
    });

    it('returns the byte length of a static array', () => {
      expect(array.getByteLength('uint256[2]')).toBe(64);
      expect(array.getByteLength('uint256[2][]')).toBe(32);
      expect(array.getByteLength('(uint256)[2]')).toBe(64);
      expect(array.getByteLength('(uint256[2])[]')).toBe(32);
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
            packed: false,
            tight: false,
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
            packed: false,
            tight: false,
          }),
        ),
      ).toBe(
        '0x0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000004e',
      );
    });

    it('encodes a packed string array', () => {
      expect(
        bytesToHex(
          array.encode({
            type: 'string[]',
            value: ['foo', 'bar', 'baz', 'qux'],
            buffer: new Uint8Array(),
            packed: true,
            tight: false,
          }),
        ),
      ).toBe('0x666f6f62617262617a717578');
    });

    it('encodes a packed number array', () => {
      expect(
        bytesToHex(
          array.encode({
            type: 'uint256[]',
            value: [BigInt(12), BigInt(34), BigInt(56), BigInt(78)],
            buffer: new Uint8Array(),
            packed: true,
            tight: false,
          }),
        ),
      ).toBe(
        '0x000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000220000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000004e',
      );
    });

    it('tightly encodes a packed number array', () => {
      expect(
        bytesToHex(
          array.encode({
            type: 'uint256[]',
            value: [BigInt(12), BigInt(34), BigInt(56), BigInt(78)],
            buffer: new Uint8Array(),
            packed: true,
            tight: true,
          }),
        ),
      ).toBe(
        '0x000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000220000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000004e',
      );
    });

    it('encodes a packed bytes1 array', () => {
      expect(
        bytesToHex(
          array.encode({
            type: 'bytes1[]',
            value: ['0x12', '0x34', '0x56', '0x78'],
            buffer: new Uint8Array(),
            packed: true,
            tight: false,
          }),
        ),
      ).toBe(
        '0x1200000000000000000000000000000000000000000000000000000000000000340000000000000000000000000000000000000000000000000000000000000056000000000000000000000000000000000000000000000000000000000000007800000000000000000000000000000000000000000000000000000000000000',
      );
    });

    it('tightly encodes a packed bytes1 array', () => {
      expect(
        bytesToHex(
          array.encode({
            type: 'bytes1[]',
            value: ['0x12', '0x34', '0x56', '0x78'],
            buffer: new Uint8Array(),
            packed: true,
            tight: true,
          }),
        ),
      ).toBe('0x12345678');
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
