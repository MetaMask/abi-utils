import {
  add0x,
  bytesToHex,
  concatBytes,
  hexToBytes,
  remove0x,
} from '@metamask/utils';
import { padStart } from '../utils';
import { Parser } from './parser';

export const address: Parser<string> = {
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
   * Encode the given address to a byte array.
   *
   * @param args - The encoding arguments.
   * @param args.buffer - The byte array to add to.
   * @param args.value - The address to encode.
   * @returns The bytes with the encoded address added to it.
   */
  encode({ buffer, value }): Uint8Array {
    const addressBuffer = padStart(hexToBytes(remove0x(value)));

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
