import { bytesToHex, hexToBytes } from '@metamask/utils';

import { bool, getBooleanValue } from './bool';

describe('getBooleanValue', () => {
  it('returns a bigint for a boolean-like value', () => {
    expect(getBooleanValue(true)).toBe(BigInt(1));
    expect(getBooleanValue('true')).toBe(BigInt(1));

    expect(getBooleanValue(false)).toBe(BigInt(0));
    expect(getBooleanValue('false')).toBe(BigInt(0));
  });

  it.each([null, undefined, 0, 1, '0', '1', 'foo', [], {}, NaN, Infinity])(
    'throws if the value is invalid',
    (value) => {
      // @ts-expect-error Invalid type.
      expect(() => getBooleanValue(value)).toThrow(
        `Invalid boolean value. Expected a boolean literal, or the string "true" or "false", but received "${value}".`,
      );
    },
  );
});

describe('boolean', () => {
  describe('getByteLength', () => {
    it('returns 32', () => {
      expect(bool.getByteLength('bool')).toBe(32);
    });
  });

  describe('encode', () => {
    it('encodes a boolean', () => {
      expect(
        bytesToHex(
          bool.encode({
            type: 'bool',
            value: true,
            buffer: new Uint8Array(),
            packed: false,
            tight: false,
          }),
        ),
      ).toBe(
        '0x0000000000000000000000000000000000000000000000000000000000000001',
      );

      expect(
        bytesToHex(
          bool.encode({
            type: 'bool',
            value: 'true',
            buffer: new Uint8Array(),
            packed: false,
            tight: false,
          }),
        ),
      ).toBe(
        '0x0000000000000000000000000000000000000000000000000000000000000001',
      );

      expect(
        bytesToHex(
          bool.encode({
            type: 'bool',
            value: false,
            buffer: new Uint8Array(),
            packed: false,
            tight: false,
          }),
        ),
      ).toBe(
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      );

      expect(
        bytesToHex(
          bool.encode({
            type: 'bool',
            value: 'false',
            buffer: new Uint8Array(),
            packed: false,
            tight: false,
          }),
        ),
      ).toBe(
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      );
    });
  });

  describe('decode', () => {
    it('decodes an encoded boolean', () => {
      const trueValue = hexToBytes(
        '0000000000000000000000000000000000000000000000000000000000000001',
      );
      expect(
        bool.decode({ type: 'bool', value: trueValue, skip: jest.fn() }),
      ).toBe(true);

      const falseValue = hexToBytes(
        '0000000000000000000000000000000000000000000000000000000000000000',
      );
      expect(
        bool.decode({ type: 'bool', value: falseValue, skip: jest.fn() }),
      ).toBe(false);
    });
  });
});
