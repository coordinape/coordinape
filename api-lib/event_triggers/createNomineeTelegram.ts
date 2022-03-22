import handleNomineeCreatedMsg from '../handleNomineeCreatedMsg';
import makeTelegramEventHandler from '../make-telegram-event';
import { verifyHasuraRequestMiddleware } from '../validate';

const handler = makeTelegramEventHandler(handleNomineeCreatedMsg);

export default verifyHasuraRequestMiddleware(handler);
