import { getErrorMessage, getErrorStack, ParserError } from './errors';

describe('getErrorMessage', () => {
  it('returns the error message if the value is a string', () => {
    expect(getErrorMessage('foo')).toBe('foo');
  });

  it('returns the error message if the value is an error', () => {
    expect(getErrorMessage(new Error('foo'))).toBe('foo');
  });

  it('returns the error message if the value is an object with a message property', () => {
    expect(getErrorMessage({ message: 'foo' })).toBe('foo');
  });

  it('returns "Unknown error." if the value is not an error', () => {
    expect(getErrorMessage()).toBe('Unknown error.');
  });
});

describe('getErrorStack', () => {
  it('returns the error stack if the value is an error', () => {
    const error = new Error('foo');
    expect(getErrorStack(error)).toBe(error.stack);
  });

  it('returns undefined if the value is not an error', () => {
    expect(getErrorStack()).toBeUndefined();
  });
});

describe('ParserError', () => {
  it('wraps the original error stack', () => {
    const originalError = new Error('original error');
    const parserError = new ParserError('parser error', originalError);

    expect(parserError.stack).toContain(originalError.stack);
  });
});
