import handleNomineeCreatedMsg from '../handleNomineeCreatedMsg';
import makeDiscordEventHandler from '../make-discord-event';

export default makeDiscordEventHandler(handleNomineeCreatedMsg);
