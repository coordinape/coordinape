import handleOptOutMsg from '../handleOptOutMsg';
import makeDiscordEventHandler from '../make-discord-event';
import { verifyHasuraRequestMiddleware } from '../validate';

const handler = makeDiscordEventHandler(handleOptOutMsg);

export default verifyHasuraRequestMiddleware(handler);
