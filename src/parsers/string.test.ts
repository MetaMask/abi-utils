import { bytesToHex, hexToBytes } from '@metamask/utils';
import { string } from './string';

describe('string', () => {
  describe('encode', () => {
    it('encodes a string', () => {
      expect(
        bytesToHex(
          string.encode({
            type: 'string',
            value: 'foo bar baz qux',
            buffer: new Uint8Array(),
          }),
        ),
      ).toBe(
        '0x000000000000000000000000000000000000000000000000000000000000000f666f6f206261722062617a207175780000000000000000000000000000000000',
      );
    });
  });

  describe('decode', () => {
    it('decodes an encoded string', () => {
      const value = hexToBytes(
        '000000000000000000000000000000000000000000000000000000000000000f666f6f206261722062617a207175780000000000000000000000000000000000',
      );

      expect(string.decode({ type: 'string', value, skip: jest.fn() })).toBe(
        'foo bar baz qux',
      );
    });
  });
});
