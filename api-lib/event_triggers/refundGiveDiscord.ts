import handleRefundGiveMsg from '../handleRefundGiveMsg';
import makeDiscordEventHandler from '../make-discord-event';
import { verifyHasuraRequestMiddleware } from '../validate';

const handler = makeDiscordEventHandler(handleRefundGiveMsg);

export default verifyHasuraRequestMiddleware(handler);
