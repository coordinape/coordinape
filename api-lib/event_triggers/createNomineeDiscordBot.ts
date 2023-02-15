import handleNomineeCreatedMsg from '../handleNomineeCreatedMsg';
import makeDiscordBotEventHandler from '../make-discord-bot-event';

export default makeDiscordBotEventHandler(handleNomineeCreatedMsg);
