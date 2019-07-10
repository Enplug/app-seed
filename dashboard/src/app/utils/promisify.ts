/**
 * Promisifies callback-based function, keeping types intact
 */
export function promisify<T>(method: (...methodArgs: any[]) => any, thisContext?: any) {
  if (!method) {
    throw new Error('Undefined method passed to promisify!');
  }

  return (...args: any[]) => {
    return new Promise<T>((resolve, reject) => {
      // The order does matter - these are two last arguments for the function
      args.push((response: T) => resolve(response));
      args.push((error: Error) => reject(error));

      method.call(thisContext || this, ...args);
    });
  };
}
