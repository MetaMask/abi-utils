import { add0x, bytesToHex, hexToBytes } from '@metamask/utils';
import { keccak_256 as keccak256 } from '@noble/hashes/sha3';

import { ABI_TEST_VECTORS, PACKED_ABI_TEST_VECTORS } from './__fixtures__';
import {
  decode,
  decodeSingle,
  encode,
  encodePacked,
  encodeSingle,
} from './abi';
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

describe('encodeSingle', () => {
  it('encodes a single value', () => {
    expect(bytesToHex(encodeSingle('uint256', 42))).toBe(
      '0x000000000000000000000000000000000000000000000000000000000000002a',
    );
  });
});

describe('encodePacked', () => {
  it.each(PACKED_ABI_TEST_VECTORS)(
    'encodes values in packed mode',
    ({ types, values, result }) => {
      const bytes = encodePacked(types, values);
      expect(bytesToHex(keccak256(bytes))).toStrictEqual(result);
    },
  );
});

describe('decode', () => {
  it.each(ABI_TEST_VECTORS)('decodes values', ({ types, values, result }) => {
    expect(decode(types, hexToBytes(add0x(result)))).toStrictEqual(values);
  });

  it('decodes hexadecimal strings', () => {
    expect(
      decode(
        ['uint256'],
        '0x000000000000000000000000000000000000000000000000000000000000002a',
      ),
    ).toStrictEqual([BigInt(42)]);
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

describe('decodeSingle', () => {
  it('decodes a single value', () => {
    expect(
      decodeSingle(
        'uint256',
        '0x000000000000000000000000000000000000000000000000000000000000002a',
      ),
    ).toStrictEqual(BigInt(42));
  });
});
