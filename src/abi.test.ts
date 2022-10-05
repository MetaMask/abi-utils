import { add0x, bytesToHex, hexToBytes } from '@metamask/utils';
import { decode, encode } from './abi';
import { ABI_TEST_VECTORS } from './__fixtures__';

describe('encode', () => {
  it.each(ABI_TEST_VECTORS)('encodes values', ({ types, values, result }) => {
    expect(bytesToHex(encode(types, values))).toStrictEqual(add0x(result));
  });
});

describe('decode', () => {
  it.each(ABI_TEST_VECTORS)('decodes values', ({ types, values, result }) => {
    expect(decode(types, hexToBytes(add0x(result)))).toStrictEqual(values);
  });
});
