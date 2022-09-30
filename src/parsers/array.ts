import { pack, unpack } from '../packer';
import { DecodeArgs, Parser } from '../types';
import { concat, toBuffer, toNumber } from '../utils';

// TODO: Add support for fixed length arrays
const ARRAY_REGEX = /^(.*)\[]$/;

/**
 * Get the type of the array.
 *
 * @param type - The type to get the array type for.
 * @returns The array type.
 */
export const getArrayType = (type: string): string => {
  const match = type.match(ARRAY_REGEX);
  if (match) {
    return match[1];
  }

  throw new Error('Type is not an array type');
};

export const array: Parser<unknown[]> = {
  isDynamic: true,

  /**
   * Check if a type is an array type.
   *
   * @param type - The type to check.
   * @returns Whether the type is a array type.
   */
  isType(type: string): boolean {
    return ARRAY_REGEX.test(type);
  },

  encode({ type, buffer, value }): Uint8Array {
    const arrayType = getArrayType(type);
    const arrayLength = toBuffer(value.length);

    return pack(
      new Array(value.length).fill(arrayType),
      value,
      concat([buffer, arrayLength]),
    );
  },

  decode({ type, value }: DecodeArgs): unknown[] {
    const arrayType = getArrayType(type);
    const arrayLength = Number(toNumber(value.subarray(0, 32)));

    return unpack(new Array(arrayLength).fill(arrayType), value.subarray(32));
  },
};
