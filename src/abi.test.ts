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
});
