import { VercelApiHandler, VercelRequest, VercelResponse } from '@vercel/node';

import { GraphQLTypes } from '../../../api-lib/gql/__generated__/zeus';
import { ActionPayload } from '../../../api-lib/types';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';

import acceptTOS from './_handlers/acceptTOS';
import addEmail from './_handlers/addEmail';
import addFarcaster from './_handlers/addFarcaster.ts';
import addInviteCodes from './_handlers/addInviteCodes';
import adminUpdateUser from './_handlers/adminUpdateUser';
import allocationCsv from './_handlers/allocationCsv';
import checkEthDenverInvitee from './_handlers/checkEthDenverInvitee';
import createCircle from './_handlers/createCircle';
import createCoLinksGive from './_handlers/createCoLinksGive';
import createEpoch from './_handlers/createEpoch';
import createNominee from './_handlers/createNominee';
import createOrgMembers from './_handlers/createOrgMembers';
import createSampleCircle from './_handlers/createSampleCircle';
import createUsers from './_handlers/createUsers';
import createUserWithToken from './_handlers/createUserWithToken';
import deleteCircle from './_handlers/deleteCircle';
import deleteCoLinksGive from './_handlers/deleteCoLinksGive.ts';
import deleteContribution from './_handlers/deleteContribution';
import deleteEmail from './_handlers/deleteEmail';
import deleteEpoch from './_handlers/deleteEpoch';
import deleteOrgMember from './_handlers/deleteOrgMember';
import deleteUser from './_handlers/deleteUser';
import deleteUsers from './_handlers/deleteUsers';
import endEpoch from './_handlers/endEpoch';
import generateApiKey from './_handlers/generateApiKey';
import generateOneTimeUpload from './_handlers/generateOneTimeUpload';
import getCasts from './_handlers/getCasts';
import guildInfo from './_handlers/getGuildInfo';
import getHeadlines from './_handlers/getHeadlines';
import getSimilarProfiles from './_handlers/getSimilarProfiles';
import giveCsv from './_handlers/giveCsv';
import inviteWaitingList from './_handlers/inviteWaitingList';
import logoutUser from './_handlers/logoutUser';
import replenishInviteCodes from './_handlers/replenishInviteCodes';
import requestInviteCode from './_handlers/requestInviteCode';
import restoreCoordinape from './_handlers/restoreCoordinape';
import searchCosouls from './_handlers/searchCosouls';
import searchProfiles from './_handlers/searchProfiles';
import setPrimaryEmail from './_handlers/setPrimaryEmail';
import share from './_handlers/share';
import syncCoSoul from './_handlers/syncCoSoul';
import syncLinks from './_handlers/syncLinks';
import updateAllocations from './_handlers/updateAllocations';
import updateCircle from './_handlers/updateCircle';
import updateCircleStartingGive from './_handlers/updateCircleStartingGive';
import updateContribution from './_handlers/updateContribution';
import updateEpoch from './_handlers/updateEpoch';
import updateProfile from './_handlers/updateProfile';
import updateRepScore from './_handlers/updateRepScore';
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
  addFarcaster,
  addInviteCodes,
  adminUpdateUser,
  allocationCsv,
  createCircle,
  createCoLinksGive,
  createEpoch,
  createNominee,
  createOrgMembers,
  createSampleCircle,
  createUserWithToken,
  createUsers,
  deleteCircle,
  deleteCoLinksGive,
  deleteContribution,
  deleteEmail,
  deleteEpoch,
  deleteOrgMember,
  deleteUser,
  deleteUsers,
  endEpoch,
  checkEthDenverInvitee,
  generateApiKey,
  getCasts,
  getHeadlines,
  getSimilarProfiles,
  giveCsv,
  guildInfo,
  inviteWaitingList,
  logoutUser,
  replenishInviteCodes,
  requestInviteCode,
  restoreCoordinape,
  searchCosouls,
  searchProfiles,
  setPrimaryEmail,
  share,
  syncCoSoul,
  syncLinks,
  updateAllocations,
  updateCircle,
  updateCircleStartingGive,
  updateContribution,
  updateEpoch,
  updateProfile,
  updateRepScore,
  updateTeammates,
  updateUser,
  uploadCircleLogo,
  uploadOrgLogo,
  uploadProfileAvatar,
  uploadProfileBackground,
  vouch,
  generateOneTimeUpload,
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
