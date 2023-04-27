export const NUMBER_VECTORS = [
  {
    type: 'uint8',
    value: BigInt('0'),
    hexadecimal:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
  },
  {
    type: 'uint8',
    value: BigInt('1'),
    hexadecimal:
      '0x0000000000000000000000000000000000000000000000000000000000000001',
  },
  {
    type: 'uint8',
    value: BigInt('255'),
    hexadecimal:
      '0x00000000000000000000000000000000000000000000000000000000000000ff',
  },
  {
    type: 'uint16',
    value: BigInt('65535'),
    hexadecimal:
      '0x000000000000000000000000000000000000000000000000000000000000ffff',
  },
  {
    type: 'uint32',
    value: BigInt('4294967295'),
    hexadecimal:
      '0x00000000000000000000000000000000000000000000000000000000ffffffff',
  },
  {
    type: 'uint64',
    value: BigInt('18446744073709551615'),
    hexadecimal:
      '0x000000000000000000000000000000000000000000000000ffffffffffffffff',
  },
  {
    type: 'uint128',
    value: BigInt('340282366920938463463374607431768211455'),
    hexadecimal:
      '0x00000000000000000000000000000000ffffffffffffffffffffffffffffffff',
  },
  {
    type: 'uint256',
    value: BigInt(
      '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    ),
    hexadecimal:
      '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  },
  {
    type: 'int8',
    value: BigInt('-128'),
    hexadecimal:
      '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff80',
  },
  {
    type: 'int8',
    value: BigInt('127'),
    hexadecimal:
      '0x000000000000000000000000000000000000000000000000000000000000007f',
  },
  {
    type: 'int16',
    value: BigInt('-32768'),
    hexadecimal:
      '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8000',
  },
  {
    type: 'int16',
    value: BigInt('32767'),
    hexadecimal:
      '0x0000000000000000000000000000000000000000000000000000000000007fff',
  },
  {
    type: 'int32',
    value: BigInt('-2147483648'),
    hexadecimal:
      '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffff80000000',
  },
  {
    type: 'int32',
    value: BigInt('2147483647'),
    hexadecimal:
      '0x000000000000000000000000000000000000000000000000000000007fffffff',
  },
  {
    type: 'int64',
    value: BigInt('-9223372036854775808'),
    hexadecimal:
      '0xffffffffffffffffffffffffffffffffffffffffffffffff8000000000000000',
  },
  {
    type: 'int64',
    value: BigInt('9223372036854775807'),
    hexadecimal:
      '0x0000000000000000000000000000000000000000000000007fffffffffffffff',
  },
  {
    type: 'int128',
    value: BigInt('-170141183460469231731687303715884105728'),
    hexadecimal:
      '0xffffffffffffffffffffffffffffffff80000000000000000000000000000000',
  },
  {
    type: 'int128',
    value: BigInt('170141183460469231731687303715884105727'),
    hexadecimal:
      '0x000000000000000000000000000000007fffffffffffffffffffffffffffffff',
  },
  {
    type: 'int256',
    value: BigInt(
      '-57896044618658097711785492504343953926634992332820282019728792003956564819968',
    ),
    hexadecimal:
      '0x8000000000000000000000000000000000000000000000000000000000000000',
  },
  {
    type: 'int256',
    value: BigInt(
      '57896044618658097711785492504343953926634992332820282019728792003956564819967',
    ),
    hexadecimal:
      '0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  },
];

export const DECODE_OUT_OF_RANGE_NUMBER_VECTORS = [
  {
    type: 'uint8',
    hexadecimal:
      '0x0000000000000000000000000000000000000000000000000000000000000100',
  },
  {
    type: 'uint16',
    hexadecimal:
      '0x0000000000000000000000000000000000000000000000000000000000010000',
  },
  {
    type: 'uint32',
    hexadecimal:
      '0x0000000000000000000000000000000000000000000000000000000100000000',
  },
  {
    type: 'uint64',
    hexadecimal:
      '0x0000000000000000000000000000000000000000000000010000000000000000',
  },
  {
    type: 'uint128',
    hexadecimal:
      '0x0000000000000000000000000000000100000000000000000000000000000000',
  },
  {
    type: 'int8',
    hexadecimal:
      '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f',
  },
  {
    type: 'int16',
    hexadecimal:
      '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7fff',
  },
  {
    type: 'int32',
    hexadecimal:
      '0xffffffffffffffffffffffffffffffffffffffffffffffff7fffffff00000000',
  },
  {
    type: 'int64',
    hexadecimal:
      '0xffffffffffffffffffffffffffffffffffffffff7fffffffffffffff00000000',
  },
  {
    type: 'int128',
    hexadecimal:
      '0xffffffffffffffffffffffffffffffff7fffffffffffffffffffffffffffffff',
  },
];

// Values that are out of range for the given type.
export const OUT_OF_RANGE_NUMBER_VECTORS = [
  {
    type: 'uint256',
    value: BigInt(2) ** BigInt(256),
  },
  {
    type: 'uint8',
    value: BigInt(2) ** BigInt(8),
  },
  {
    type: 'int256',
    value: BigInt(2) ** BigInt(255),
  },
  {
    type: 'int256',
    value: BigInt(2) ** BigInt(255) * BigInt(-1) - BigInt(1),
  },
  {
    type: 'int8',
    value: BigInt(2) ** BigInt(7),
  },
  {
    type: 'int8',
    value: BigInt(-2) ** BigInt(7) - BigInt(1),
  },
];

export const INVALID_NUMBER_TYPE_VECTORS = [
  '',
  'unt',
  'iunt',
  'array',
  'bytes',
  'string',
  'bool',
  'address',
];
