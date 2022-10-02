import { bytesToNumber, concatBytes, numberToBytes } from '@metamask/utils';
import { pack, unpack } from '../packer';
import { padStart } from '../utils';
import { Parser } from './parser';

// TODO: Add support for fixed length arrays
const ARRAY_REGEX = /^(.*)\[\]$/u;

/**
 * Get the type of the array.
 *
 * @param type - The type to get the array type for.
 * @returns The array type.
 */
export const getArrayType = (type: string): string => {
  const match = type.match(ARRAY_REGEX);
  if (match?.[1]) {
    return match[1];
  }

  throw new Error('Type is not an array type.');
};

export const array: Parser<unknown[]> = {
  isDynamic: true,

  /**
   * Check if a type is an array type.
   *
   * @param type - The type to check.
   * @returns Whether the type is an array type.
   */
  isType(type: string): boolean {
    return ARRAY_REGEX.test(type);
  },

  encode({ type, buffer, value }): Uint8Array {
    const arrayType = getArrayType(type);
    const arrayLength = padStart(numberToBytes(value.length));

    return pack(
      new Array(value.length).fill(arrayType),
      value,
      concatBytes([buffer, arrayLength]),
    );
  },

  decode({ type, value }): unknown[] {
    const arrayType = getArrayType(type);
    const arrayLength = bytesToNumber(value.subarray(0, 32));

    return unpack(new Array(arrayLength).fill(arrayType), value.subarray(32));
  },
};
