import { iterate } from './iterator';
import { fromHex, toHex } from './utils';

describe('iterate', () => {
  it('iterates over a buffer and yields the chunks', () => {
    const buffer = fromHex('1234567890');
    const iterator = iterate(buffer, 1);

    expect(toHex(iterator.next().value.value)).toBe('1234567890');
    expect(toHex(iterator.next().value.value)).toBe('34567890');
    expect(toHex(iterator.next().value.value)).toBe('567890');
    expect(toHex(iterator.next().value.value)).toBe('7890');
    expect(toHex(iterator.next().value.value)).toBe('90');
  });

  it('can skip a number of bytes', () => {
    const buffer = fromHex('1234567890');
    const iterator = iterate(buffer, 1);

    const { value, skip } = iterator.next().value;
    expect(toHex(value)).toBe('1234567890');

    skip(1);

    expect(toHex(iterator.next().value.value)).toBe('567890');
  });

  it('throws if the specified number of bytes is invalid', () => {
    const buffer = fromHex('1234567890');
    const iterator = iterate(buffer, 3);

    const { skip } = iterator.next().value;
    expect(() => skip(1)).toThrow();
  });
});
