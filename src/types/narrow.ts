/**
 * ts-toolbelt `Narrow` type
 * https://github.com/millsp/ts-toolbelt/blob/master/sources/Function/Narrow.ts
 */

export type Try<A1 extends any, A2 extends any, Catch = never> = A1 extends A2 ? A1 : Catch;

export type Narrowable = string | number | bigint | boolean;

type NarrowRaw<A> =
  | (A extends [] ? [] : never)
  | (A extends Narrowable ? A : never)
  | {
      // eslint-disable-next-line @typescript-eslint/ban-types
      [K in keyof A]: A[K] extends Function ? A[K] : NarrowRaw<A[K]>;
    };

export type Narrow<A extends any> = Try<A, [], NarrowRaw<A>>;
