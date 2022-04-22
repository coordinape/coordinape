import { VercelRequest, VercelResponse, VercelApiHandler } from '@vercel/node';

import { VERCEL_ENV } from '../../../api-lib/config';
import checkNomineeDiscord from '../../../api-lib/event_triggers/checkNomineeDiscord';
import checkNomineeTelegram from '../../../api-lib/event_triggers/checkNomineeTelegram';
import createNomineeDiscord from '../../../api-lib/event_triggers/createNomineeDiscord';
import createNomineeTelegram from '../../../api-lib/event_triggers/createNomineeTelegram';
import createVouchedUser from '../../../api-lib/event_triggers/createVouchedUser';
import optOutDiscord from '../../../api-lib/event_triggers/optOutDiscord';
import optOutTelegram from '../../../api-lib/event_triggers/optOutTelegram';
import refundGiveDiscord from '../../../api-lib/event_triggers/refundGiveDiscord';
import refundGiveTelegram from '../../../api-lib/event_triggers/refundGiveTelegram';
import refundPendingGift from '../../../api-lib/event_triggers/refundPendingGift';
import removeTeammate from '../../../api-lib/event_triggers/removeTeammate';
import vouchDiscord from '../../../api-lib/event_triggers/vouchDiscord';
import vouchTelegram from '../../../api-lib/event_triggers/vouchTelegram';
import { GraphQLTypes } from '../../../api-lib/gql/__generated__/zeus';
import { EventTriggerPayload } from '../../../api-lib/types';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';

type HandlerDict = { [handlerName: string]: VercelApiHandler };

const PROD_HANDLERS: HandlerDict = {
  createNomineeDiscord,
  createNomineeTelegram,
  createVouchedUser,
  optOutDiscord,
  optOutTelegram,
  refundGiveTelegram,
  refundGiveDiscord,
  refundPendingGift,
  vouchDiscord,
  vouchTelegram,
};

const STAGING_HANDLERS: HandlerDict = {
  ...PROD_HANDLERS,
  checkNomineeDiscord,
  checkNomineeTelegram,
  removeTeammate,
};

async function eventHandler(req: VercelRequest, res: VercelResponse) {
  const {
    trigger: { name: triggerName },
  }: EventTriggerPayload<keyof GraphQLTypes> = req.body;
  const handlerMap =
    VERCEL_ENV === 'production' ? PROD_HANDLERS : STAGING_HANDLERS;
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
