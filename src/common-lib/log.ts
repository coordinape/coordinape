/* eslint-disable no-console */
import debug from 'debug';

export class DebugLogger {
  log: ReturnType<typeof debug>;
  error: ReturnType<typeof debug>;
  constructor(location: string) {
    // set all locations under our `coordinape` namespace
    const domain = 'coordinape:' + location;
    this.log = debug(domain + ':log');
    // log to stdout
    this.log.log = console.log;
    // print errors to stderr (debug's default)
    this.error = debug(domain + ':error');
    this.error.log = console.error;
  }
}
