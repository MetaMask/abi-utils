import { bytesToHex, concatBytes, hexToBytes } from '@metamask/utils';
import { FunctionLike, SolidityFunction } from '../types';
import { Parser } from './parser';
import { fixedBytes } from './fixed-bytes';

/**
 * Get the encoded function as buffer. It consists of the address (20 bytes) and function selector (4 bytes).
 *
 * @param input - The function-like input.
 * @returns The function as buffer.
 */
export const getFunction = (input: FunctionLike): Uint8Array => {
  if (typeof input === 'string') {
    return hexToBytes(input);
  }

  return concatBytes([hexToBytes(input.address), hexToBytes(input.selector)]);
};

export const fn: Parser<FunctionLike, SolidityFunction> = {
  isDynamic: false,

  encode({ buffer, value }): Uint8Array {
    const fnValue = getFunction(value);
    return fixedBytes.encode({ type: 'bytes24', buffer, value: fnValue });
  },

  decode({ value }): SolidityFunction {
    return {
      address: bytesToHex(value.slice(0, 20)),
      selector: bytesToHex(value.slice(20, 24)),
    };
  },
};
