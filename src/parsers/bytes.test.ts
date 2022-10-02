import { bytesToHex, hexToBytes } from '@metamask/utils';
import { bytes } from './bytes';

describe('bytes', () => {
  describe('encode', () => {
    it('encodes bytes', () => {
      expect(
        bytesToHex(
          bytes.encode({
            type: 'bytes',
            value: '0xab',
            buffer: new Uint8Array(),
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
