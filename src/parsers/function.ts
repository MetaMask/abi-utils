import {
  assert,
  bytesToHex,
  concatBytes,
  createBytes,
  hexToBytes,
  StrictHexStruct,
} from '@metamask/utils';
import { coerce, create, instance, object, union } from 'superstruct';
import { ParserError } from '../errors';
import { Parser } from './parser';
import { fixedBytes } from './fixed-bytes';

/**
 * A Solidity function-like value. This can be a hex string, a byte array, or a
 * {@link SolidityFunction} object.
 */
export type FunctionLike = string | Uint8Array | SolidityFunction;

/**
 * A Solidity function, i.e., the address of a contract and the selector of a
 * function within that contract.
 */
export type SolidityFunction = {
  /**
   * The address of the contract. Must be a 40-character long hex string
   * (excluding the "0x"-prefix).
   */
  address: string;

  /**
   * The selector of the function. Must be an 8-character long hex string
   * (excluding the "0x"-prefix).
   */
  selector: string;
};

/**
 * A struct that represents a Solidity function. The value must be a hex string
 * or a byte array. The created value will always be an object with an `address`
 * and `selector` property.
 */
const FunctionStruct = coerce(
  object({
    address: StrictHexStruct,
    selector: StrictHexStruct,
  }),
  union([StrictHexStruct, instance(Uint8Array)]),
  (value) => {
    const bytes = createBytes(value);
    assert(
      bytes.length === 24,
      new ParserError(
        `Invalid Solidity function. Expected function to be 24 bytes long, but received ${bytes.length} bytes.`,
      ),
    );

    return {
      address: bytesToHex(bytes.subarray(0, 20)),
      selector: bytesToHex(bytes.subarray(20, 24)),
    };
  },
);

/**
 * Normalize a function. This accepts the function as:
 *
 * - A {@link SolidityFunction} object.
 * - A hexadecimal string.
 * - A byte array.
 *
 * @param input - The function-like input.
 * @returns The function as buffer.
 */
export const getFunction = (input: FunctionLike): Uint8Array => {
  const value = create(input, FunctionStruct);
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
   * @param args.packed - Whether to use packed encoding.
   * @returns The bytes with the encoded function added to it.
   */
  encode({ buffer, value, packed }): Uint8Array {
    const fnValue = getFunction(value);

    // Functions are encoded as `bytes24`, so we use the fixedBytes parser to
    // encode the function.
    return fixedBytes.encode({
      type: 'bytes24',
      buffer,
      value: fnValue,
      packed,
    });
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
