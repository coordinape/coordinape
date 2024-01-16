import { vi } from 'vitest';

export const mockLog = vi.fn();
export const mockError = vi.fn();

export const DebugLogger = vi.fn().mockImplementation(() => {
  return { log: mockLog, error: mockError };
});
