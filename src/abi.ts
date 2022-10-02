import { pack, unpack } from './packer';

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
 * @example
 * ```typescript
 * import { encode } from '@metamask/abi-utils';
 *
 * const types = ['uint256', 'string'];
 * const encoded = encode(types, [42, 'Hello, world!']);
 * const decoded = decode(types, encoded);
 *
 * console.log(decoded); // [42n, 'Hello, world!']
 * ```
 *
 * @see https://docs.soliditylang.org/en/v0.8.17/abi-spec.html
 * @param types - The types to encode.
 * @param values - The values to encode. This array must have the same length as
 * the types array.
 * @returns The ABI encoded bytes.
 */
export const encode = (types: string[], values: unknown[]): Uint8Array => {
  return pack(types, values, new Uint8Array());
};

/**
 * Decode an ABI encoded buffer with the specified types. The types must be
 * valid Solidity ABI types.
 *
 * For ease of use, you can use the generic `Type` parameter to specify the
 * expected return type. This will allow you to use the returned values
 * directly without casting them. If you do not specify the type, the return
 * type will be `unknown[]`. Note that this will not check that the decoded
 * values match the specified types.
 *
 * @example
 * ```typescript
 * import { encode } from '@metamask/abi-utils';
 *
 * const types = ['uint256', 'string'];
 * const encoded = encode(types, [42, 'Hello, world!']);
 * const decoded = decode(types, encoded);
 *
 * console.log(decoded); // [42n, 'Hello, world!']
 * ```
 *
 * @see https://docs.soliditylang.org/en/v0.8.17/abi-spec.html
 * @param types - The types to decode the bytes with.
 * @param bytes - The bytes to decode.
 * @returns The decoded values as array.
 */
export const decode = <Type extends unknown[]>(
  types: string[],
  bytes: Uint8Array,
): Type => {
  return unpack(types, bytes) as Type;
};
