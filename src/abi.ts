// ESLint gets confused by the nested list and tables in the docs, so we disable
// the rule for this file.
/* eslint-disable jsdoc/check-indentation, jsdoc/match-description */

import { assert, BytesLike, createBytes } from '@metamask/utils';
import { pack, unpack } from './packer';
import { TypeMap } from './types';
import { getErrorMessage, ParserError } from './errors';

/**
 * Encode the data with the provided types. The types must be valid Solidity
 * ABI types.
 *
 * This will attempt to parse the values into the correct types. For example,
 * if you pass in a hex string for a `uint256`, it will be parsed into a
 * `bigint`. Regular strings are interpreted as UTF-8 strings. If you want to
 * pass in a hex string, you must pass it in as a `Uint8Array`, or use the
 * "0x"-prefix.
 *
 * It will also attempt to infer the types of the values. For example, if you
 * pass in a string for a `uint256`, it will result in a TypeScript compile-time
 * error. This does not work for all types, however. For example, if you use
 * nested arrays or tuples, the type will be inferred as `unknown`.
 *
 * The following types are supported:
 *
 * - `address`: A 20-byte Ethereum address.
 *   - As a 40-character-long hexadecimal string, starting with "0x".
 *   - As a 20-byte-long byte array, i.e., `Uint8Array`.
 * - `bool`: A boolean value.
 *   - As a boolean literal, i.e., `true` or `false`.
 *   - As the strings "true" or "false".
 * - `bytes(n)`: A dynamic byte array.
 *   - As a hexadecimal string, starting with "0x".
 *   - As a byte array, i.e., `Uint8Array`.
 *   - As a regular string, which will be interpreted as UTF-8.
 * - `function`: A Solidity function.
 *   - As a 48-character-long hexadecimal string, starting with "0x".
 *   - As a 24-byte-long byte array, i.e., `Uint8Array`.
 *   - As a {@link SolidityFunction} object.
 * - `int(n)`: A signed integer.
 *   - As a number.
 *   - As a `bigint`.
 *   - As a hexadecimal string, starting with "0x".
 * - `string`: A dynamic UTF-8 string.
 *   - As a regular string.
 *   - As a hexadecimal string, starting with "0x".
 *   - As a byte array, i.e., `Uint8Array`.
 * - `tuple`: A tuple of values.
 *   - As an array of values.
 * - `uint(n)`: An unsigned integer.
 *   - As a number.
 *   - As a `bigint`.
 *   - As a hexadecimal string, starting with "0x".
 *
 * @example
 * ```typescript
 * import { encode, decode } from '@metamask/abi-utils';
 *
 * const types = ['uint256', 'string'];
 * const encoded = encode(types, [42, 'Hello, world!']);
 * const decoded = decode(types, encoded);
 *
 * console.log(decoded); // [42n, 'Hello, world!']
 * ```
 * @see https://docs.soliditylang.org/en/v0.8.17/abi-spec.html
 * @param types - The types to encode.
 * @param values - The values to encode. This array must have the same length as
 * the types array.
 * @param packed - Whether to use the non-standard packed mode. Defaults to
 * `false`.
 * @param tight - Whether to pack the values tightly. When enabled, the values
 * will be packed without any padding. This matches the behaviour of
 * `ethereumjs-abi`. Defaults to `false`.
 * @returns The ABI encoded bytes.
 */
export const encode = <Type extends readonly string[]>(
  types: Type,
  values: TypeMap<Type, 'input'>,
  packed?: boolean,
  tight?: boolean,
): Uint8Array => {
  try {
    return pack({ types, values, packed, tight });
  } catch (error) {
    if (error instanceof ParserError) {
      throw new ParserError(`Unable to encode value: ${error.message}`, error);
    }

    throw new ParserError(
      `An unexpected error occurred: ${getErrorMessage(error)}`,
      error,
    );
  }
};

/**
 * Encode the data with the provided type. The type must be a valid Solidity
 * ABI type.
 *
 * See {@link encode} for more information on how values are parsed.
 *
 * @example
 * ```typescript
 * import { encodeSingle, decodeSingle } from '@metamask/abi-utils';
 *
 * const encoded = encodeSingle('uint256', 42);
 * const decoded = decodeSingle('uint256', encoded);
 *
 * console.log(decoded); // 42n
 * ```
 * @see https://docs.soliditylang.org/en/v0.8.17/abi-spec.html#types
 * @param type - The type to encode.
 * @param value - The value to encode.
 * @returns The ABI encoded bytes.
 */
