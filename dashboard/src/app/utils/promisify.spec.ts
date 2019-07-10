import { promisify } from './promisify';

describe('Service promisifier', () => {
  it('should be a defined export', () => {
    expect(promisify).toBeDefined();
  });

  it('should handle success', async () => {
    const testFn = (arg: string, successCb) => {
      return successCb(arg);
    };

    const promisifiedFn = promisify<string>(testFn);
    const result = await promisifiedFn('testing!');

    expect(result).toEqual('testing!');
  });

  it('should handle error', async () => {
    const testFn = (arg: string, successCb, errorCb) => {
      return errorCb(new Error(arg));
    };

    const promisifiedFn = promisify<string>(testFn);

    try {
      await promisifiedFn('testing!');

      throw new Error('Not thrown!');
    } catch (err) {
      expect(err.message).toEqual('testing!');
    }
  });

  it('should keep the context', async () => {
    const testFn = function(successCb) {
      return successCb(this);
    };

    const context = { test: 'app' };

    const promisifiedFn = promisify<string>(testFn, context);
    const result = await promisifiedFn();

    expect(result).toEqual(context as any);
  });
});
