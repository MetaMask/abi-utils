export type BytesLike = string | Uint8Array;
export type BooleanLike = 'true' | 'false' | 'yes' | 'no' | boolean;
export type NumberLike = number | bigint | string;

export type FunctionLike = string | SolidityFunction;
export type SolidityFunction = {
  address: string;
  selector: string;
};
