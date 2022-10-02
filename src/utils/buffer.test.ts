import { bytesToHex, hexToBytes } from '@metamask/utils';
import { padEnd, set } from './buffer';

describe('set', () => {
  it('sets a buffer in another buffer at a specific position', () => {
    expect(bytesToHex(set(hexToBytes('1234567890'), hexToBytes('00'), 2))).toBe(
      '0x1234007890',
    );
  });
});

describe('addPadding', () => {
  it('adds padding to a buffer up to the specified length', () => {
    expect(bytesToHex(padEnd(hexToBytes('1234')))).toBe(
      '0x1234000000000000000000000000000000000000000000000000000000000000',
    );

    expect(bytesToHex(padEnd(hexToBytes('1234'), 16))).toBe(
      '0x12340000000000000000000000000000',
    );
    expect(bytesToHex(padEnd(hexToBytes('1234'), 0))).toBe('0x1234');
  });
});
