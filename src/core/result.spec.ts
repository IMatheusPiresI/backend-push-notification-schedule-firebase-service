import { describe, it, expect } from 'vitest';
import { ResultSuccess, ResultError, Result, success, error } from './result';

describe('Result', () => {
  describe('ResultSuccess', () => {
    it('should create a success result with a value', () => {
      const result = new ResultSuccess<string, number>(42);

      expect(result.value).toBe(42);
      expect(result.isSuccess()).toBe(true);
      expect(result.isError()).toBe(false);
    });

    it('should create a success result with void value', () => {
      const result = new ResultSuccess<string, void>(undefined);

      expect(result.value).toBeUndefined();
      expect(result.isSuccess()).toBe(true);
      expect(result.isError()).toBe(false);
    });

    it('should create a success result with object value', () => {
      const data = { id: 1, name: 'test' };
      const result = new ResultSuccess<string, typeof data>(data);

      expect(result.value).toEqual(data);
      expect(result.isSuccess()).toBe(true);
      expect(result.isError()).toBe(false);
    });

    it('should have correct type guards', () => {
      const result = new ResultSuccess<string, number>(10);

      if (result.isSuccess()) {
        expect(result.value).toBe(10);
        // @ts-expect-error - error should not exist on success
        expect(result.error).toBeUndefined();
      }

      if (result.isError()) {
        expect(true).toBe(false);
      }
    });
  });

  describe('ResultError', () => {
    it('should create an error result with an error', () => {
      const errorValue = 'Something went wrong';
      const result = new ResultError<string, number>(errorValue);

      expect(result.error).toBe(errorValue);
      expect(result.isError()).toBe(true);
      expect(result.isSuccess()).toBe(false);
    });

    it('should create an error result with object error', () => {
      const errorObj = { code: 'ERR_001', message: 'Error occurred' };
      const result = new ResultError<typeof errorObj, number>(errorObj);

      expect(result.error).toEqual(errorObj);
      expect(result.isError()).toBe(true);
      expect(result.isSuccess()).toBe(false);
    });

    it('should have correct type guards', () => {
      const result = new ResultError<string, number>('Error message');

      if (result.isError()) {
        expect(result.error).toBe('Error message');
        // @ts-expect-error - value should not exist on error
        expect(result.value).toBeUndefined();
      }

      if (result.isSuccess()) {
        // This should never execute
        expect(true).toBe(false);
      }
    });
  });

  describe('success function', () => {
    it('should create a success result with value', () => {
      const result = success<string, number>(42);

      expect(result.isSuccess()).toBe(true);
      expect(result.isError()).toBe(false);

      if (result.isSuccess()) {
        expect(result.value).toBe(42);
      }
    });

    it('should create a success result without value (void)', () => {
      const result = success<string>();

      expect(result.isSuccess()).toBe(true);
      expect(result.isError()).toBe(false);

      if (result.isSuccess()) {
        expect(result.value).toBeUndefined();
      }
    });

    it('should create a success result with string value', () => {
      const result = success<string, string>('test');

      expect(result.isSuccess()).toBe(true);
      if (result.isSuccess()) {
        expect(result.value).toBe('test');
      }
    });

    it('should create a success result with array value', () => {
      const array = [1, 2, 3];
      const result = success<string, number[]>(array);

      expect(result.isSuccess()).toBe(true);
      if (result.isSuccess()) {
        expect(result.value).toEqual(array);
      }
    });

    it('should create a success result with null value', () => {
      const result = success<string, null>(null);

      expect(result.isSuccess()).toBe(true);
      if (result.isSuccess()) {
        expect(result.value).toBeNull();
      }
    });
  });

  describe('error function', () => {
    it('should create an error result with string error', () => {
      const result = error<string, number>('Error occurred');

      expect(result.isError()).toBe(true);
      expect(result.isSuccess()).toBe(false);

      if (result.isError()) {
        expect(result.error).toBe('Error occurred');
      }
    });

    it('should create an error result with object error', () => {
      const errorObj = { code: 'ERR_001', message: 'Something failed' };
      const result = error<typeof errorObj, number>(errorObj);

      expect(result.isError()).toBe(true);
      if (result.isError()) {
        expect(result.error).toEqual(errorObj);
      }
    });

    it('should create an error result with Error instance', () => {
      const errorInstance = new Error('Test error');
      const result = error<Error, number>(errorInstance);

      expect(result.isError()).toBe(true);
      if (result.isError()) {
        expect(result.error).toBe(errorInstance);
        expect(result.error.message).toBe('Test error');
      }
    });
  });

  describe('Result type union', () => {
    it('should handle Result type correctly with success', () => {
      const result: Result<string, number> = success<string, number>(100);

      if (result.isSuccess()) {
        expect(result.value).toBe(100);
      } else {
        expect(result.error).toBeDefined();
      }
    });

    it('should handle Result type correctly with error', () => {
      const result: Result<string, number> = error<string, number>('Failed');

      if (result.isError()) {
        expect(result.error).toBe('Failed');
      } else {
        expect(result.value).toBeDefined();
      }
    });

    it('should allow type narrowing in conditional blocks', () => {
      const successResult: Result<string, number> = success<string, number>(5);
      const errorResult: Result<string, number> = error<string, number>(
        'Error',
      );

      if (successResult.isSuccess()) {
        const value: number = successResult.value;
        expect(value).toBe(5);
      }

      if (errorResult.isError()) {
        const err: string = errorResult.error;
        expect(err).toBe('Error');
      }
    });
  });

  describe('Edge cases', () => {
    it('should handle zero as a valid success value', () => {
      const result = success<string, number>(0);

      expect(result.isSuccess()).toBe(true);
      if (result.isSuccess()) {
        expect(result.value).toBe(0);
      }
    });

    it('should handle empty string as a valid success value', () => {
      const result = success<string, string>('');

      expect(result.isSuccess()).toBe(true);
      if (result.isSuccess()) {
        expect(result.value).toBe('');
      }
    });

    it('should handle false as a valid success value', () => {
      const result = success<string, boolean>(false);

      expect(result.isSuccess()).toBe(true);
      if (result.isSuccess()) {
        expect(result.value).toBe(false);
      }
    });

    it('should handle empty string as error', () => {
      const result = error<string, number>('');

      expect(result.isError()).toBe(true);
      if (result.isError()) {
        expect(result.error).toBe('');
      }
    });
  });
});
