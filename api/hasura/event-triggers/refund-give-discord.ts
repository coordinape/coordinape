import handleRefundGiveMsg from '../../../api-lib/handleRefundGiveMsg';
import makeDiscordEventHandler from '../../../api-lib/make-discord-event';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';

const handler = makeDiscordEventHandler(handleRefundGiveMsg);

export default verifyHasuraRequestMiddleware(handler);