export const encodeSingle = <Type extends string>(
  type: Type,
  value: TypeMap<[Type], 'input'>[0],
): Uint8Array => {
  return encode([type], [value]);
};

/**
 * Encode the data with the provided types. The types must be valid Solidity
 * ABI types. This is the same as {@link encode}, except that the values are
 * encoded in the non-standard packed mode.
 *
 * Note that these values cannot be decoded with {@link decode} or Solidity's
 * `abi.decode` function.
 *
 * See {@link encode} for more information on how values are parsed.
 *
 * @example
 * ```typescript
 * import { encodePacked } from '@metamask/abi-utils';
 *
 * const encoded = encodePacked(['uint256'], [42]);
 *
 * console.log(encoded); // `Uint8Array [ 42 ]`
 * ```
 * @see https://docs.soliditylang.org/en/v0.8.17/abi-spec.html#types
 * @see https://docs.soliditylang.org/en/v0.8.17/abi-spec.html#non-standard-packed-mode
 * @param types - The types to encode.
 * @param values - The values to encode.
 * @param tight - Whether to pack the values tightly. When enabled, the values
 * will be packed without any padding. This matches the behaviour of
 * `ethereumjs-abi`. Defaults to `false`.
 * @returns The ABI encoded bytes.
 */
export const encodePacked = <Type extends readonly string[]>(
  types: Type,
  values: TypeMap<Type, 'input'>,
  tight?: boolean,
): Uint8Array => {
  return encode(types, values, true, tight);
};

/**
 * Decode an ABI encoded buffer with the specified types. The types must be
 * valid Solidity ABI types.
 *
 * This will attempt to infer the output types from the input types. For
 * example, if you use `uint256` as an input type, the output type will be
 * `bigint`. This does not work for all types, however. For example, if you use
 * nested array types or tuple types, the output type will be `unknown`.
 *
 * The resulting types of the values will be as follows:
 *
 * | Contract ABI Type | Resulting JavaScript Type |
 * | ----------------- | ------------------------- |
 * | `address`         | `string`                  |
 * | `bool`            | `boolean`                 |
 * | `bytes(n)`        | `Uint8Array`              |
 * | `function`        | {@link SolidityFunction}  |
 * | `int(n)`          | `bigint`                  |
 * | `string`          | `string`                  |
 * | `tuple`           | `Array`                   |
 * | `array`           | `Array`                   |
 * | `uint(n)`         | `bigint`                  |
 *
 * @example
 * ```typescript
 * import { encode, decode } from '@metamask/abi-utils';
 *
 * const types = ['uint256', 'string'];
 * const encoded = encode(types, [42, 'Hello, world!']);
 * const decoded = decode(types, encoded);
 *
 * console.log(decoded); // [42n, 'Hello, world!']
 * ```
 * @see https://docs.soliditylang.org/en/v0.8.17/abi-spec.html#types
 * @param types - The types to decode the bytes with.
 * @param value - The bytes-like value to decode.
 * @returns The decoded values as array.
 */
export const decode = <
  Type extends readonly string[],
  Output = TypeMap<Type, 'output'>,
>(
  types: Type,
  value: BytesLike,
): Output => {
  const bytes = createBytes(value);

  try {
    return unpack(types, bytes);
  } catch (error) {
    if (error instanceof ParserError) {
      throw new ParserError(`Unable to decode value: ${error.message}`, error);
    }

    throw new ParserError(
      `An unexpected error occurred: ${getErrorMessage(error)}`,
      error,
    );
  }
};

/**
 * Decode the data with the provided type. The type must be a valid Solidity
 * ABI type.
 *
 * See {@link decode} for more information on how values are parsed.
 *
 * @example
 * ```typescript
 * import { encodeSingle, decodeSingle } from '@metamask/abi-utils';
 *
 * const encoded = encodeSingle('uint256', 42);
 * const decoded = decodeSingle('uint256', encoded);
 *
 * console.log(decoded); // 42n
 * ```
 * @see https://docs.soliditylang.org/en/v0.8.17/abi-spec.html#types
 * @param type - The type to decode.
 * @param value - The bytes-like value to decode.
 * @returns The decoded value.
 */
export const decodeSingle = <Type extends string>(
  type: Type,
  value: BytesLike,
): TypeMap<[Type], 'output'>[0] => {
  const result = decode([type] as const, value);
  assert(
    result.length === 1,
    new ParserError('Decoded value array has unexpected length.'),
  );

  return result[0];
};
