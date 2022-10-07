import {
  address,
  bool,
  bytes,
  fn,
  number,
  Parser,
  string,
  tuple,
} from '../parsers';

type BytesType = `bytes` | `bytes${number}`;
type IntegerType = `int` | `int${number}` | `uint` | `uint${number}`;
type TupleType = `(${string})`;

/**
 * Infer the type of `Parser`. This results in an object containing the `input`
 * and `output` types of the parser.
 */
type ParserType<Type extends Parser> = Type extends Parser<infer I, infer O>
  ? {
      input: I;
      output: O;
    }
  : never;

/**
 * Map the `input` and `output` types of a parser to an array of types.
 */
type ArrayParserType<Type> = Type extends { input: infer I; output: infer O }
  ? {
      input: I[];
      output: O[];
    }
  : never;

/**
 * "Simple" types, i.e., types that are not arrays.
 */
type SimpleType = Record<BytesType, ParserType<typeof bytes>> &
  Record<IntegerType, ParserType<typeof number>> &
  Record<TupleType, ParserType<typeof tuple>> & {
    address: ParserType<typeof address>;
    bool: ParserType<typeof bool>;
    function: ParserType<typeof fn>;
    string: ParserType<typeof string>;
  };

/**
 * Dynamic array types, i.e., types that are arrays without a fixed length.
 */
type DynamicArray = {
  [Key in keyof SimpleType as `${Key}[]`]: ArrayParserType<SimpleType[Key]>;
};

/**
 * Fixed array types, i.e., types that are arrays with a fixed length.
 */
type FixedArray = {
  [Key in keyof SimpleType as `${Key}[${number}]`]: ArrayParserType<
    SimpleType[Key]
  >;
};

/**
 * All simple ABI types, and some basic array types. This does not include
 * nested arrays or tuples. Those are supported by the library, but the types
 * for those are not included here, and will result in `unknown` types.
 *
 * @see https://docs.soliditylang.org/en/v0.8.17/abi-spec.html#types
 */
export type Type = SimpleType & DynamicArray & FixedArray;

/**
 * Map an array of types to an array of their `input` or `output` types.
 *
 * Refer to {@link Type} to see which types are supported.
 *
 * @example
 * ```typescript
 * type OutputTypes = Map<[`uint256`, `bytes[]`, `string[2]`], 'output'>;
 * // Results in: [bigint, Uint8Array[], string[]]
 * ```
 */
export type TypeMap<
  Input extends readonly (keyof Type | string)[],
  IO extends 'input' | 'output',
> = {
  [Key in keyof Input]: Input[Key] extends keyof Type
    ? Type[Input[Key]][IO]
    : unknown;
};
