import handleNomineeCreatedMsg from '../../../api-lib/handleNomineeCreatedMsg';
import makeTelegramEventHandler from '../../../api-lib/make-telegram-event';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';

const handler = makeTelegramEventHandler(handleNomineeCreatedMsg);

export default verifyHasuraRequestMiddleware(handler);
