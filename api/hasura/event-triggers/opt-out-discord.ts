import handleOptOutMsg from '../../../api-lib/handleOptOutMsg';
import makeDiscordEventHandler from '../../../api-lib/make-discord-event';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';

const handler = makeDiscordEventHandler(handleOptOutMsg);

export default verifyHasuraRequestMiddleware(handler);
