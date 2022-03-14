import logdown from 'logdown';

import { LOGGER_ID } from 'config/constants';

export const getLogger = (title: string) => {
  const logger = logdown(`${LOGGER_ID}::${title}`);
  logger.state.isEnabled = true;
  return logger;
};

const logOnceRecord: Record<string, boolean> = {};

export const logOnce = (message: string, level: 'warn' | 'log' = 'log') => {
  if (logOnceRecord[message]) return;
  logOnceRecord[message] = true;
  console[level](message); // eslint-disable-line
};
