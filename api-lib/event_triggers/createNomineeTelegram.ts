import handleNomineeCreatedMsg from '../handleNomineeCreatedMsg';
import makeTelegramEventHandler from '../make-telegram-event';

export default makeTelegramEventHandler(handleNomineeCreatedMsg);
