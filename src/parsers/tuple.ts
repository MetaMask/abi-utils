import { getParser, isDynamicParser, pack, unpack } from '../packer';
import { Parser } from './parser';

const TUPLE_REGEX = /^\((.*)\)$/u;

/**
 * Get elements from a tuple type.
 *
 * @param type - The tuple type to get the types for.
 * @returns The elements of the tuple as string array.
 */
export const getTupleElements = (type: string): string[] => {
  return type
    .slice(1, -1)
    .split(',')
    .map((value) => value.trim());
};

export const tuple: Parser<unknown[]> = {
  /**
   * Check if the tuple is dynamic. Tuples are dynamic if one or more elements of the tuple are dynamic.
   *
   * @param type - The type to check.
   * @returns Whether the tuple is dynamic.
   */
  isDynamic(type: string): boolean {
    const elements = getTupleElements(type);
    return elements.some((element) => {
      const parser = getParser(element);
      return isDynamicParser(parser, element);
    });
  },

  /**
   * Check if a type is an tuple type.
   *
   * @param type - The type to check.
   * @returns Whether the type is a tuple type.
   */
  isType(type: string): boolean {
    return TUPLE_REGEX.test(type);
  },

  encode({ type, buffer, value }): Uint8Array {
    const elements = getTupleElements(type);
    return pack(elements, value, buffer);
  },

  decode({ type, value, skip }): unknown[] {
    const elements = getTupleElements(type);
    const length = elements.length * 32 - 32;

    if (!isDynamicParser(this, type)) {
      skip(length);
    }

    return unpack(elements, value);
  },
};
