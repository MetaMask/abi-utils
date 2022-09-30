import { toBuffer } from './buffer';

/**
 * Get a bigint from a two's complement encoded buffer or hexadecimal string.
 *
 * @param buffer - The buffer to get the number for.
 * @returns The parsed number.
 */
export const fromTwosComplement = (buffer: string | Uint8Array): bigint => {
  const bufferValue = toBuffer(buffer);

  let value = 0n;
  for (const byte of bufferValue) {
    value = (value << 8n) + BigInt(byte);
  }

  return BigInt.asIntN(bufferValue.length * 8, value);
};

/**
 * Get a two's complement encoded buffer from a bigint.
 *
 * @param value - The number to get the buffer for.
 * @param length - The number of bytes to pad the buffer to.
 * @returns The two's complement encoded buffer.
 */
export const toTwosComplement = (value: bigint, length: number): Uint8Array => {
  const buffer = new Uint8Array(length);
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = Number(BigInt.asUintN(8, value));
    value >>= 8n;
  }

  return buffer.reverse();
};
