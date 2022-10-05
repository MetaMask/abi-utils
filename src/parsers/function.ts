import { bytesToHex, concatBytes, hexToBytes } from '@metamask/utils';
import { create } from 'superstruct';
import { FunctionLike, solidityFunction, SolidityFunction } from '../types';
import { Parser } from './parser';
import { fixedBytes } from './fixed-bytes';

/**
 * Get the encoded function as buffer. It consists of the address (20 bytes) and
 * function selector (4 bytes).
 *
 * @param input - The function-like input.
 * @returns The function as buffer.
 */
export const getFunction = (input: FunctionLike): Uint8Array => {
  const value = create(input, solidityFunction());
  return concatBytes([hexToBytes(value.address), hexToBytes(value.selector)]);
};

export const fn: Parser<FunctionLike, SolidityFunction> = {
  isDynamic: false,

  /**
   * Check if a type is a function type. Since `function` is a simple type, this
   * is just a check that the type is "function".
   *
   * @param type - The type to check.
   * @returns Whether the type is a function type.
   */
  isType: (type) => type === 'function',

  /**
   * Get the byte length of an encoded function. Since `function` is a simple
   * type, this always returns 32.
   *
   * Note that actual functions are only 24 bytes long, but the encoding of
   * the `function` type is always 32 bytes long.
   *
   * @returns The byte length of an encoded function.
   */
  getByteLength(): number {
    return 32;
  },

  /**
   * Encode the given function to a byte array.
   *
   * @param args - The encoding arguments.
   * @param args.buffer - The byte array to add to.
   * @param args.value - The function to encode.
   * @returns The bytes with the encoded function added to it.
   */
  encode({ buffer, value }): Uint8Array {
    const fnValue = getFunction(value);

    // Functions are encoded as `bytes24`, so we use the fixedBytes parser to
    // encode the function.
    return fixedBytes.encode({ type: 'bytes24', buffer, value: fnValue });
  },

  /**
   * Decode the given byte array to a function.
   *
   * @param args - The decoding arguments.
   * @param args.value - The byte array to decode.
   * @returns The decoded function as a {@link SolidityFunction} object.
   */
  decode({ value }): SolidityFunction {
    return {
      address: bytesToHex(value.slice(0, 20)),
      selector: bytesToHex(value.slice(20, 24)),
    };
  },
};
