export type DynamicFunction = (type: string) => boolean;

export type EncodeArgs<Value> = {
  /**
   * The bytes to encode the value in.
   */
  buffer: Uint8Array;

  /**
   * The type of the value to encode.
   */
  type: string;

  /**
   * The value to encode.
   */
  value: Value;
};

export type DecodeArgs = {
  /**
   * The type of the value to decode.
   */
  type: string;

  /**
   * The value to decode.
   */
  value: Uint8Array;

  /**
   * A function to skip a certain number of bytes for parsing. This is currently only used by static tuple types.
   *
   * @param length - The number of bytes to skip.
   */
  skip(length: number): void;
};

export type Parser<EncodeValue = unknown, DecodeValue = EncodeValue> = {
  isDynamic: boolean | DynamicFunction;

  isType?(type: string): boolean;
  encode(value: EncodeArgs<EncodeValue>): Uint8Array;
  decode(args: DecodeArgs): DecodeValue;
};
