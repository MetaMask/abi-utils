import {
  bigIntToBytes,
  bytesToBigInt,
  bytesToSignedBigInt,
  concatBytes,
  signedBigIntToBytes,
} from '@metamask/utils';
import { create } from 'superstruct';
import { bigint, NumberLike } from '../types';
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
  return create(value, bigint());
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

  /**
   * Get the byte length of an encoded number type. Since `int` and `uint` are
   * simple types, this will always return 32.
   *
   * @returns The byte length of the type.
   */
  getByteLength(): number {
    return 32;
  },

  /**
   * Encode a number value.
   *
   * @param args - The arguments to encode.
   * @param args.type - The type of the value.
   * @param args.buffer - The byte array to add to.
   * @param args.value - The value to encode.
   * @returns The bytes with the encoded value added to it.
   */
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

  /**
   * Decode a number value.
   *
   * @param args - The decoding arguments.
   * @param args.type - The type of the value.
   * @param args.value - The value to decode.
   * @returns The decoded value.
   */
  decode({ type, value }: DecodeArgs): bigint {
    const buffer = value.slice(0, 32);
    if (isSigned(type)) {
      return bytesToSignedBigInt(buffer);
    }

    return bytesToBigInt(buffer);
  },
};
