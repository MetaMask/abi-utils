import { bytesToHex, hexToBytes } from '@metamask/utils';
import { address } from './address';

describe('address', () => {
  describe('getByteLength', () => {
    it('returns 32', () => {
      expect(address.getByteLength('address')).toBe(32);
    });
  });

  describe('encode', () => {
    it('encodes an address', () => {
      expect(
        bytesToHex(
          address.encode({
            type: 'address',
            buffer: new Uint8Array(),
            value: '0x4bbeeb066ed09b7aed07bf39eee0460dfa261520',
            packed: false,
            tight: false,
          }),
        ),
      ).toBe(
        '0x0000000000000000000000004bbeeb066ed09b7aed07bf39eee0460dfa261520',
      );
    });

    it('encodes a short address', () => {
      expect(
        bytesToHex(
          address.encode({
            type: 'address',
            buffer: new Uint8Array(),
            value: '0x4bbeeb',
            packed: false,
            tight: false,
          }),
        ),
      ).toBe(
        '0x00000000000000000000000000000000000000000000000000000000004bbeeb',
      );
    });
  });

  describe('decode', () => {
    it('decodes an encoded address', () => {
      const value = hexToBytes(
        '0000000000000000000000004bbeeb066ed09b7aed07bf39eee0460dfa261520',
      );

      expect(address.decode({ type: 'address', value, skip: jest.fn() })).toBe(
        '0x4bbeeb066ed09b7aed07bf39eee0460dfa261520',
      );
    });
  });
});
