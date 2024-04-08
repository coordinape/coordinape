import { useState, useEffect, useRef } from 'react';

export default function useDebounced<T>(
  value: T,
  delayMs = 500
): [T, (val: T) => void] {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef<number>();

  useEffect(() => {
    timeoutRef.current = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, delayMs]);

  const overrideValue = (value: T) => {
    // note: value isn't updated here
    setDebouncedValue(value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return [debouncedValue, overrideValue];
}
