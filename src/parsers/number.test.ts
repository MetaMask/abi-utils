import { bytesToHex, hexToBytes } from '@metamask/utils';
import { asBigInt, isSigned, number } from './number';

describe('isSigned', () => {
  it('checks if a number type is signed', () => {
    expect(isSigned('int')).toBe(true);
    expect(isSigned('int256')).toBe(true);
    expect(isSigned('int123')).toBe(true);

    expect(isSigned('uint')).toBe(false);
    expect(isSigned('uint256')).toBe(false);
    expect(isSigned('uint123')).toBe(false);
  });
});

describe('asNumber', () => {
  it('returns a bigint for a number-like input', () => {
    expect(asBigInt(123)).toBe(BigInt(123));
    expect(asBigInt('123')).toBe(BigInt(123));
    expect(asBigInt('0x123')).toBe(BigInt(291));
  });
});

describe('number', () => {
  describe('isType', () => {
    it('checks if a type is a number type', () => {
      expect(number.isType('uint256')).toBe(true);
      expect(number.isType('uint128')).toBe(true);
      expect(number.isType('uint')).toBe(true);
      expect(number.isType('int256')).toBe(true);
      expect(number.isType('int128')).toBe(true);
      expect(number.isType('int')).toBe(true);

      expect(number.isType('string')).toBe(false);
      expect(number.isType('(uint256)')).toBe(false);
      expect(number.isType('uint256[]')).toBe(false);
    });
  });

  describe('encode', () => {
    it('encodes a unsigned number', () => {
      expect(
        bytesToHex(
          number.encode({
            type: 'uint256',
            value: BigInt(314159),
            buffer: new Uint8Array(),
          }),
        ),
      ).toBe(
        '0x000000000000000000000000000000000000000000000000000000000004cb2f',
      );

      expect(
        bytesToHex(
          number.encode({
            type: 'uint256',
            value: 314159,
            buffer: new Uint8Array(),
          }),
        ),
      ).toBe(
        '0x000000000000000000000000000000000000000000000000000000000004cb2f',
      );

      expect(
        bytesToHex(
          number.encode({
            type: 'uint256',
            value: '314159',
            buffer: new Uint8Array(),
          }),
        ),
      ).toBe(
        '0x000000000000000000000000000000000000000000000000000000000004cb2f',
      );

      expect(
        bytesToHex(
          number.encode({
            type: 'uint256',
            value: '0x314159',
            buffer: new Uint8Array(),
          }),
        ),
      ).toBe(
        '0x0000000000000000000000000000000000000000000000000000000000314159',
      );
    });

    it('encodes a signed number', () => {
      expect(
        bytesToHex(
          number.encode({
            type: 'int256',
            value: BigInt(-314159),
            buffer: new Uint8Array(),
          }),
        ),
      ).toBe(
        '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb34d1',
      );

      expect(
        bytesToHex(
          number.encode({
            type: 'int256',
            value: -314159,
            buffer: new Uint8Array(),
          }),
        ),
      ).toBe(
        '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb34d1',
      );

      expect(
        bytesToHex(
          number.encode({
            type: 'int256',
            value: '-314159',
            buffer: new Uint8Array(),
          }),
        ),
      ).toBe(
        '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb34d1',
      );
    });
  });

  describe('decode', () => {
    it('decodes an encoded unsigned number', () => {
      const value = hexToBytes(
        '000000000000000000000000000000000000000000000000000000000004cb2f',
      );

      expect(number.decode({ type: 'uint256', value, skip: jest.fn() })).toBe(
        BigInt(314159),
      );
    });

    it('decodes an encoded signed number', () => {
      const value = hexToBytes(
        '000000000000000000000000000000000000000000000000000000000004cb2f',
      );
      expect(number.decode({ type: 'int256', value, skip: jest.fn() })).toBe(
        BigInt(314159),
      );

      const negativeValue = hexToBytes(
        'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb34d1',
      );

      expect(
        number.decode({
          type: 'int256',
          value: negativeValue,
          skip: jest.fn(),
        }),
      ).toBe(BigInt(-314159));
    });
  });
});
