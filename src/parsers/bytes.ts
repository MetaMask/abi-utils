import {
  Bytes,
  bytesToNumber,
  concatBytes,
  numberToBytes,
  valueToBytes,
} from '@metamask/utils';
import { padEnd, padStart } from '../utils';
import { Parser } from './parser';

export const bytes: Parser<Bytes, Uint8Array> = {
  isDynamic: true,

  /**
   * Check if a type is a bytes type. Since `bytes` is a simple type, this is
   * just a check that the type is "bytes".
   *
   * @param type - The type to check.
   * @returns Whether the type is a bytes type.
   */
  isType: (type) => type === 'bytes',

  /**
   * Get the byte length of an encoded bytes value. Since `bytes` is a simple
   * type, this always returns 32.
   *
   * Note that actual length of a bytes value is variable, but the encoded
   * static value (pointer) is always 32 bytes long.
   *
   * @returns The byte length of an encoded bytes value.
   */
  getByteLength(): number {
    return 32;
  },

  /**
   * Encode the given bytes value to a byte array.
   *
   * @param args - The encoding arguments.
   * @param args.buffer - The byte array to add to.
   * @param args.value - The bytes value to encode.
   * @returns The bytes with the encoded bytes value added to it.
   */
  encode({ buffer, value }): Uint8Array {
    // TODO: Support "0x" in `@metamask/utils`.
    const bufferValue = value === '0x' ? new Uint8Array() : valueToBytes(value);
    const paddedSize = Math.ceil(bufferValue.byteLength / 32) * 32;

    // Bytes of length `k` are encoded as `k pad_right(bytes)`.
    return concatBytes([
      buffer,
      padStart(numberToBytes(bufferValue.byteLength)),
      padEnd(bufferValue, paddedSize),
    ]);
  },

  /**
   * Decode the given byte array to a bytes value.
   *
   * @param args - The decoding arguments.
   * @param args.value - The byte array to decode.
   * @returns The decoded bytes value as a `Uint8Array`.
   */
  decode({ value }): Uint8Array {
    const bytesValue = value.subarray(0, 32);
    const length = bytesToNumber(bytesValue);

    // Since we're returning a `Uint8Array`, we use `slice` to copy the bytes
    // into a new array.
    return value.slice(32, 32 + length);
  },
};
