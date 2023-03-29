import { VercelApiHandler, VercelRequest, VercelResponse } from '@vercel/node';

import activityHandler from '../../../api-lib/event_triggers/activity/index';
import checkNomineeDiscord from '../../../api-lib/event_triggers/checkNomineeDiscord';
import checkNomineeDiscordBot from '../../../api-lib/event_triggers/checkNomineeDiscordBot';
import checkNomineeTelegram from '../../../api-lib/event_triggers/checkNomineeTelegram';
import createCircleCRM from '../../../api-lib/event_triggers/createCircleCRM';
import createContributionInteractionEvent from '../../../api-lib/event_triggers/createContributionInteractionEvent';
import createNomineeDiscord from '../../../api-lib/event_triggers/createNomineeDiscord';
import createNomineeDiscordBot from '../../../api-lib/event_triggers/createNomineeDiscordBot';
import createNomineeTelegram from '../../../api-lib/event_triggers/createNomineeTelegram';
import createReactionInteractionEvent from '../../../api-lib/event_triggers/createReactionInteractionEvent';
import createVouchedUser from '../../../api-lib/event_triggers/createVouchedUser';
import discordUserLinked from '../../../api-lib/event_triggers/discordUserLinked';
import insertOrgMember from '../../../api-lib/event_triggers/insertOrgMember';
import optOutDiscord from '../../../api-lib/event_triggers/optOutDiscord';
import optOutDiscordBot from '../../../api-lib/event_triggers/optOutDiscordBot';
import optOutTelegram from '../../../api-lib/event_triggers/optOutTelegram';
import refundGiveDiscord from '../../../api-lib/event_triggers/refundGiveDiscord';
import refundGiveTelegram from '../../../api-lib/event_triggers/refundGiveTelegram';
import refundPendingGift from '../../../api-lib/event_triggers/refundPendingGift';
import removeTeammate from '../../../api-lib/event_triggers/removeTeammate';
import sendInteractionEventToMixpanel from '../../../api-lib/event_triggers/sendInteractionEventToMixpanel';
import userAddedDiscordBot from '../../../api-lib/event_triggers/userAddedDiscordBot';
import userRemovedDiscordBot from '../../../api-lib/event_triggers/userRemovedDiscordBot';
import vouchDiscord from '../../../api-lib/event_triggers/vouchDiscord';
import vouchDiscordBot from '../../../api-lib/event_triggers/vouchDiscordBot';
import vouchTelegram from '../../../api-lib/event_triggers/vouchTelegram';
import { GraphQLTypes } from '../../../api-lib/gql/__generated__/zeus';
import { EventTriggerPayload } from '../../../api-lib/types';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';

type HandlerDict = { [handlerName: string]: VercelApiHandler };

const HANDLERS: HandlerDict = {
  activityUserInsert: activityHandler,
  activityEpochInsert: activityHandler,
  activityContributionInsert: activityHandler,
  checkNomineeDiscord,
  checkNomineeDiscordBot,
  checkNomineeTelegram,
  createCircleCRM,
  createContributionInteractionEvent,
  createReactionInteractionEvent,
  createNomineeDiscord,
  userAddedDiscordBot,
  userRemovedDiscordBot,
  createNomineeDiscordBot,
  createNomineeTelegram,
  createVouchedUser,
  discordUserLinked,
  insertOrgMember,
  optOutDiscord,
  optOutDiscordBot,
  optOutTelegram,
  refundGiveDiscord,
  refundGiveTelegram,
  refundPendingGift,
  removeTeammate,
  sendInteractionEventToMixpanel,
  vouchDiscord,
  vouchDiscordBot,
  vouchTelegram,
};

async function eventHandler(req: VercelRequest, res: VercelResponse) {
  const {
    trigger: { name: triggerName },
  }: EventTriggerPayload<keyof GraphQLTypes> = req.body;
  const handlerMap = HANDLERS;
  if (!handlerMap[triggerName]) {
    // Log warning about no handler for this event
    const warning = `No handler configured for ${triggerName} event`;
    console.error(warning);
    res.status(200).json({ message: warning });
    return;
  }

  handlerMap[triggerName](req, res);
}

export default verifyHasuraRequestMiddleware(eventHandler);
