import handleRefundGiveMsg from '../../../api-lib/handleRefundGiveMsg';
import makeTelegramEventHandler from '../../../api-lib/make-telegram-event';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';

const handler = makeTelegramEventHandler(handleRefundGiveMsg);

export default verifyHasuraRequestMiddleware(handler);
