const logOnceRecord: Record<string, boolean> = {};

export const logOnce = (message: string, level: 'warn' | 'log' = 'log') => {
  if (logOnceRecord[message]) return;
  logOnceRecord[message] = true;
  console[level](message); // eslint-disable-line
};
