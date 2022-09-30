import { fromHex, toHex } from '../utils';
import { address } from './address';

describe('address', () => {
  describe('encode', () => {
    it('encodes an address', () => {
      expect(
        toHex(
          address.encode({
            type: 'address',
            buffer: new Uint8Array(),
            value: '0x4bbeeb066ed09b7aed07bf39eee0460dfa261520'
          })
        )
      ).toBe('0000000000000000000000004bbeeb066ed09b7aed07bf39eee0460dfa261520');
    });
  });

  describe('decode', () => {
    it('decodes an encoded address', () => {
      const value = fromHex('0000000000000000000000004bbeeb066ed09b7aed07bf39eee0460dfa261520');
      expect(address.decode({ type: 'address', value, skip: jest.fn() })).toBe(
        '0x4bbeeb066ed09b7aed07bf39eee0460dfa261520'
      );
    });
  });
});
