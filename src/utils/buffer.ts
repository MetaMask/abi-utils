const BUFFER_WIDTH = 32;
const HEX_REGEX = /^[a-f0-9]+$/i;

export type BinaryLike = string | number | bigint | ArrayBufferLike | number[];

export const stripPrefix = (value: string): string => {
  if (value.startsWith('0x')) {
    return value.substring(2);
  }

  return value;
};

/**
 * Returns an instance of `TextEncoder` that works with both Node.js and web browsers.
 */
export const getTextEncoder = (): TextEncoder => {
  if (typeof TextEncoder === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Encoder = require('util').TextEncoder;
    return new Encoder();
  }

  return new TextEncoder();
};

/**
 * Returns an instance of `TextDecoder` that works with both Node.js and web browsers.
 */
export const getTextDecoder = (encoding = 'utf8'): TextDecoder => {
  if (typeof TextEncoder === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Decoder = require('util').TextDecoder;
    return new Decoder(encoding);
  }

  return new TextDecoder(encoding);
};

/**
 * Get a buffer as UTF-8 encoded string.
 *
 * @param data The buffer to convert to UTF-8.
 * @return The buffer as UTF-8 encoded string.
 */
export const toUtf8 = (data: Uint8Array): string => {
  return getTextDecoder().decode(data);
};

/**
 * Get a UTF-8 encoded string as buffer.
 *
 * @param data The string to convert to a buffer.
 * @return The buffer.
 */
export const fromUtf8 = (data: string): Uint8Array => {
  return getTextEncoder().encode(data);
};

/**
 * Get a Uint8Array as hexadecimal string.
 *
 * @param data The buffer to convert to a hexadecimal string.
 * @return The buffer as hexadecimal string.
 */
export const toHex = (data: Uint8Array): string => {
  return Array.from(data)
    .map((n) => `0${n.toString(16)}`.slice(-2))
    .join('');
};

/**
 * Get a hexadecimal string as Uint8Array.
 *
 * @param data The hexadecimal string to convert to a buffer.
 * @return The buffer.
 */
export const fromHex = (data: string): Uint8Array => {
  if (data.startsWith('0x')) {
    data = data.slice(2);
  }

  if (data.length % 2 !== 0) {
    throw new Error('Length must be even');
  }

  if (!data.match(HEX_REGEX)) {
    throw new Error('Input must be hexadecimal');
  }

  return new Uint8Array(data.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
};

/**
 * Attempt to parse a value as Uint8Array. If `data` is a number, this will pad the buffer to 32 bytes.
 *
 * @param data The value to parse as Uint8Array.
 * @return The resulting Uint8Array.
 */
export const toBuffer = (data: BinaryLike): Uint8Array => {
  if (typeof data === 'string') {
    return fromHex(data);
  }

  if (typeof data === 'number' || typeof data === 'bigint') {
    const string = data.toString(16);
    return fromHex(string.padStart(BUFFER_WIDTH * 2, '0'));
  }

  return new Uint8Array(data);
};

/**
 * Safe function to merge multiple Uint8Arrays into a single Uint8array. This works with buffers of any size.
 *
 * @param buffers The buffers to combine.
 * @return The combined buffers.
 */
export const concat = (buffers: Uint8Array[]): Uint8Array => {
  return buffers.reduce((a, b) => {
    const buffer = new Uint8Array(a.length + b.length);
    buffer.set(a);
    buffer.set(b, a.length);

    return buffer;
  }, new Uint8Array(0));
};

/**
 * Set `buffer` in `target` at the specified position.
 *
 * @param target The buffer to set to.
 * @param buffer The buffer to set in the target.
 * @param position The position at which to set the target.
 * @return The combined buffer.
 */
export const set = (target: Uint8Array, buffer: Uint8Array, position: number): Uint8Array => {
  return concat([target.subarray(0, position), buffer, target.subarray(position + buffer.length)]);
};

/**
 * Add padding to a buffer. If the buffer is larger than `length`, this function won't do anything. If it's smaller, the
 * buffer will be padded to the specified length, with extra zeroes at the end.
 *
 * @param buffer The buffer to add padding to.
 * @param [length] The number of bytes to pad the buffer to.
 * @return The padded buffer.
 */
export const addPadding = (buffer: Uint8Array, length = BUFFER_WIDTH): Uint8Array => {
  const padding = new Uint8Array(Math.max(length - buffer.length, 0)).fill(0x00);
  return concat([buffer, padding]);
};

/**
 * Get a number from a buffer. Returns zero if the buffer is empty.
 *
 * @param buffer The buffer to get a number for.
 * @return The parsed number.
 */
export const toNumber = (buffer: Uint8Array): bigint => {
  const hex = toHex(buffer);
  if (hex.length === 0) {
    return BigInt(0);
  }

  return BigInt(`0x${hex}`);
};
