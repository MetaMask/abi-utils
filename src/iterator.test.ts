import { bytesToHex, hexToBytes } from '@metamask/utils';

import { iterate } from './iterator';

describe('iterate', () => {
  it('iterates over a buffer and yields the chunks', () => {
    const bytes = hexToBytes('1234567890');
    const iterator = iterate(bytes, 1);

    expect(bytesToHex(iterator.next().value.value)).toBe('0x1234567890');
    expect(bytesToHex(iterator.next().value.value)).toBe('0x34567890');
    expect(bytesToHex(iterator.next().value.value)).toBe('0x567890');
    expect(bytesToHex(iterator.next().value.value)).toBe('0x7890');
    expect(bytesToHex(iterator.next().value.value)).toBe('0x90');

    const { value, done } = iterator.next();
    expect(done).toBe(true);
    expect(value.skip(1)).toBeUndefined();
  });

  it('can skip a number of bytes', () => {
    const buffer = hexToBytes('1234567890');
    const iterator = iterate(buffer, 1);

    const { value, skip } = iterator.next().value;
    expect(bytesToHex(value)).toBe('0x1234567890');

    skip(1);

    expect(bytesToHex(iterator.next().value.value)).toBe('0x567890');
  });

  it('throws if the specified number of bytes is invalid', () => {
    const buffer = hexToBytes('1234567890');
    const iterator = iterate(buffer, 3);

    const { skip } = iterator.next().value;
    expect(() => skip(1)).toThrow('Length must be a multiple of the size.');
  });
});
