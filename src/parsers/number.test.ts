import { fromHex, toHex } from '../utils';
import { asNumber, isSigned, number } from './number';

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
    expect(asNumber(123)).toBe(123n);
    expect(asNumber('123')).toBe(123n);
    expect(asNumber('0x123')).toBe(291n);
  });
});

describe('number', () => {
  describe('isType', () => {
    it('checks if a type is a number type', () => {
      expect(number.isType?.('uint256')).toBe(true);
      expect(number.isType?.('uint128')).toBe(true);
      expect(number.isType?.('uint')).toBe(true);
      expect(number.isType?.('int256')).toBe(true);
      expect(number.isType?.('int128')).toBe(true);
      expect(number.isType?.('int')).toBe(true);

      expect(number.isType?.('string')).toBe(false);
      expect(number.isType?.('(uint256)')).toBe(false);
      expect(number.isType?.('uint256[]')).toBe(false);
    });
  });

  describe('encode', () => {
    it('encodes a unsigned number', () => {
      expect(
        toHex(
          number.encode({
            type: 'uint256',
            value: 314159n,
            buffer: new Uint8Array(),
          }),
        ),
      ).toBe(
        '000000000000000000000000000000000000000000000000000000000004cb2f',
      );

      expect(
        toHex(
          number.encode({
            type: 'uint256',
            value: 314159,
            buffer: new Uint8Array(),
          }),
        ),
      ).toBe(
        '000000000000000000000000000000000000000000000000000000000004cb2f',
      );

      expect(
        toHex(
          number.encode({
            type: 'uint256',
            value: '314159',
            buffer: new Uint8Array(),
          }),
        ),
      ).toBe(
        '000000000000000000000000000000000000000000000000000000000004cb2f',
      );

      expect(
        toHex(
          number.encode({
            type: 'uint256',
            value: '0x314159',
            buffer: new Uint8Array(),
          }),
        ),
      ).toBe(
        '0000000000000000000000000000000000000000000000000000000000314159',
      );
    });

    it('encodes a signed number', () => {
      expect(
        toHex(
          number.encode({
            type: 'int256',
            value: -314159n,
            buffer: new Uint8Array(),
          }),
        ),
      ).toBe(
        'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb34d1',
      );

      expect(
        toHex(
          number.encode({
            type: 'int256',
            value: -314159,
            buffer: new Uint8Array(),
          }),
        ),
      ).toBe(
        'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb34d1',
      );

      expect(
        toHex(
          number.encode({
            type: 'int256',
            value: '-314159',
            buffer: new Uint8Array(),
          }),
        ),
      ).toBe(
        'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb34d1',
      );
    });
  });

  describe('decode', () => {
    it('decodes an encoded unsigned number', () => {
      const value = fromHex(
        '000000000000000000000000000000000000000000000000000000000004cb2f',
      );
      expect(number.decode({ type: 'uint256', value, skip: jest.fn() })).toBe(
        314159n,
      );
    });

    it('decodes an encoded signed number', () => {
      const value = fromHex(
        '000000000000000000000000000000000000000000000000000000000004cb2f',
      );
      expect(number.decode({ type: 'int256', value, skip: jest.fn() })).toBe(
        314159n,
      );

      const negativeValue = fromHex(
        'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb34d1',
      );
      expect(
        number.decode({
          type: 'int256',
          value: negativeValue,
          skip: jest.fn(),
        }),
      ).toBe(-314159n);
    });
  });
});
