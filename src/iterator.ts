import { assert } from '@metamask/utils';

type IteratorValue = {
  skip(length: number): void;
  value: Uint8Array;
};

/**
 * Iterate over a buffer with the specified size. This will yield a part of the
 * buffer starting at an increment of the specified size, until the end of the
 * buffer is reached.
 *
 * Calling the `skip` function will make it skip the specified number of bytes.
 *
 * @param buffer - The buffer to iterate over.
 * @param size - The number of bytes to iterate with.
 * @returns An iterator that yields the parts of the byte array.
 * @yields The parts of the byte array.
 */
export const iterate = function* (
  buffer: Uint8Array,
  size = 32,
): Generator<IteratorValue, IteratorValue, IteratorValue> {
  for (let pointer = 0; pointer < buffer.length; pointer += size) {
    const skip = (length: number) => {
      assert(length >= 0, 'Cannot skip a negative number of bytes.');
      assert(length % size === 0, 'Length must be a multiple of the size.');

      pointer += length;
    };

    const value = buffer.subarray(pointer);

    yield { skip, value };
  }

  return {
    skip: () => undefined,
    value: new Uint8Array(),
  };
};
