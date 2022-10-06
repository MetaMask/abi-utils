import { add0x, bytesToHex, hexToBytes } from '@metamask/utils';
import { decode, encode } from './abi';
import { ABI_TEST_VECTORS } from './__fixtures__';
import { ParserError } from './errors';
import * as packer from './packer';

// This lets us mock the functions using `jest.spyOn`.
jest.mock('./packer', () => jest.requireActual('./packer'));

describe('encode', () => {
  it.each(ABI_TEST_VECTORS)('encodes values', ({ types, values, result }) => {
    expect(bytesToHex(encode(types, values))).toStrictEqual(add0x(result));
  });

  it('throws a parser error if the value cannot be encoded', () => {
    expect(() => encode(['uint256'], [{}])).toThrow(
      new ParserError(
        'Unable to encode value: Invalid number. Expected a valid number value, but received "[object Object]".',
      ),
    );
  });

  it('throws a parser error if an unknown error occurs', () => {
    jest.spyOn(packer, 'pack').mockImplementation(() => {
      throw new Error('foo');
    });

    expect(() => encode(['uint256'], [1])).toThrow(
      new ParserError('An unexpected error occurred: foo'),
    );
  });
});

describe('decode', () => {
  it.each(ABI_TEST_VECTORS)('decodes values', ({ types, values, result }) => {
    expect(decode(types, hexToBytes(add0x(result)))).toStrictEqual(values);
  });

  it('throws a parser error if the value cannot be decoded', () => {
    expect(() => decode(['uint256'], new Uint8Array())).toThrow(
      new ParserError(
        'Unable to decode value: The encoded value is invalid for the provided types. Reached end of buffer while attempting to parse "uint256".',
      ),
    );
  });

  it('throws a parser error if an unknown error occurs', () => {
    jest.spyOn(packer, 'unpack').mockImplementation(() => {
      throw new Error('foo');
    });

    expect(() => decode([], new Uint8Array())).toThrow(
      new ParserError('An unexpected error occurred: foo'),
    );
  });
});
