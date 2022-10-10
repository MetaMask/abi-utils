import { bytesToHex, hexToBytes } from '@metamask/utils';
import { fn, getFunction } from './function';

describe('getFunction', () => {
  it('returns an encoded function for a function-like input', () => {
    expect(
      bytesToHex(
        getFunction({
          address: '0x6b175474e89094c44da98b954eedeac495271d0f',
          selector: '0x70a08231',
        }),
      ),
    ).toBe('0x6b175474e89094c44da98b954eedeac495271d0f70a08231');

    expect(
      bytesToHex(
        getFunction('0x6b175474e89094c44da98b954eedeac495271d0f70a08231'),
      ),
    ).toBe('0x6b175474e89094c44da98b954eedeac495271d0f70a08231');
  });
});

describe('function', () => {
  describe('getByteLength', () => {
    it('returns 32', () => {
      expect(fn.getByteLength('function')).toBe(32);
    });
  });

  describe('encode', () => {
    it('encodes a function', () => {
      expect(
        bytesToHex(
          fn.encode({
            type: 'function',
            value: '0x6b175474e89094c44da98b954eedeac495271d0f70a08231',
            buffer: new Uint8Array(),
            packed: false,
            tight: false,
          }),
        ),
      ).toBe(
        '0x6b175474e89094c44da98b954eedeac495271d0f70a082310000000000000000',
      );

      expect(
        bytesToHex(
          fn.encode({
            type: 'function',
            value: {
              address: '0x6b175474e89094c44da98b954eedeac495271d0f',
              selector: '0x70a08231',
            },
            buffer: new Uint8Array(),
            packed: false,
            tight: false,
          }),
        ),
      ).toBe(
        '0x6b175474e89094c44da98b954eedeac495271d0f70a082310000000000000000',
      );
    });
  });

  describe('decode', () => {
    it('decodes an encoded function', () => {
      const value = hexToBytes(
        '6b175474e89094c44da98b954eedeac495271d0f70a082310000000000000000',
      );

      expect(
        fn.decode({ type: 'function', value, skip: jest.fn() }),
      ).toStrictEqual({
        address: '0x6b175474e89094c44da98b954eedeac495271d0f',
        selector: '0x70a08231',
      });
    });
  });
});
