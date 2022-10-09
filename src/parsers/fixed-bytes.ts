import { assert, BytesLike, concatBytes, createBytes } from '@metamask/utils';
import { padEnd } from '../utils';
import { ParserError } from '../errors';
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
  assert(
    bytes,
    `Invalid byte length. Expected a number between 1 and 32, but received "${type}".`,
  );

  const length = Number(bytes);
  assert(
    length > 0 && length <= 32,
    new ParserError(
      `Invalid byte length. Expected a number between 1 and 32, but received "${type}".`,
    ),
  );

  return length;
};

export const fixedBytes: Parser<BytesLike, Uint8Array> = {
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

  /**
   * Get the byte length of an encoded fixed bytes type.
   *
   * @returns The byte length of the type.
   */
  getByteLength(): number {
    return 32;
  },

  /**
   * Encode a fixed bytes value.
   *
   * @param args - The arguments to encode.
   * @param args.type - The type of the value.
   * @param args.buffer - The byte array to add to.
   * @param args.value - The value to encode.
   * @param args.packed - Whether to use packed encoding.
   * @returns The bytes with the encoded value added to it.
   */
  encode({ type, buffer, value, packed }): Uint8Array {
    const length = getByteLength(type);
    const bufferValue = createBytes(value);

    assert(
      bufferValue.length <= length,
      new ParserError(
        `Expected a value of length ${length}, but received a value of length ${bufferValue.length}.`,
      ),
    );

    if (packed) {
      return concatBytes([buffer, padEnd(bufferValue, length)]);
    }

    return concatBytes([buffer, padEnd(bufferValue)]);
  },

  /**
   * Decode a fixed bytes value.
   *
   * @param args - The arguments to decode.
   * @param args.type - The type of the value.
   * @param args.value - The value to decode.
   * @returns The decoded value as a `Uint8Array`.
   */
  decode({ type, value }): Uint8Array {
    const length = getByteLength(type);

    // Since we're returning a `Uint8Array`, we use `slice` to copy the bytes
    // into a new array.
    return value.slice(0, length);
  },
};
