import { create } from 'superstruct';
import { boolean, BooleanLike } from '../types';
import { Parser } from './parser';
import { number } from './number';

/**
 * Get a number for a boolean-like value (e.g., strings).
 *
 * @param value - The value to get a boolean for.
 * @returns The parsed boolean value. This is `BigInt(1)` for truthy values, or
 * `BigInt(0)` for falsy values.
 */
export const getBooleanValue = (value: BooleanLike): bigint => {
  const booleanValue = create(value, boolean());
  if (booleanValue) {
    return BigInt(1);
  }

  return BigInt(0);
};

export const bool: Parser<BooleanLike, boolean> = {
  isDynamic: false,

  /**
   * Get if the given value is a valid boolean type. Since `bool` is a simple
   * type, this is just a check that the value is "bool".
   *
   * @param type - The type to check.
   * @returns Whether the type is a valid boolean type.
   */
  isType: (type) => type === 'bool',

  /**
   * Get the byte length of an encoded boolean. Since `bool` is a simple
   * type, this always returns 32.
   *
   * Note that actual booleans are only 1 byte long, but the encoding of
   * the `bool` type is always 32 bytes long.
   *
   * @returns The byte length of an encoded boolean.
   */
  getByteLength(): number {
    return 32;
  },

  /**
   * Encode the given boolean to a byte array.
   *
   * @param args - The encoding arguments.
   * @param args.buffer - The byte array to add to.
   * @param args.value - The boolean to encode.
   * @returns The bytes with the encoded boolean added to it.
   */
  encode({ buffer, value }): Uint8Array {
    const booleanValue = getBooleanValue(value);

    // Booleans are encoded as 32-byte integers, so we use the number parser
    // to encode the boolean value.
    return number.encode({ type: 'uint256', buffer, value: booleanValue });
  },

  /**
   * Decode the given byte array to a boolean.
   *
   * @param args - The decoding arguments.
   * @returns The decoded boolean.
   */
  decode(args): boolean {
    // Booleans are encoded as 32-byte integers, so we use the number parser
    // to decode the boolean value.
    return number.decode({ ...args, type: 'uint256' }) === BigInt(1);
  },
};
