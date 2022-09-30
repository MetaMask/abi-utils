import { BytesLike, DecodeArgs, Parser } from '../types';
import { addPadding, concat, toBuffer } from '../utils';

const BYTES_REGEX = /^bytes([0-9]{1,2})$/;

/**
 * Get the length of the specified type. If a length is not specified, or if the length is out of range (0 < n <= 32),
 * this will throw an error.
 *
 * @param type The type to get the length for.
 * @return The byte length of the type.
 */
export const getByteLength = (type: string): number => {
  const bytes = type.match(BYTES_REGEX)?.[1];

  if (bytes) {
    const length = Number(bytes);
    if (length <= 0 || length > 32) {
      throw new Error('Invalid type: length is out of range');
    }

    return length;
  }

  throw new Error('Invalid type: no length');
};

export const fixedBytes: Parser<BytesLike, Uint8Array> = {
  isDynamic: false,

  /**
   * Check if a type is a fixed bytes type.
   *
   * @param type The type to check.
   * @return Whether the type is a fixed bytes type.
   */
  isType(type: string): boolean {
    return BYTES_REGEX.test(type);
  },

  encode({ type, buffer, value }): Uint8Array {
    const length = getByteLength(type);
    const bufferValue = toBuffer(value);

    if (bufferValue.length !== length) {
      throw new Error(`Buffer has invalid length, expected ${length}, got ${bufferValue.length}`);
    }

    return concat([buffer, addPadding(bufferValue)]);
  },

  decode({ type, value }: DecodeArgs): Uint8Array {
    const length = getByteLength(type);
    return value.slice(0, length);
  }
};
