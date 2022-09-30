import { address, bool, bytes, fn, number, string } from '../parsers';
import { Parser } from './parser';

// prettier-ignore
type ByteLength = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32;
// prettier-ignore
type IntegerLength = 8 | 16 | 24 | 32 | 40 | 48 | 56 | 64 | 72 | 80 | 88 | 96 | 104 | 112 | 120 | 128 | 136 | 144 | 152 | 160 | 168 | 176 | 184 | 192 | 200 | 208 | 216 | 224 | 232 | 240 | 248 | 256;

type Bytes = `bytes${ByteLength}`;
type Integer = `int${IntegerLength}`;
type UnsignedInteger = `uint${IntegerLength}`;

export type Type = keyof OutputTypeMap;
export type TypeMapper<I extends any[], T = OutputTypeMap> = Mapper<T, I>;

/**
 * An object type with most possible ABI types, and their respective TypeScript type. Note that some dynamic types, like
 * `<type>[<length>]` and `fixed<M>x<N>` are not supported, and `unknown` is used instead.
 */
export type OutputTypeMap = WithArrayTypes<MapToOutput<TypeMap>>;

/**
 * An object type with most possible ABI types, and their respective TypeScript type. Note that some dynamic types, like
 * `<type>[<length>]` and `fixed<M>x<N>` are not supported, and `unknown` is used instead.
 *
 * Accepts multiple input types for certain ABI types, like strings, bytes, numbers.
 */
export type InputTypeMap = WithArrayTypes<MapToInput<TypeMap>>;

/**
 * Generic type map which is used to generate the input and output type map.
 */
type TypeMap = {
  address: ExtractGeneric<typeof address>;
  bool: ExtractGeneric<typeof bool>;
  bytes: ExtractGeneric<typeof bytes>;
  function: ExtractGeneric<typeof fn>;
  int: ExtractGeneric<typeof number>;
  string: ExtractGeneric<typeof string>;
  uint: ExtractGeneric<typeof number>;
} & DynamicType<Bytes, ExtractGeneric<typeof bytes>> &
  DynamicType<Integer, ExtractGeneric<typeof number>> &
  DynamicType<UnsignedInteger, ExtractGeneric<typeof number>>;

/**
 * Helper type to generate an object type from a union.
 */
type DynamicType<K extends string, T> = {
  [key in K]: T;
};

/**
 * Helper type that maps the input `I` to the types `T`.
 */
type Mapper<T, I extends any[]> = {
  [K in keyof I]: I[K] extends I[number] ? T[I[K]] : unknown;
};

/**
 * Helper type that maps a tuple to the first element.
 */
export type MapToInput<T extends Record<string, [unknown, unknown]>> = {
  [K in keyof T]: T[K][0];
};

/**
 * Helper type that maps a tuple to the second element.
 */
export type MapToOutput<T extends Record<string, [unknown, unknown]>> = {
  [K in keyof T]: T[K][1];
};

/**
 * Helper type that adds an array type for each of the specified keys and types.
 */
type WithArrayTypes<T> = T & {
  [K in keyof T as `${string & K}[]`]: T[K][];
};

/**
 * Helper type that extracts the input or output from a Parser;.
 */
type ExtractGeneric<T> = T extends Parser<infer I, infer O> ? [I, O] : never;
