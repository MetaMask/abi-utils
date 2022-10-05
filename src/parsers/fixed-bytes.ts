import { Bytes, concatBytes, valueToBytes } from '@metamask/utils';
import { padEnd } from '../utils';
import { Parser } from './parser';

const BYTES_REGEX = /^bytes([0-9]{1,2})$/u;

/**
 * Get the length of the specified type. If a length is not specified, or if the
 * length is out of range (0 < n <= 32), this will throw an error.
 *
 * @param type - The type to get the length for.
 * @returns The byte length of the type.
 */
export const getByteLength = (type: string): number => {
  const bytes = type.match(BYTES_REGEX)?.[1];

  if (bytes) {
    const length = Number(bytes);
    if (length <= 0 || length > 32) {
      throw new Error('Invalid type: length is out of range.');
    }

    return length;
  }

  throw new Error('Invalid type: no length.');
};

export const fixedBytes: Parser<Bytes, Uint8Array> = {
  isDynamic: false,

  /**
   * Check if a type is a fixed bytes type.
   *
   * @param type - The type to check.
   * @returns Whether the type is a fixed bytes type.
   */
  isType(type: string): boolean {
    return BYTES_REGEX.test(type);
  },

  encode({ type, buffer, value }): Uint8Array {
    const length = getByteLength(type);
    const bufferValue = valueToBytes(value);

    if (bufferValue.length !== length) {
      throw new Error(
        `Buffer has invalid length, expected ${length}, got ${bufferValue.length}.`,
      );
    }

    return concatBytes([buffer, padEnd(bufferValue)]);
  },

  decode({ type, value }): Uint8Array {
    const length = getByteLength(type);

    // Since we're returning a `Uint8Array`, we use `slice` to copy the bytes
    // into a new array.
    return value.slice(0, length);
  },
};
