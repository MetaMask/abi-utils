import { pack, unpack } from './packer';

/**
 * Encode the data with the provided types.
 *
 * @param types - The types to encode.
 * @param values - The values to encode. This array must have the same length as the types array.
 * @returns The ABI encoded bytes.
 */
export const encode = (types: string[], values: unknown[]): Uint8Array => {
  return pack(types, values, new Uint8Array());
};

/**
 * Decode an ABI encoded buffer with the specified types.
 *
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
