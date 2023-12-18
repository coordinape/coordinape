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
import createNotificationMentionReplies from '../../../api-lib/event_triggers/createNotificationMentionReplies';
import createNotificationReactions from '../../../api-lib/event_triggers/createNotificationReactions';
import createNotificationReplies from '../../../api-lib/event_triggers/createNotificationReplies';
import createReactionInteractionEvent from '../../../api-lib/event_triggers/createReactionInteractionEvent';
import createVouchedUser from '../../../api-lib/event_triggers/createVouchedUser';
import discordUserLinked from '../../../api-lib/event_triggers/discordUserLinked';
import fetchNFTsForNewHolder from '../../../api-lib/event_triggers/fetchNFTsForNewHolder';
import insertOrgMember from '../../../api-lib/event_triggers/insertOrgMember';
import linkTxInteractionEvent from '../../../api-lib/event_triggers/linkTxInteractionEvent';
import linkTxNotification from '../../../api-lib/event_triggers/linkTxNotification';
import muteChanged from '../../../api-lib/event_triggers/muteChanged';
import optOutDiscord from '../../../api-lib/event_triggers/optOutDiscord';
import optOutDiscordBot from '../../../api-lib/event_triggers/optOutDiscordBot';
import optOutTelegram from '../../../api-lib/event_triggers/optOutTelegram';
import refundGiveDiscord from '../../../api-lib/event_triggers/refundGiveDiscord';
import refundGiveTelegram from '../../../api-lib/event_triggers/refundGiveTelegram';
import refundPendingGift from '../../../api-lib/event_triggers/refundPendingGift';
import removeTeammate from '../../../api-lib/event_triggers/removeTeammate';
import sendInteractionEventToMixpanel from '../../../api-lib/event_triggers/sendInteractionEventToMixpanel';
import updateDescriptionEmbedding from '../../../api-lib/event_triggers/updateDescriptionEmbedding';
import updateLinkHolderRepScore from '../../../api-lib/event_triggers/updateLinkHolderRepScore';
import updatePGIVERepScore from '../../../api-lib/event_triggers/updatePGIVERepScore';
import updateProfileRepScore from '../../../api-lib/event_triggers/updateProfileRepScore';
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
  linkTxInteractionEvent,
  linkTxNotification,
  createNotificationReactions,
  createNotificationMentionReplies,
  createNotificationReplies,
  createNomineeDiscord,
  userAddedDiscordBot,
  userRemovedDiscordBot,
  createNomineeDiscordBot,
  createNomineeTelegram,
  createVouchedUser,
  discordUserLinked,
  insertOrgMember,
  fetchNFTsForNewHolder,
  muteChanged,
  optOutDiscord,
  optOutDiscordBot,
  optOutTelegram,
  refundGiveDiscord,
  refundGiveTelegram,
  refundPendingGift,
  removeTeammate,
  sendInteractionEventToMixpanel,
  updateDescriptionEmbedding,
  updateLinkHolderRepScore,
  updatePGIVERepScore,
  updateProfileRepScore_emails: updateProfileRepScore,
  updateProfileRepScore_github: updateProfileRepScore,
  updateProfileRepScore_linkedin: updateProfileRepScore,
  updateProfileRepScore_twitter: updateProfileRepScore,
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

  await handlerMap[triggerName](req, res);
}

export default verifyHasuraRequestMiddleware(eventHandler);
