import { DecodeArgs, NumberLike, Parser } from '../types';
import {
  concat,
  fromTwosComplement,
  toBuffer,
  toNumber,
  toTwosComplement,
} from '../utils';

const NUMBER_REGEX = /^u?int([0-9]*)?$/;

/**
 * Check if a number type is signed.
 *
 * @param type - The type to check.
 * @returns Whether the type is signed.
 */
export const isSigned = (type: string): boolean => {
  return !type.startsWith('u');
};

/**
 * Get a number-like value as bigint.
 *
 * @param value - The number-like value to parse.
 * @returns The value parsed as bigint.
 */
export const asNumber = (value: NumberLike): bigint => {
  if (typeof value === 'bigint') {
    return value;
  }

  return BigInt(value);
};

export const number: Parser<NumberLike, bigint> = {
  isDynamic: false,

  /**
   * Check if a type is a number type.
   *
   * @param type
   * @returns Whether the type is a number type.
   */
  isType(type: string): boolean {
    return NUMBER_REGEX.test(type);
  },

  encode({ type, buffer, value }): Uint8Array {
    const number = asNumber(value);

    if (isSigned(type)) {
      return concat([buffer, toTwosComplement(number, 32)]);
    }

    return concat([buffer, toBuffer(number)]);
  },

  decode({ type, value }: DecodeArgs): bigint {
    const buffer = value.slice(0, 32);
    if (isSigned(type)) {
      return fromTwosComplement(buffer);
    }

    return toNumber(buffer);
  },
};
