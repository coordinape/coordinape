// utilities to write type-safer code

// like object entries, but better typed
export function entries<O>(o: O) {
  return Object.entries(o) as [keyof O, O[keyof O]][];
}

// type guard for filtering out null objects
export const isNotNull = <T>(x: T | null): x is T => {
  return x !== null;
};
