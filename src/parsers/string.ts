import { bytesToString, stringToBytes } from '@metamask/utils';
import { Parser } from './parser';
import { bytes } from './bytes';

export const string: Parser<string> = {
  isDynamic: true,

  encode({ buffer, value }): Uint8Array {
    return bytes.encode({ type: 'bytes', buffer, value: stringToBytes(value) });
  },

  decode(args): string {
    return bytesToString(bytes.decode(args));
  },
};
