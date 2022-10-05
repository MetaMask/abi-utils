import { add0x, bytesToHex, hexToBytes } from '@metamask/utils';
import { decode, encode } from './abi';
import { ABI_DECODE_FIXTURES, ABI_ENCODE_FIXTURES } from './__fixtures__/abi';

describe('encode', () => {
  it.each(ABI_ENCODE_FIXTURES)(
    'encodes values',
    ({ types, values, result }) => {
      expect(bytesToHex(encode(types, values))).toStrictEqual(add0x(result));
    },
  );
});

describe('decode', () => {
  it.each(ABI_DECODE_FIXTURES)(
    'decodes values',
    ({ types, values, result }) => {
      expect(decode(types, hexToBytes(add0x(result)))).toStrictEqual(values);
    },
  );

  it('works on nested values', () => {
    const types = ['(uint256,uint256[2][1])[2]', 'uint256', 'uint256'];
    const values = [
      [
        [BigInt(1), [[BigInt(2), BigInt(3)]]],
        [BigInt(4), [[BigInt(5), BigInt(6)]]],
      ],
      BigInt(7),
      BigInt(8),
    ];

    const encoded = encode(types, values);
    const decoded = decode(types, encoded);

    console.log(bytesToHex(encoded));
    expect(decoded).toStrictEqual(values);
  });
});
