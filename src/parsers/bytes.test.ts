import { bytesToHex, hexToBytes } from '@metamask/utils';

import { bytes } from './bytes';

describe('bytes', () => {
  describe('isType', () => {
    it('checks if a type is a bytes type', () => {
      expect(bytes.isType('bytes')).toBe(true);
      expect(bytes.isType('bytes[]')).toBe(false);
      expect(bytes.isType('bytes[2]')).toBe(false);
      expect(bytes.isType('uint256')).toBe(false);
      expect(bytes.isType('bytes32')).toBe(false);
    });
  });

  describe('getByteLength', () => {
    it('returns 32', () => {
      expect(bytes.getByteLength('bytes')).toBe(32);
    });
  });

  describe('encode', () => {
    it('encodes bytes', () => {
      expect(
        bytesToHex(
          bytes.encode({
            type: 'bytes',
            value: '0xab',
            buffer: new Uint8Array(),
            packed: false,
            tight: false,
          }),
        ),
      ).toBe(
        '0x0000000000000000000000000000000000000000000000000000000000000001ab00000000000000000000000000000000000000000000000000000000000000',
      );
    });
  });

  describe('decode', () => {
    it('decodes encoded bytes', () => {
      const value = hexToBytes(
        '0x0000000000000000000000000000000000000000000000000000000000000001ab00000000000000000000000000000000000000000000000000000000000000',
      );

      expect(
        bytesToHex(bytes.decode({ type: 'bytes', value, skip: jest.fn() })),
      ).toBe('0xab');
    });
  });
});
