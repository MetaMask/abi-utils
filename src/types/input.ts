import {
  coerce,
  literal,
  number,
  object,
  refine,
  string,
  union,
  boolean as booleanStruct,
  bigint as bigintStruct,
  instance,
  create,
} from 'superstruct';
import { add0x, bytesToHex, hexToBytes, isHexString } from '@metamask/utils';

/**
 * A struct that represents a hex string. The string must contain only
 * hexadecimal characters, and may optionally be prefixed with "0x". The
 * created string will always be prefixed with "0x".
 *
 * @returns A struct that represents a hex string.
 * @internal
 */
export function hex() {
  return coerce(
    refine(
      string(),
      'hex',
      (value) =>
        isHexString(value) &&
        (value.startsWith('0x') || value.startsWith('0X')),
    ),
    refine(string(), 'hex', isHexString),
    add0x,
  );
}

/**
 * A struct that represents a byte array. The value must either be a
 * `Uint8Array` or a hex string. The created value will always be a
 * `Uint8Array`.
 *
 * @param length - The length of the byte array. If provided, the byte array
 * must be exactly this length.
 * @returns A struct that represents a byte array.
 * @internal
 */
export function bytes(length?: number) {
  return coerce(
    refine(
      instance(Uint8Array),
      'bytes',
      (value) => !length || value.length === length,
    ),
    hex(),
    hexToBytes,
  );
}

/**
 * A struct that represents a boolean value, either a boolean literal or "true"
 * or "false". The created value will always be a boolean literal.
 *
 * @returns A struct that represents a boolean value.
 * @internal
 */
export function boolean() {
  return coerce(
    booleanStruct(),
    union([literal('true'), literal('false')]),
    (value) => value === 'true',
  );
}

/**
 * A struct that represents a `bigint`. The value must either be a number, a
 * `bigint`, or a (hex) string. The created value will always be a `bigint`.
 *
 * @returns A struct that represents a `bigint`.
 * @internal
 */
export function bigint() {
  return coerce(bigintStruct(), union([number(), string(), hex()]), BigInt);
}

/**
 * A struct that represents a Solidity function. The value must be a hex string
 * or a byte array. The created value will always be an object with an `address`
 * and `selector` property.
 *
 * @returns A struct that represents a Solidity function.
 * @internal
 */
export function solidityFunction() {
  return coerce(
    object({
      address: hex(),
      selector: hex(),
    }),
    union([hex(), bytes(24)]),
    (value) => {
      const array = create(value, bytes(24));
      return {
        address: bytesToHex(array.subarray(0, 20)),
        selector: bytesToHex(array.subarray(20, 24)),
      };
    },
  );
}

/**
 * A boolean-like value. This can be a boolean literal, or "true" or "false".
 */
export type BooleanLike = 'true' | 'false' | boolean;

/**
 * A number-like value. This can be a number, a `bigint`, or a (hex) string.
 */
export type NumberLike = number | bigint | string;

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
