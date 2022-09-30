import {
  DecodeArgs,
  EncodeArgs,
  FunctionLike,
  Parser,
  SolidityFunction,
} from '../types';
import { concat, fromHex, toHex } from '../utils';
import { fixedBytes } from './fixed-bytes';

/**
 * Get the encoded function as buffer. It consists of the address (20 bytes) and function selector (4 bytes).
 *
 * @param input - The function-like input.
 * @returns The function as buffer.
 */
export const getFunction = (input: FunctionLike): Uint8Array => {
  if (typeof input === 'string') {
    return fromHex(input);
  }

  return concat([fromHex(input.address), fromHex(input.selector)]);
};

export const fn: Parser<FunctionLike, SolidityFunction> = {
  isDynamic: false,

  encode({ buffer, value }: EncodeArgs<FunctionLike>): Uint8Array {
    const fn = getFunction(value);
    return fixedBytes.encode({ type: 'bytes24', buffer, value: fn });
  },

  decode({ value }: DecodeArgs): SolidityFunction {
    return {
      address: `0x${toHex(value.slice(0, 20))}`,
      selector: toHex(value.slice(20, 24)),
    };
  },
};
