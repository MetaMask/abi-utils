import { bytesToHex, concatBytes, hexToBytes } from '@metamask/utils';
import { create } from 'superstruct';
import { FunctionLike, solidityFunction, SolidityFunction } from '../types';
import { Parser } from './parser';
import { fixedBytes } from './fixed-bytes';

/**
 * Get the encoded function as buffer. It consists of the address (20 bytes) and
 * function selector (4 bytes).
 *
 * @param input - The function-like input.
 * @returns The function as buffer.
 */
export const getFunction = (input: FunctionLike): Uint8Array => {
  const value = create(input, solidityFunction());
  return concatBytes([hexToBytes(value.address), hexToBytes(value.selector)]);
};

export const fn: Parser<FunctionLike, SolidityFunction> = {
  isDynamic: false,

  getByteLength(): number {
    return 32;
  },

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
