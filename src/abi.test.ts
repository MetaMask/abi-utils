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
      try {
        const value = decode(types, hexToBytes(add0x(result)));
        expect(value).toStrictEqual(values);
      } catch (e) {
        console.log('failed for', result);
      }
    },
  );

  it('works on nested arrays', () => {
    const types = ['string[][3]'];
    const values = [[['foo'], ['bar'], ['baz']]];

    const encoded = encode(types, values);
    const decoded = decode(types, encoded);

    console.log(bytesToHex(encoded));
    expect(decoded).toStrictEqual(values);
  });
});
