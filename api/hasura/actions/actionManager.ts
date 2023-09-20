import { VercelApiHandler, VercelRequest, VercelResponse } from '@vercel/node';

import { GraphQLTypes } from '../../../api-lib/gql/__generated__/zeus';
import { ActionPayload } from '../../../api-lib/types';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';

import acceptTOS from './_handlers/acceptTOS';
import addEmail from './_handlers/addEmail';
import adminUpdateUser from './_handlers/adminUpdateUser';
import allocationCsv from './_handlers/allocationCsv';
import createCircle from './_handlers/createCircle';
import createEpoch from './_handlers/createEpoch';
import createNominee from './_handlers/createNominee';
import createOrgMembers from './_handlers/createOrgMembers';
import createSampleCircle from './_handlers/createSampleCircle';
import createUsers from './_handlers/createUsers';
import createUserWithToken from './_handlers/createUserWithToken';
import createVault from './_handlers/createVault';
import createVaultTx from './_handlers/createVaultTx';
import deleteCircle from './_handlers/deleteCircle';
import deleteContribution from './_handlers/deleteContribution';
import deleteEmail from './_handlers/deleteEmail';
import deleteEpoch from './_handlers/deleteEpoch';
import deleteOrgMember from './_handlers/deleteOrgMember';
import deleteUser from './_handlers/deleteUser';
import deleteUsers from './_handlers/deleteUsers';
import endEpoch from './_handlers/endEpoch';
import generateApiKey from './_handlers/generateApiKey';
import guildInfo from './_handlers/getGuildInfo';
import giveCsv from './_handlers/giveCsv';
import linkDiscordCircle from './_handlers/linkDiscordCircle';
import linkDiscordUser from './_handlers/linkDiscordUser';
import logoutUser from './_handlers/logoutUser';
import markClaimed from './_handlers/markClaimed';
import restoreCoordinape from './_handlers/restoreCoordinape';
import setPrimaryEmail from './_handlers/setPrimaryEmail';
import syncCoSoul from './_handlers/syncCoSoul';
import updateAllocations from './_handlers/updateAllocations';
import updateCircle from './_handlers/updateCircle';
import updateCircleStartingGive from './_handlers/updateCircleStartingGive';
import updateContribution from './_handlers/updateContribution';
import updateEpoch from './_handlers/updateEpoch';
import updateProfile from './_handlers/updateProfile';
import updateTeammates from './_handlers/updateTeammates';
import updateUser from './_handlers/updateUser';
import uploadCircleLogo from './_handlers/uploadCircleLogo';
import uploadOrgLogo from './_handlers/uploadOrgLogo';
import uploadProfileAvatar from './_handlers/uploadProfileAvatar';
import uploadProfileBackground from './_handlers/uploadProfileBackground';
import vouch from './_handlers/vouch';

type HandlerDict = { [handlerName: string]: VercelApiHandler };
const HANDLERS: HandlerDict = {
  acceptTOS,
  addEmail,
  adminUpdateUser,
  allocationCsv,
  createCircle,
  createEpoch,
  createNominee,
  createOrgMembers,
  createSampleCircle,
  createUserWithToken,
  createUsers,
  createVault,
  createVaultTx,
  deleteCircle,
  deleteContribution,
  deleteEmail,
  deleteEpoch,
  deleteOrgMember,
  deleteUser,
  deleteUsers,
  endEpoch,
  generateApiKey,
  giveCsv,
  guildInfo,
  linkDiscordCircle,
  linkDiscordUser,
  logoutUser,
  markClaimed,
  restoreCoordinape,
  setPrimaryEmail,
  syncCoSoul,
  updateAllocations,
  updateCircle,
  updateCircleStartingGive,
  updateContribution,
  updateEpoch,
  updateProfile,
  updateTeammates,
  updateUser,
  uploadCircleLogo,
  uploadOrgLogo,
  uploadProfileAvatar,
  uploadProfileBackground,
  vouch,
};

async function actionHandler(req: VercelRequest, res: VercelResponse) {
  const {
    action: { name: actionName },
  }: ActionPayload<keyof GraphQLTypes> = req.body;
  const handlerMap = HANDLERS;
  if (!handlerMap[actionName]) {
    // Log warning about no handler for this action
    const warning = `No handler configured for ${actionName} action`;
    console.error(warning);
    res.status(422).json({ message: warning });
    return;
  }

  await handlerMap[actionName](req, res);
}

export default verifyHasuraRequestMiddleware(actionHandler);
