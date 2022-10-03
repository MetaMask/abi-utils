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

  encode({ buffer, value }): Uint8Array {
    const booleanValue = getBooleanValue(value);
    return number.encode({ type: 'uint256', buffer, value: booleanValue });
  },

  decode(args): boolean {
    return number.decode({ ...args, type: 'uint256' }) === BigInt(1);
  },
};
