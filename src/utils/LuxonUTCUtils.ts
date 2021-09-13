import LuxonUtils from '@date-io/luxon';
import { DateTime } from 'luxon';

const UTC_ZONE = 'etc/utc';

class LuxonUTCUtils extends LuxonUtils {
  constructor(...args: any[]) {
    super(...args);

    this.date = function (value: any) {
      if (typeof value === 'undefined') {
        return DateTime.utc();
      }
      if (typeof value === 'string') {
        return DateTime.fromJSDate(new Date(value), {
          zone: UTC_ZONE,
        });
      }
      if (value instanceof DateTime) {
        return value;
      }
      return DateTime.fromJSDate(value, { zone: UTC_ZONE });
    };
  }
}

export default LuxonUTCUtils;
