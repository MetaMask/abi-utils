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

  encode({ buffer, value }): Uint8Array {
    const bufferValue = valueToBytes(value);
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

    return value.subarray(32, 32 + length);
  },
};
