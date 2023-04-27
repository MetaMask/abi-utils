import {
  add0x,
  assert,
  BytesLike,
  bytesToHex,
  concatBytes,
  createBytes,
} from '@metamask/utils';

import { ParserError } from '../errors';
import { padStart } from '../utils';
import { Parser } from './parser';

/**
 * Normalize an address value. This accepts the address as:
 *
 * - A hex string starting with the `0x` prefix.
 * - A byte array (`Uint8Array` or `Buffer`).
 *
 * It checks that the address is 20 bytes long.
 *
 * @param value - The value to normalize.
 * @returns The normalized address as `Uint8Array`.
 */
export const getAddress = (value: BytesLike): Uint8Array => {
  const bytesValue = createBytes(value);
  assert(
    bytesValue.length <= 20,
    new ParserError(
      `Invalid address value. Expected address to be 20 bytes long, but received ${bytesValue.length} bytes.`,
    ),
  );

  return padStart(bytesValue, 20);
};

export const address: Parser<BytesLike, string> = {
  isDynamic: false,

  /**
   * Get if the given value is a valid address type. Since `address` is a simple
   * type, this is just a check that the value is "address".
   *
   * @param type - The type to check.
   * @returns Whether the type is a valid address type.
   */
  isType: (type) => type === 'address',

  /**
   * Get the byte length of an encoded address. Since `address` is a simple
   * type, this always returns 32.
   *
   * Note that actual addresses are only 20 bytes long, but the encoding of
   * the `address` type is always 32 bytes long.
   *
   * @returns The byte length of an encoded address.
   */
  getByteLength(): number {
    return 32;
  },

  /**
   * Encode the given address to a 32-byte-long byte array.
   *
   * @param args - The encoding arguments.
   * @param args.buffer - The byte array to add to.
   * @param args.value - The address to encode.
   * @param args.packed - Whether to use packed encoding.
   * @returns The bytes with the encoded address added to it.
   */
  encode({ buffer, value, packed }): Uint8Array {
    const addressValue = getAddress(value);

    // If we're using packed encoding, we can just add the address bytes to the
    // byte array, without adding any padding.
    if (packed) {
      return concatBytes([buffer, addressValue]);
    }

    const addressBuffer = padStart(addressValue);
    return concatBytes([buffer, addressBuffer]);
  },

  /**
   * Decode the given byte array to an address.
   *
   * @param args - The decoding arguments.
   * @param args.value - The byte array to decode.
   * @returns The decoded address as a hexadecimal string, starting with the
   * "0x"-prefix.
   */
  decode({ value }): string {
    return add0x(bytesToHex(value.slice(12, 32)));
  },
};
