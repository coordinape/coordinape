import { LOGGER_ID } from 'config/constants';
import logdown from 'logdown';

export const getLogger = (title: string) => {
  const logger = logdown(`${LOGGER_ID}::${title}`);
  logger.state.isEnabled = true;
  return logger;
};
