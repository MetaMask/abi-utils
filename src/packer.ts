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

  const parser = Object.values(parsers).find((value) => value.isType?.(type));
  if (parser) {
    return parser;
  }

  throw new Error(`Type "${type}" is not supported.`);
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

/**
 * Pack the provided values in a buffer, encoded with the specified types. If a
 * buffer is specified, the resulting value will be concatenated with the
 * buffer.
 *
 * @param types - The types to use for encoding.
 * @param values - The values to encode.
 * @param buffer - The buffer to concatenate with.
 * @returns The resulting encoded buffer.
 */
export const pack = (
  types: readonly string[],
  values: unknown[],
  buffer: Uint8Array = new Uint8Array(),
): Uint8Array => {
  assert(
    types.length === values.length,
    'The length of the types and values must be equal.',
  );

  const { staticBuffer, dynamicBuffer, pointers } = types.reduce<PackState>(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    ({ staticBuffer, dynamicBuffer, pointers }, type, index) => {
      const parser = getParser(type);
      const value = values[index];

      if (!isDynamicParser(parser, type)) {
        return {
          staticBuffer: parser.encode({ buffer: staticBuffer, value, type }),
          dynamicBuffer,
          pointers,
        };
      }

      const newStaticBuffer = concatBytes([staticBuffer, new Uint8Array(32)]);
      const newDynamicBuffer = parser.encode({
        buffer: dynamicBuffer,
        value,
        type,
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

  const dynamicStart = staticBuffer.length;
  const updatedBuffer = pointers.reduce((target, { pointer, position }) => {
    const offset = padStart(numberToBytes(dynamicStart + pointer));
    return set(target, offset, position);
  }, staticBuffer);

  return concatBytes([buffer, updatedBuffer, dynamicBuffer]);
};

export const unpack = (
  types: readonly string[],
  buffer: Uint8Array,
): unknown[] => {
  const iterator = iterate(buffer);

  return types.map((type) => {
    const {
      value: { value, skip },
      done,
    } = iterator.next();
    if (done) {
      throw new Error('Element is out of range.');
    }

    const parser = getParser(type);
    const isDynamic = isDynamicParser(parser, type);

    if (isDynamic) {
      const pointer = bytesToNumber(value.subarray(0, 32));
      const target = buffer.subarray(pointer);

      return parser.decode({ type, value: target, skip });
    }

    return parser.decode({ type, value, skip });
  });
};
