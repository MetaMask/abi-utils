import { bytesToHex, hexToBytes } from '@metamask/utils';
import { getParser, isDynamicParser, pack, unpack } from './packer';
import { array, number, string, tuple } from './parsers';

describe('getParser', () => {
  it('returns a parser for the specified type', () => {
    expect(getParser('uint256[]')).toBe(array);
    expect(getParser('(uint256)')).toBe(tuple);
    expect(getParser('uint256')).toBe(number);
    expect(getParser('uint')).toBe(number);
    expect(getParser('string')).toBe(string);
  });

  it('throws for invalid types', () => {
    expect(() => getParser('foo')).toThrow('The type "foo" is not supported.');
  });
});

describe('isDynamicParser', () => {
  it('checks if a parser is dynamic based on the type', () => {
    expect(isDynamicParser(tuple, '(uint256,string)')).toBe(true);
    expect(isDynamicParser(string, 'string')).toBe(true);
    expect(isDynamicParser(array, 'string[]')).toBe(true);

    expect(isDynamicParser(tuple, '(uint256)')).toBe(false);
    expect(isDynamicParser(number, 'uint256')).toBe(false);
    expect(isDynamicParser(number, 'bytes32')).toBe(false);
  });
});

describe('pack', () => {
  it('encodes a buffer using the specified types', () => {
    expect(bytesToHex(pack(['string[]'], [['foo bar', 'baz qux']]))).toBe(
      '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000007666f6f2062617200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000762617a2071757800000000000000000000000000000000000000000000000000',
    );

    expect(
      bytesToHex(pack(['uint256', 'uint256'], [BigInt(32), BigInt(2)])),
    ).toBe(
      '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002',
    );
  });
});

describe('unpack', () => {
  it('decodes a buffer using the specified types', () => {
    const buffer = hexToBytes(
      '00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000007666f6f2062617200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000762617a2071757800000000000000000000000000000000000000000000000000',
    );

    expect(unpack(['string[]'], buffer)).toStrictEqual([
      ['foo bar', 'baz qux'],
    ]);

    expect(unpack(['uint256', 'uint256'], buffer)).toStrictEqual([
      BigInt(32),
      BigInt(2),
    ]);
  });

  it('throws if the buffer is out of range', () => {
    const buffer = hexToBytes(
      '0000000000000000000000000000000000000000000000000000000000000020',
    );

    expect(() => unpack(['uint256', 'uint256'], buffer)).toThrow(
      'The encoded value is invalid for the provided types. Reached end of buffer while attempting to parse "uint256".',
    );
  });
});
