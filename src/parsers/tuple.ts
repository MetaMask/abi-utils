import { assert } from '@metamask/utils';
import { getParser, isDynamicParser, pack, unpack } from '../packer';
import { Parser } from './parser';

const TUPLE_REGEX = /^\((.+)\)$/u;

const isTupleType = (type: string): boolean => TUPLE_REGEX.test(type);

/**
 * Get elements from a tuple type.
 *
 * @param type - The tuple type to get the types for.
 * @returns The elements of the tuple as string array.
 */
export const getTupleElements = (type: string): string[] => {
  assert(
    type[0] === '(' && type[type.length - 1] === ')',
    `Type "${type}" is not a tuple.`,
  );

  const elements: string[] = [];
  let current = '';
  let depth = 0;

  for (let i = 1; i < type.length - 1; i++) {
    const char = type[i];

    if (char === ',' && depth === 0) {
      elements.push(current.trim());
      current = '';
    } else {
      current += char;

      if (char === '(') {
        depth += 1;
      } else if (char === ')') {
        depth -= 1;
      }
    }
  }

  if (current) {
    elements.push(current.trim());
  }

  return elements;
};

export const tuple: Parser<unknown[]> = {
  /**
   * Check if the tuple is dynamic. Tuples are dynamic if one or more elements
   * of the tuple are dynamic.
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
   * Check if a type is a tuple type.
   *
   * @param type - The type to check.
   * @returns Whether the type is a tuple type.
   */
  isType(type: string): boolean {
    return isTupleType(type);
  },

  getByteLength(type: string): number {
    if (isDynamicParser(this, type)) {
      return 32;
    }

    const elements = getTupleElements(type);

    return elements.reduce((total, element) => {
      return total + getParser(element).getByteLength(element);
    }, 0);
  },

  encode({ type, buffer, value }): Uint8Array {
    const elements = getTupleElements(type);
    return pack(elements, value, buffer);
  },

  decode({ type, value, skip }): unknown[] {
    const elements = getTupleElements(type);

    const length = this.getByteLength(type) - 32;
    skip(length);

    return unpack(elements, value);
  },
};
