import { fromHex, toHex } from '../utils';
import { bytes } from './bytes';

describe('bytes', () => {
  describe('encode', () => {
    it('encodes bytes', () => {
      expect(
        toHex(
          bytes.encode({
            type: 'bytes',
            value: 'ab',
            buffer: new Uint8Array(),
          }),
        ),
      ).toBe(
        '0000000000000000000000000000000000000000000000000000000000000001ab00000000000000000000000000000000000000000000000000000000000000',
      );
    });
  });

  describe('decode', () => {
    it('decodes encoded bytes', () => {
      const value = fromHex(
        '0000000000000000000000000000000000000000000000000000000000000001ab00000000000000000000000000000000000000000000000000000000000000',
      );
      expect(
        toHex(bytes.decode({ type: 'bytes', value, skip: jest.fn() })),
      ).toBe('ab');
    });
  });
});
