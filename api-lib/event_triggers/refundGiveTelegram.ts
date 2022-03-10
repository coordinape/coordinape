import handleRefundGiveMsg from '../handleRefundGiveMsg';
import makeTelegramEventHandler from '../make-telegram-event';
import { verifyHasuraRequestMiddleware } from '../validate';

const handler = makeTelegramEventHandler(handleRefundGiveMsg);

export default verifyHasuraRequestMiddleware(handler);
