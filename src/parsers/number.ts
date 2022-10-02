import {
  bigIntToBytes,
  bytesToBigInt,
  bytesToSignedBigInt,
  concatBytes,
  signedBigIntToBytes,
} from '@metamask/utils';
import { NumberLike } from '../types';
import { padStart } from '../utils';
import { DecodeArgs, Parser } from './parser';

const NUMBER_REGEX = /^u?int([0-9]*)?$/u;

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
export const asBigInt = (value: NumberLike): bigint => {
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
   * @param type - The type to check.
   * @returns Whether the type is a number type.
   */
  isType(type: string): boolean {
    return NUMBER_REGEX.test(type);
  },

  encode({ type, buffer, value }): Uint8Array {
    const bigIntValue = asBigInt(value);
    if (isSigned(type)) {
      return concatBytes([
        buffer,
        padStart(signedBigIntToBytes(bigIntValue, 32)),
      ]);
    }

    return concatBytes([buffer, padStart(bigIntToBytes(bigIntValue))]);
  },

  decode({ type, value }: DecodeArgs): bigint {
    const buffer = value.slice(0, 32);
    if (isSigned(type)) {
      return bytesToSignedBigInt(buffer);
    }

    return bytesToBigInt(buffer);
  },
};
