import { hasProperty, isObject } from '@metamask/utils';

/**
 * Attempt to get an error message from a value.
 *
 * - If the value is an error, the error's message is returned.
 * - If the value is an object with a `message` property, the value of that
 * property is returned.
 * - If the value is a string, the value is returned.
 * - Otherwise, "Unknown error." is returned.
 *
 * @param error - The value to get an error message from.
 * @returns The error message.
 */
export const getErrorMessage = (error?: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (
    isObject(error) &&
    hasProperty(error, 'message') &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  return 'Unknown error.';
};

/**
 * Get the error stack from a value. If the value is an error, the error's stack
 * is returned. Otherwise, it returns `undefined`.
 *
 * @param error - The value to get an error stack from.
 * @returns The error stack, or `undefined` if the value is not an error.
 */
export const getErrorStack = (error?: unknown): string | undefined => {
  if (error instanceof Error) {
    return error.stack;
  }

  return undefined;
};

export class ParserError extends Error {
  readonly name = 'ParserError';

  constructor(message: string, originalError?: unknown) {
    super(message);

    const originalStack = getErrorStack(originalError);
    if (originalStack) {
      this.stack = `${this.stack?.split('\n').slice(0, 2).join('\n')}

${originalStack}`;
    }
  }
}
