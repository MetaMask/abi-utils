import { fromHex, toHex } from '../utils';
import { bool, getBooleanValue } from './bool';

describe('getBooleanValue', () => {
  it('returns a bigint for a boolean-like value', () => {
    expect(getBooleanValue(true)).toBe(1n);
    expect(getBooleanValue('true')).toBe(1n);
    expect(getBooleanValue('yes')).toBe(1n);

    expect(getBooleanValue(false)).toBe(0n);
    expect(getBooleanValue('false')).toBe(0n);
    expect(getBooleanValue('no')).toBe(0n);

    // @ts-expect-error Invalid input
    expect(getBooleanValue('foo bar')).toBe(0n);
  });
});

describe('boolean', () => {
  describe('encode', () => {
    it('encodes a boolean', () => {
      expect(toHex(bool.encode({ type: 'bool', value: true, buffer: new Uint8Array() }))).toBe(
        '0000000000000000000000000000000000000000000000000000000000000001'
      );
      expect(toHex(bool.encode({ type: 'bool', value: 'true', buffer: new Uint8Array() }))).toBe(
        '0000000000000000000000000000000000000000000000000000000000000001'
      );

      expect(toHex(bool.encode({ type: 'bool', value: false, buffer: new Uint8Array() }))).toBe(
        '0000000000000000000000000000000000000000000000000000000000000000'
      );
      expect(toHex(bool.encode({ type: 'bool', value: 'false', buffer: new Uint8Array() }))).toBe(
        '0000000000000000000000000000000000000000000000000000000000000000'
      );
    });
  });

  describe('decode', () => {
    it('decodes an encoded boolean', () => {
      const trueValue = fromHex('0000000000000000000000000000000000000000000000000000000000000001');
      expect(bool.decode({ type: 'bool', value: trueValue, skip: jest.fn() })).toBe(true);

      const falseValue = fromHex('0000000000000000000000000000000000000000000000000000000000000000');
      expect(bool.decode({ type: 'bool', value: falseValue, skip: jest.fn() })).toBe(false);
    });
  });
});
