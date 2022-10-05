import {
  add0x,
  bytesToHex,
  concatBytes,
  hexToBytes,
  remove0x,
} from '@metamask/utils';
import { padStart } from '../utils';
import { Parser } from './parser';

export const address: Parser<string> = {
  isDynamic: false,

  isType: (type) => type === 'address',

  getByteLength(): number {
    return 32;
  },

  encode({ buffer, value }): Uint8Array {
    const addressBuffer = padStart(hexToBytes(remove0x(value)));

    return concatBytes([buffer, addressBuffer]);
  },

  decode({ value }): string {
    return add0x(bytesToHex(value.slice(12, 32)));
  },
};
