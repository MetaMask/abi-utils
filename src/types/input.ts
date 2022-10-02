export type BooleanLike = 'true' | 'false' | boolean;
export type NumberLike = number | bigint | string;

export type FunctionLike = string | SolidityFunction;
export type SolidityFunction = {
  address: string;
  selector: string;
};
