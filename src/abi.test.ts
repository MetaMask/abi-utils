import { decode, encode } from './abi';
import { fromHex, toHex } from './utils';

describe('encode', () => {
  it('encodes static values', () => {
    expect(
      toHex(
        encode(
          ['uint256', 'address'],
          [12345n, '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520'],
        ),
      ),
    ).toBe(
      '00000000000000000000000000000000000000000000000000000000000030390000000000000000000000004bbeeb066ed09b7aed07bf39eee0460dfa261520',
    );
  });

  it('encodes static array values', () => {
    expect(
      toHex(
        encode(
          ['(uint256, address)[]'],
          [[[12345n, '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520']]],
        ),
      ),
    ).toBe(
      '0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000030390000000000000000000000004bbeeb066ed09b7aed07bf39eee0460dfa261520',
    );
  });

  it('encodes dynamic array values', () => {
    expect(
      toHex(
        encode(
          ['(string, string)[]'],
          [
            [
              ['foo bar', 'baz qux'],
              ['quux quuz', 'corge grault'],
            ],
          ],
        ),
      ),
    ).toBe(
      '0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000007666f6f2062617200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000762617a207175780000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000971757578207175757a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c636f72676520677261756c740000000000000000000000000000000000000000',
    );
  });

  it('encodes dynamic tuple values', () => {
    expect(
      toHex(
        encode(['(string, uint256, string)'], [['foo bar', 12n, 'baz qux']]),
      ),
    ).toBe(
      '00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000007666f6f2062617200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000762617a2071757800000000000000000000000000000000000000000000000000',
    );
  });
});

describe('decode', () => {
  it('decodes static values', () => {
    expect(
      decode(
        ['uint256', 'address'],
        fromHex(
          '00000000000000000000000000000000000000000000000000000000000030390000000000000000000000004bbeeb066ed09b7aed07bf39eee0460dfa261520',
        ),
      ),
    ).toStrictEqual([12345n, '0x4bbeeb066ed09b7aed07bf39eee0460dfa261520']);
  });

  it('decodes static array values', () => {
    const value = fromHex(
      '0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000030390000000000000000000000004bbeeb066ed09b7aed07bf39eee0460dfa261520',
    );

    expect(decode(['(uint256, address)[]'], value)).toStrictEqual([
      [[12345n, '0x4bbeeb066ed09b7aed07bf39eee0460dfa261520']],
    ]);
  });

  it('decodes dynamic array values', () => {
    const value = fromHex(
      '0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000007666f6f2062617200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000762617a207175780000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000971757578207175757a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c636f72676520677261756c740000000000000000000000000000000000000000',
    );
    expect(decode(['(string, string)[]'], value)).toStrictEqual([
      [
        ['foo bar', 'baz qux'],
        ['quux quuz', 'corge grault'],
      ],
    ]);
  });

  it('decodes dynamic tuple values', () => {
    const value = fromHex(
      '00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000007666f6f2062617200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000762617a2071757800000000000000000000000000000000000000000000000000',
    );
    expect(decode(['(string, uint256, string)'], value)).toStrictEqual([
      ['foo bar', 12n, 'baz qux'],
    ]);
  });
});
