import { bytesToHex, hexToBytes } from '@metamask/utils';
import { bool, getBooleanValue } from './bool';

describe('getBooleanValue', () => {
  it('returns a bigint for a boolean-like value', () => {
    expect(getBooleanValue(true)).toBe(BigInt(1));
    expect(getBooleanValue('true')).toBe(BigInt(1));

    expect(getBooleanValue(false)).toBe(BigInt(0));
    expect(getBooleanValue('false')).toBe(BigInt(0));
  });
});

describe('boolean', () => {
  describe('encode', () => {
    it('encodes a boolean', () => {
      expect(
        bytesToHex(
          bool.encode({ type: 'bool', value: true, buffer: new Uint8Array() }),
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
          }),
        ),
      ).toBe(
        '0x0000000000000000000000000000000000000000000000000000000000000001',
      );

      expect(
        bytesToHex(
          bool.encode({ type: 'bool', value: false, buffer: new Uint8Array() }),
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
