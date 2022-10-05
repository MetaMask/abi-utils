import {
  assert,
  bytesToNumber,
  concatBytes,
  numberToBytes,
} from '@metamask/utils';
import { getParser, isDynamicParser, pack, unpack } from '../packer';
import { padStart } from '../utils';
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
  assert(match?.groups?.type, new TypeError('Type is not an array type.'));

  return [
    match.groups.type,
    match.groups.length ? parseInt(match.groups.length, 10) : undefined,
  ];
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

  getByteLength(type: string): number {
    const [innerType, length] = getArrayType(type);
    if (!isDynamicParser(this, type) && length !== undefined) {
      return tuple.getByteLength(
        `(${new Array(length).fill(innerType).join(',')})`,
      );
    }

    return 32;
  },

  encode({ type, buffer, value }): Uint8Array {
    const [arrayType, fixedLength] = getArrayType(type);

    if (fixedLength) {
      assert(
        fixedLength === value.length,
        `Array length does not match type length. Expected ${fixedLength}, got ${value.length}.`,
      );

      return tuple.encode({
        type: `(${new Array(value.length).fill(arrayType).join(',')})`,
        buffer,
        value,
      });
    }

    const arrayLength = padStart(numberToBytes(value.length));
    return pack(
      new Array(value.length).fill(arrayType),
      value,
      concatBytes([buffer, arrayLength]),
    );
  },

  decode({ type, value, ...rest }): unknown[] {
    const [arrayType, fixedLength] = getArrayType(type);

    if (fixedLength) {
      const result = tuple.decode({
        type: `(${new Array(fixedLength).fill(arrayType).join(',')})`,
        value,
        ...rest,
      });

      assert(
        result.length === fixedLength,
        'Array length does not match type length.',
      );

      return result;
    }

    const arrayLength = bytesToNumber(value.subarray(0, 32));
    return unpack(new Array(arrayLength).fill(arrayType), value.subarray(32));
  },
};
