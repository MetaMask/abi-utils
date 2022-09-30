import { BooleanLike, DecodeArgs, EncodeArgs, Parser } from '../types';
import { number } from './number';

/**
 * Get a number for a boolean-like value (e.g., strings).
 *
 * @param value - The value to get a boolean for.
 * @returns The parsed boolean value. This is 1n for truthy values, or 0n for falsy values.
 */
export const getBooleanValue = (value: BooleanLike): bigint => {
  if (
    value === true ||
    (typeof value === 'string' && value === 'true') ||
    value === 'yes'
  ) {
    return 1n;
  }

  return 0n;
};

export const bool: Parser<BooleanLike, boolean> = {
  isDynamic: false,

  encode({ buffer, value }: EncodeArgs<BooleanLike>): Uint8Array {
    const booleanValue = getBooleanValue(value);
    return number.encode({ type: 'uint256', buffer, value: booleanValue });
  },

  decode(args: DecodeArgs): boolean {
    return number.decode({ ...args, type: 'uint256' }) === 1n;
  },
};
