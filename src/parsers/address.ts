import { DecodeArgs, Parser } from '../types';
import { concat, fromHex, stripPrefix, toHex } from '../utils';

export const address: Parser<string> = {
  isDynamic: false,

  encode({ buffer, value }): Uint8Array {
    const addressBuffer = fromHex(stripPrefix(value).padStart(64, '0'));

    return concat([buffer, addressBuffer]);
  },

  decode({ value }: DecodeArgs): string {
    return `0x${toHex(value.slice(12, 32))}`;
  },
};
