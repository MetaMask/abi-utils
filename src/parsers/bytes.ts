import { BytesLike, DecodeArgs, Parser } from '../types';
import { addPadding, concat, toBuffer, toNumber } from '../utils';

export const bytes: Parser<BytesLike, Uint8Array> = {
  isDynamic: true,

  encode({ buffer, value }): Uint8Array {
    const bufferValue = toBuffer(value);
    const paddedSize = Math.ceil(bufferValue.byteLength / 32) * 32;

    return concat([buffer, toBuffer(bufferValue.byteLength), addPadding(bufferValue, paddedSize)]);
  },

  decode({ value }: DecodeArgs): Uint8Array {
    const buffer = value.slice(0, 32);
    const length = Number(toNumber(buffer));

    return value.subarray(32, 32 + length);
  }
};
