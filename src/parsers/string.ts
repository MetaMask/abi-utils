import { bytesToString, stringToBytes } from '@metamask/utils';
import { Parser } from './parser';
import { bytes } from './bytes';

export const string: Parser<string> = {
  isDynamic: true,

  isType: (type) => type === 'string',

  getByteLength(): number {
    return 32;
  },

  encode({ buffer, value }): Uint8Array {
    return bytes.encode({ type: 'bytes', buffer, value: stringToBytes(value) });
  },

  decode(args): string {
    return bytesToString(bytes.decode(args));
  },
};
