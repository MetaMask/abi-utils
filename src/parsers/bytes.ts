import {
  Bytes,
  bytesToNumber,
  concatBytes,
  numberToBytes,
  valueToBytes,
} from '@metamask/utils';
import { padEnd, padStart } from '../utils';
import { Parser } from './parser';

export const bytes: Parser<Bytes, Uint8Array> = {
  isDynamic: true,

  isType: (type) => type.startsWith('bytes'),

  getByteLength(): number {
    return 32;
  },

  encode({ buffer, value }): Uint8Array {
    // TODO: See if we want to accept "0x" as a valid value, and move it to
    // `@metamask/utils`.
    const bufferValue = value === '0x' ? new Uint8Array() : valueToBytes(value);
    const paddedSize = Math.ceil(bufferValue.byteLength / 32) * 32;

    return concatBytes([
      buffer,
      padStart(numberToBytes(bufferValue.byteLength)),
      padEnd(bufferValue, paddedSize),
    ]);
  },

  decode({ value }): Uint8Array {
    const bytesValue = value.subarray(0, 32);
    const length = bytesToNumber(bytesValue);

    // Since we're returning a `Uint8Array`, we use `slice` to copy the bytes
    // into a new array.
    return value.slice(32, 32 + length);
  },
};
