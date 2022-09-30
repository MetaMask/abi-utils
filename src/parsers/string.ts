import { DecodeArgs, Parser } from '../types';
import { fromUtf8, toUtf8 } from '../utils';
import { bytes } from './bytes';

export const string: Parser<string> = {
  isDynamic: true,

  encode({ buffer, value }): Uint8Array {
    return bytes.encode({ type: 'bytes', buffer, value: fromUtf8(value) });
  },

  decode(args: DecodeArgs): string {
    return toUtf8(bytes.decode(args));
  }
};
