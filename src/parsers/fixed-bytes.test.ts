import { fromHex, toHex } from '../utils';
import { fixedBytes, getByteLength } from './fixed-bytes';

describe('getByteLength', () => {
  it('returns the byte length for a type', () => {
    expect(getByteLength('bytes32')).toBe(32);
    expect(getByteLength('bytes16')).toBe(16);
    expect(getByteLength('bytes1')).toBe(1);
  });

  it('throws an error if the length is invalid', () => {
    expect(() => getByteLength('bytes64')).toThrow();
    expect(() => getByteLength('bytes0')).toThrow();
    expect(() => getByteLength('bytes')).toThrow();
  });
});

describe('fixed-bytes', () => {
  describe('isType', () => {
    it('checks if a type is a fixed bytes type', () => {
      expect(fixedBytes.isType?.('bytes32')).toBe(true);
      expect(fixedBytes.isType?.('bytes16')).toBe(true);
      expect(fixedBytes.isType?.('bytes1')).toBe(true);

      expect(fixedBytes.isType?.('bytes')).toBe(false);
      expect(fixedBytes.isType?.('bytes32[]')).toBe(false);
      expect(fixedBytes.isType?.('(bytes32)')).toBe(false);
    });
  });

  describe('encode', () => {
    it('encodes fixed bytes', () => {
      expect(
        toHex(
          fixedBytes.encode({
            type: 'bytes32',
            value: 'abcdef1234567890000000000000000000000000000000000000000000000000',
            buffer: new Uint8Array()
          })
        )
      ).toBe('abcdef1234567890000000000000000000000000000000000000000000000000');
    });

    it('throws if the length is invalid', () => {
      expect(() =>
        fixedBytes.encode({ type: 'bytes32', value: 'abcdef123456789', buffer: new Uint8Array() })
      ).toThrow();
    });
  });

  describe('decode', () => {
    it('decodes encoded fixed bytes', () => {
      const value = fromHex('abcdef1234567890000000000000000000000000000000000000000000000000');
      expect(toHex(fixedBytes.decode({ type: 'bytes32', value, skip: jest.fn() }))).toBe(
        'abcdef1234567890000000000000000000000000000000000000000000000000'
      );
    });
  });
});
