import { pack, unpack } from './packer';
import { InputTypeMap, Narrow, Type, TypeMapper } from './types';

/**
 * Encode the data with the provided types.
 *
 * @param types The types to encode.
 * @param values The values to encode. This array must have the same length as the types array.
 * @return The ABI encoded buffer.
 */
export const encode = <T extends Array<Type | string>>(
  types: Narrow<T>,
  values: TypeMapper<T, InputTypeMap>
): Uint8Array => {
  return pack(types, values, new Uint8Array());
};

/**
 * Decode an ABI encoded buffer with the specified types.
 *
 * @param types The types to decode the buffer with.
 * @param buffer The buffer to decode.
 * @return The decoded values as array.
 */
export const decode = <T extends Array<Type | string>>(types: Narrow<T>, buffer: Uint8Array): TypeMapper<T> => {
  return unpack(types, buffer) as TypeMapper<T>;
};
