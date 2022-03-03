import handleOptOutMsg from '../../../api-lib/handleOptOutMsg';
import makeTelegramEventHandler from '../../../api-lib/make-telegram-event';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';

const handler = makeTelegramEventHandler(handleOptOutMsg);

export default verifyHasuraRequestMiddleware(handler);
