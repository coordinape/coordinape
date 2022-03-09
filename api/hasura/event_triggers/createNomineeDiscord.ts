import handleNomineeCreatedMsg from '../../../api-lib/handleNomineeCreatedMsg';
import makeDiscordEventHandler from '../../../api-lib/make-discord-event';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';

const handler = makeDiscordEventHandler(handleNomineeCreatedMsg);

export default verifyHasuraRequestMiddleware(handler);
