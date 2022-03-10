import handleOptOutMsg from '../handleOptOutMsg';
import makeTelegramEventHandler from '../make-telegram-event';
import { verifyHasuraRequestMiddleware } from '../validate';

const handler = makeTelegramEventHandler(handleOptOutMsg);

export default verifyHasuraRequestMiddleware(handler);
