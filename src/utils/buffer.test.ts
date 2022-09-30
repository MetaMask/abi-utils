import { TextDecoder, TextEncoder } from 'util';
import {
  addPadding,
  concat,
  fromHex,
  fromUtf8,
  getTextDecoder,
  getTextEncoder,
  set,
  stripPrefix,
  toBuffer,
  toHex,
  toNumber,
  toUtf8,
} from './buffer';

describe('stripHexPrefix', () => {
  it('removes the hex prefix of a hex string', () => {
    expect(stripPrefix('0x12345')).toBe('12345');
    expect(stripPrefix('12345')).toBe('12345');
  });
});

describe('getTextEncoder', () => {
  it('returns a text encoder that works in Node.js and browsers', () => {
    expect(getTextEncoder()).toBeInstanceOf(TextEncoder);
  });
});

describe('getTextDecoder', () => {
  it('returns a text decoder that works in Node.js and browsers', () => {
    expect(getTextDecoder()).toBeInstanceOf(TextDecoder);
  });
});

describe('toUtf8', () => {
  it('returns a UTF-8 string from a buffer', () => {
    expect(toUtf8(fromHex('666f6f206261722062617a'))).toBe('foo bar baz');
  });
});

describe('fromUtf8', () => {
  it('returns a buffer from a UTF-8 string', () => {
    expect(toHex(fromUtf8('foo bar baz'))).toBe('666f6f206261722062617a');
  });
});

describe('toHex', () => {
  it('returns a hex string from a buffer', () => {
    const buffer = fromHex('666f6f206261722062617a');
    expect(toHex(buffer)).toBe('666f6f206261722062617a');
  });
});

describe('fromHex', () => {
  it('returns a buffer from a hex string', () => {
    expect(fromHex('666f6f206261722062617a')).toBeInstanceOf(Uint8Array);
    expect(toHex(fromHex('666f6f206261722062617a'))).toBe(
      '666f6f206261722062617a',
    );
  });

  it('works with a 0x prefix', () => {
    expect(toHex(fromHex('0x666f6f206261722062617a'))).toBe(
      '666f6f206261722062617a',
    );
  });

  it('throws for invalid input', () => {
    expect(() => fromHex('0')).toThrow();
    expect(() => fromHex('foo bar')).toThrow();
  });
});

describe('toBuffer', () => {
  it('returns a buffer from different types', () => {
    expect(toHex(toBuffer('0x1234'))).toBe('1234');
    expect(toHex(toBuffer('1234'))).toBe('1234');
    expect(toHex(toBuffer(1234))).toBe(
      '00000000000000000000000000000000000000000000000000000000000004d2',
    );

    expect(toHex(toBuffer(1234n))).toBe(
      '00000000000000000000000000000000000000000000000000000000000004d2',
    );
    expect(toHex(toBuffer([0x04, 0xd2]))).toBe('04d2');
  });
});

describe('concat', () => {
  it('concatenates multiple buffers', () => {
    expect(toHex(concat([fromHex('1234')]))).toBe('1234');
    expect(toHex(concat([fromHex('1234'), fromHex('5678')]))).toBe('12345678');
    expect(
      toHex(concat([fromHex('1234'), fromHex('5678'), fromHex('9101')])),
    ).toBe('123456789101');
  });
});

describe('set', () => {
  it('sets a buffer in another buffer at a specific position', () => {
    expect(toHex(set(fromHex('1234567890'), fromHex('00'), 2))).toBe(
      '1234007890',
    );
  });
});

describe('addPadding', () => {
  it('adds padding to a buffer up to the specified length', () => {
    expect(toHex(addPadding(fromHex('1234')))).toBe(
      '1234000000000000000000000000000000000000000000000000000000000000',
    );

    expect(toHex(addPadding(fromHex('1234'), 16))).toBe(
      '12340000000000000000000000000000',
    );
    expect(toHex(addPadding(fromHex('1234'), 0))).toBe('1234');
  });
});

describe('toNumber', () => {
  it('returns a bigint from a buffer', () => {
    const buffer = toBuffer(1234n);
    expect(toNumber(buffer)).toBe(1234n);
  });
});
