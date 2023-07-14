import {
  assert,
  bigIntToBytes,
  bytesToBigInt,
  bytesToSignedBigInt,
  concatBytes,
  createBigInt,
  NumberLike,
  signedBigIntToBytes,
} from '@metamask/utils';

import { DecodeArgs, Parser } from './parser';
import { ParserError } from '../errors';
import { padStart } from '../utils';

const NUMBER_REGEX = /^u?int(?<length>[0-9]*)?$/u;

/**
 * Check if a number type is signed.
 *
 * @param type - The type to check.
 * @returns Whether the type is signed.
 */
export const isSigned = (type: string): boolean => {
  return !type.startsWith('u');
};

/**
 * Get the length of the specified type. If a length is not specified, if the
 * length is out of range (8 <= n <= 256), or if the length is not a multiple of
 * 8, this will throw an error.
 *
 * @param type - The type to get the length for.
 * @returns The bit length of the type.
 */
export const getLength = (type: string): number => {
  if (type === 'int' || type === 'uint') {
    return 256;
  }

  const match = type.match(NUMBER_REGEX);
  assert(
    match?.groups?.length,
    new ParserError(
      `Invalid number type. Expected a number type, but received "${type}".`,
    ),
  );

  const length = parseInt(match.groups.length, 10);
  assert(
    length >= 8 && length <= 256,
    new ParserError(
      `Invalid number length. Expected a number between 8 and 256, but received "${type}".`,
    ),
  );

  assert(
    length % 8 === 0,
    new ParserError(
      `Invalid number length. Expected a multiple of 8, but received "${type}".`,
    ),
  );

  return length;
};

/**
 * Assert that the byte length of the given value is in range for the given
 * number type.
 *
 * @param value - The value to check.
 * @param type - The type of the value.
 * @throws If the value is out of range for the type.
 */
export const assertNumberLength = (value: bigint, type: string) => {
  const length = getLength(type);
  const maxValue =
    BigInt(2) ** BigInt(length - (isSigned(type) ? 1 : 0)) - BigInt(1);

  if (isSigned(type)) {
    // Signed types must be in the range of `-(2^(length - 1))` to
    // `2^(length - 1) - 1`.
    assert(
      value >= -(maxValue + BigInt(1)) && value <= maxValue,
      new ParserError(`Number "${value}" is out of range for type "${type}".`),
    );

    return;
  }

  // Unsigned types must be in the range of `0` to `2^length - 1`.
  assert(
    value <= maxValue,
    new ParserError(`Number "${value}" is out of range for type "${type}".`),
  );
};

/**
 * Normalize a `bigint` value. This accepts the value as:
 *
 * - A `bigint`.
 * - A `number`.
 * - A decimal string, i.e., a string that does not start with "0x".
 * - A hexadecimal string, i.e., a string that starts with "0x".
 *
 * @param value - The number-like value to parse.
 * @returns The value parsed as bigint.
 */
export const getBigInt = (value: NumberLike): bigint => {
  try {
    return createBigInt(value);
  } catch {
    throw new ParserError(
      `Invalid number. Expected a valid number value, but received "${value}".`,
    );
  }
};

export const number: Parser<NumberLike, bigint> = {
  isDynamic: false,

  /**
   * Check if a type is a number type.
   *
   * @param type - The type to check.
   * @returns Whether the type is a number type.
   */
  isType(type: string): boolean {
    return NUMBER_REGEX.test(type);
  },

  /**
   * Get the byte length of an encoded number type. Since `int` and `uint` are
   * simple types, this will always return 32.
   *
   * @returns The byte length of the type.
   */
  getByteLength(): number {
    return 32;
  },

  /**
   * Encode a number value.
   *
   * @param args - The arguments to encode.
   * @param args.type - The type of the value.
   * @param args.buffer - The byte array to add to.
   * @param args.value - The value to encode.
   * @param args.packed - Whether to use packed encoding.
   * @returns The bytes with the encoded value added to it.
   */
  encode({ type, buffer, value, packed }): Uint8Array {
    const bigIntValue = getBigInt(value);

    assertNumberLength(bigIntValue, type);

    if (isSigned(type)) {
      // For packed encoding, the value is padded to the length of the type, and
      // then added to the byte array.
      if (packed) {
        const length = getLength(type) / 8;
        return concatBytes([buffer, signedBigIntToBytes(bigIntValue, length)]);
      }

      return concatBytes([
        buffer,
        padStart(signedBigIntToBytes(bigIntValue, 32)),
      ]);
    }

    // For packed encoding, the value is padded to the length of the type, and
    // then added to the byte array.
    if (packed) {
      const length = getLength(type) / 8;
      return concatBytes([
        buffer,
        padStart(bigIntToBytes(bigIntValue), length),
      ]);
    }

    return concatBytes([buffer, padStart(bigIntToBytes(bigIntValue))]);
  },

  /**
   * Decode a number value.
   *
   * @param args - The decoding arguments.
   * @param args.type - The type of the value.
   * @param args.value - The value to decode.
   * @returns The decoded value.
   */
  decode({ type, value }: DecodeArgs): bigint {
    const buffer = value.subarray(0, 32);
    if (isSigned(type)) {
      const numberValue = bytesToSignedBigInt(buffer);
      assertNumberLength(numberValue, type);
      return numberValue;
    }

    const numberValue = bytesToBigInt(buffer);
    assertNumberLength(numberValue, type);
    return numberValue;
  },
};
