import { create } from 'superstruct';
import { hexToBytes } from '../../../utils';
import { bigint, boolean, bytes, hex, solidityFunction } from './input';

describe('hex', () => {
  it('creates a hex string', () => {
    expect(create('f00', hex())).toBe('0xf00');
    expect(create('0xf00', hex())).toBe('0xf00');
  });
});

describe('bytes', () => {
  it('creates a byte array', () => {
    expect(create('0xf00', bytes())).toStrictEqual(new Uint8Array([0xf, 0x0]));
    expect(create(new Uint8Array([0xf, 0x0]), bytes())).toStrictEqual(
      new Uint8Array([0xf, 0x0]),
    );
  });

  it('asserts the length of the byte array', () => {
    expect(() => create('0xf00', bytes(1))).toThrow(
      'Expected a value of type `instance`, but received: `15,0`',
    );

    expect(() => create(new Uint8Array([0xf, 0x0]), bytes(1))).toThrow(
      'Expected a value of type `instance`, but received: `15,0`',
    );
  });
});

describe('boolean', () => {
  it('creates a boolean', () => {
    expect(create(true, boolean())).toBe(true);
    expect(create('true', boolean())).toBe(true);
    expect(create(false, boolean())).toBe(false);
    expect(create('false', boolean())).toBe(false);
  });
});

describe('bigint', () => {
  it('creates a bigint', () => {
    expect(create(1, bigint())).toBe(BigInt(1));
    expect(create(BigInt(BigInt(1)), bigint())).toBe(BigInt(1));
    expect(create('0x1', bigint())).toBe(BigInt(1));
  });
});

describe('solidityFunction', () => {
  it('creates a function', () => {
    expect(
      create(
        hexToBytes('0x6b175474e89094c44da98b954eedeac495271d0f70a08231'),
        solidityFunction(),
      ),
    ).toStrictEqual({
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      selector: '0x70a08231',
    });
  });
});
