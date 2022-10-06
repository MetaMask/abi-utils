import {
  assert,
  bytesToNumber,
  concatBytes,
  numberToBytes,
} from '@metamask/utils';
import { getParser, isDynamicParser, pack, unpack } from '../packer';
import { padStart } from '../utils';
import { ParserError } from '../errors';
import { Parser } from './parser';
import { tuple } from './tuple';

const ARRAY_REGEX = /^(?<type>.*)\[(?<length>\d*?)\]$/u;

export const isArrayType = (type: string): boolean => ARRAY_REGEX.test(type);

/**
 * Get the type of the array.
 *
 * @param type - The type to get the array type for.
 * @returns The array type.
 */
export const getArrayType = (
  type: string,
): [type: string, length: number | undefined] => {
  const match = type.match(ARRAY_REGEX);
  assert(
    match?.groups?.type,
    new ParserError(
      `Invalid array type. Expected an array type, but received "${type}".`,
    ),
  );

  return [
    match.groups.type,
    match.groups.length ? parseInt(match.groups.length, 10) : undefined,
  ];
};

/**
 * Get the type of the array as a tuple type.
 *
 * @param innerType - The type of the array.
 * @param length - The length of the array.
 * @returns The tuple type.
 */
export const getTupleType = (innerType: string, length: number): string => {
  return `(${new Array(length).fill(innerType).join(',')})`;
};

export const array: Parser<unknown[]> = {
  /**
   * Check if the array is dynamic. Arrays are dynamic if the array does not
   * have a fixed length, or if the array type is dynamic.
   *
   * @param type - The type to check.
   * @returns Whether the array is dynamic.
   */
  isDynamic(type: string): boolean {
    const [innerType, length] = getArrayType(type);
    return (
      // `T[]` is dynamic for any `T`. `T[k]` is dynamic for any dynamic `T` and
      // any `k >= 0`.
      length === undefined || isDynamicParser(getParser(innerType), innerType)
    );
  },

  /**
   * Check if a type is an array type.
   *
   * @param type - The type to check.
   * @returns Whether the type is an array type.
   */
  isType(type: string): boolean {
    return isArrayType(type);
  },

  /**
   * Get the byte length of an encoded array. If the array is dynamic, this
   * returns 32. If the array is static, this returns the byte length of the
   * resulting tuple type.
   *
   * @param type - The type to get the byte length for.
   * @returns The byte length of an encoded array.
   */
  getByteLength(type: string): number {
    assert(
      isArrayType(type),
      new ParserError(`Expected an array type, but received "${type}".`),
    );

    const [innerType, length] = getArrayType(type);
    if (!isDynamicParser(this, type) && length !== undefined) {
      return tuple.getByteLength(getTupleType(innerType, length));
    }

    return 32;
  },

  /**
   * Encode the given array to a byte array.
   *
   * @param args - The encoding arguments.
   * @param args.type - The type of the array.
   * @param args.buffer - The byte array to add to.
   * @param args.value - The array to encode.
   * @returns The bytes with the encoded array added to it.
   */
  encode({ type, buffer, value }): Uint8Array {
    const [arrayType, fixedLength] = getArrayType(type);

    if (fixedLength) {
      assert(
        fixedLength === value.length,
        new ParserError(
          `Array length does not match type length. Expected a length of ${fixedLength}, but received ${value.length}.`,
        ),
      );

      // `T[k]` for any `T` and `k` is encoded as `(T[0], ..., T[k - 1])`.
      return tuple.encode({
        type: getTupleType(arrayType, fixedLength),
        buffer,
        value,
      });
    }

    // `T[]` with `k` elements is encoded as `k (T[0], ..., T[k - 1])`.
    const arrayLength = padStart(numberToBytes(value.length));
    return pack(
      new Array(value.length).fill(arrayType),
      value,
      concatBytes([buffer, arrayLength]),
    );
  },

  /**
   * Decode an array from the given byte array.
   *
   * @param args - The decoding arguments.
   * @param args.type - The type of the array.
   * @param args.value - The byte array to decode.
   * @returns The decoded array.
   */
  decode({ type, value, ...rest }): unknown[] {
    const [arrayType, fixedLength] = getArrayType(type);

    if (fixedLength) {
      const result = tuple.decode({
        type: getTupleType(arrayType, fixedLength),
        value,
        ...rest,
      });

      assert(
        result.length === fixedLength,
        new ParserError(
          `Array length does not match type length. Expected a length of ${fixedLength}, but received ${result.length}.`,
        ),
      );

      return result;
    }

    const arrayLength = bytesToNumber(value.subarray(0, 32));
    return unpack(new Array(arrayLength).fill(arrayType), value.subarray(32));
  },
};
