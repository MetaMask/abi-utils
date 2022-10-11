import {
  assert,
  bytesToNumber,
  concatBytes,
  numberToBytes,
} from '@metamask/utils';
import { iterate } from './iterator';
import {
  address,
  array,
  bool,
  bytes,
  fixedBytes,
  fn,
  number,
  Parser,
  string,
  tuple,
} from './parsers';
import { padStart, set } from './utils';
import { TypeMap } from './types';
import { ParserError } from './errors';

/**
 * Get the parser for the specified type.
 *
 * @param type - The type to get a parser for.
 * @returns The parser.
 * @throws If there is no parser for the specified type.
 */
export const getParser = (type: string): Parser => {
  const parsers: { [key: string]: Parser } = {
    address,
    array,
    bool,
    bytes,
    fixedBytes,
    function: fn,
    number,
    string,
    tuple,
  };

  const staticParser = parsers[type];
  if (staticParser) {
    return staticParser;
  }

  const parser = Object.values(parsers).find((value) => value.isType(type));
  if (parser) {
    return parser;
  }

  throw new ParserError(`The type "${type}" is not supported.`);
};

/**
 * Check if the specified parser is dynamic, for the provided types. This is
 * primarily used for parsing tuples, where a tuple can be dynamic based on the
 * types. For other parsers, it will simply use the set `isDynamic` value.
 *
 * @param parser - The parser to check.
 * @param type - The type to check the parser with.
 * @returns Whether the parser is dynamic.
 */
export const isDynamicParser = (parser: Parser, type: string): boolean => {
  const { isDynamic } = parser;
  if (typeof isDynamic === 'function') {
    return isDynamic(type);
  }

  return isDynamic;
};

type Pointer = {
  position: number;
  pointer: number;
};

type PackState = {
  staticBuffer: Uint8Array;
  dynamicBuffer: Uint8Array;
  pointers: Pointer[];
};

export type PackArgs<Type extends readonly string[]> = {
  /**
   * The types of the values to pack.
   */
  types: Type;

  /**
   * The values to pack.
   */
  values: TypeMap<Type, 'input'>;

  /**
   * Whether to use the non-standard packed mode.
   */
  packed?: boolean | undefined;

  /**
   * Whether to use tight packing mode. Only applicable when `packed` is true.
   * When true, the packed mode will not add any padding bytes. This matches
   * the packing behaviour of `ethereumjs-abi`, but is not standard.
   */
  tight?: boolean | undefined;

  /**
   * Whether to use the non-standard packed mode in "array" mode. This is
   * normally only used by the {@link array} parser.
   */
  arrayPacked?: boolean | undefined;

  /**
   * The byte array to encode the values into.
   */
  byteArray?: Uint8Array;
};

/**
 * Pack the provided values in a buffer, encoded with the specified types. If a
 * buffer is specified, the resulting value will be concatenated with the
 * buffer.
 *
 * @param args - The arguments object.
 * @param args.types - The types of the values to pack.
 * @param args.values - The values to pack.
 * @param args.packed - Whether to use the non-standard packed mode. Defaults to
 * `false`.
 * @param args.arrayPacked - Whether to use the non-standard packed mode for
 * arrays. Defaults to `false`.
 * @param args.byteArray - The byte array to encode the values into. Defaults to
 * an empty array.
 * @param args.tight - Whether to use tight packing mode. Only applicable when
 * `packed` is true. When true, the packed mode will not add any padding bytes.
 * This matches the packing behaviour of `ethereumjs-abi`, but is not standard.
 * @returns The resulting encoded buffer.
 */
export const pack = <Type extends readonly string[]>({
  types,
  values,
  packed = false,
  tight = false,
  arrayPacked = false,
  byteArray = new Uint8Array(),
}: PackArgs<Type>): Uint8Array => {
  assert(
    types.length === values.length,
    new ParserError(
      `The number of types (${types.length}) does not match the number of values (${values.length}).`,
    ),
  );

  const { staticBuffer, dynamicBuffer, pointers } = types.reduce<PackState>(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    ({ staticBuffer, dynamicBuffer, pointers }, type, index) => {
      const parser = getParser(type);
      const value = values[index];

      // If packed mode is enabled, we can skip the dynamic check, as all
      // values are encoded in the static buffer.
      if (packed || arrayPacked || !isDynamicParser(parser, type)) {
        return {
          staticBuffer: parser.encode({
            buffer: staticBuffer,
            value,
            type,
            packed,
            tight,
          }),
          dynamicBuffer,
          pointers,
        };
      }

      const newStaticBuffer = concatBytes([staticBuffer, new Uint8Array(32)]);
      const newDynamicBuffer = parser.encode({
        buffer: dynamicBuffer,
        value,
        type,
        packed,
        tight,
      });

      return {
        staticBuffer: newStaticBuffer,
        dynamicBuffer: newDynamicBuffer,
        pointers: [
          ...pointers,
          { position: staticBuffer.length, pointer: dynamicBuffer.length },
        ],
      };
    },
    {
      staticBuffer: new Uint8Array(),
      dynamicBuffer: new Uint8Array(),
      pointers: [],
    },
  );

  // If packed mode is enabled, there shouldn't be any dynamic values.
  assert(
    (!packed && !arrayPacked) || dynamicBuffer.length === 0,
    new ParserError('Invalid pack state.'),
  );

  const dynamicStart = staticBuffer.length;
  const updatedBuffer = pointers.reduce((target, { pointer, position }) => {
    const offset = padStart(numberToBytes(dynamicStart + pointer));
    return set(target, offset, position);
  }, staticBuffer);

  return concatBytes([byteArray, updatedBuffer, dynamicBuffer]);
};

export const unpack = <
  Type extends readonly string[],
  Output = TypeMap<Type, 'output'>,
>(
  types: Type,
  buffer: Uint8Array,
): Output => {
  const iterator = iterate(buffer);

  return types.map((type) => {
    const {
      value: { value, skip },
      done,
    } = iterator.next();
    assert(
      !done,
      new ParserError(
        `The encoded value is invalid for the provided types. Reached end of buffer while attempting to parse "${type}".`,
      ),
    );

    const parser = getParser(type);
    const isDynamic = isDynamicParser(parser, type);

    if (isDynamic) {
      const pointer = bytesToNumber(value.subarray(0, 32));
      const target = buffer.subarray(pointer);

      return parser.decode({ type, value: target, skip });
    }

    return parser.decode({ type, value, skip });
  }) as unknown as Output;
};
