import { VercelRequest, VercelResponse, VercelApiHandler } from '@vercel/node';

import { GraphQLTypes } from '../../../api-lib/gql/__generated__/zeus';
import { ActionPayload } from '../../../api-lib/types';

import adminUpdateUser from './_handlers/adminUpdateUser';
import allocationCsv from './_handlers/allocationCsv';
import createCircle from './_handlers/createCircle';
import createEpoch from './_handlers/createEpoch';
import createNominee from './_handlers/createNominee';
import createUser from './_handlers/createUser';
import createUsers from './_handlers/createUsers';
import createUserWithToken from './_handlers/createUserWithToken';
import createVault from './_handlers/createVault';
import createVaultTx from './_handlers/createVaultTx';
import deleteCircle from './_handlers/deleteCircle';
import deleteContribution from './_handlers/deleteContribution';
import deleteEpoch from './_handlers/deleteEpoch';
import deleteUser from './_handlers/deleteUser';
import generateApiKey from './_handlers/generateApiKey';
import logoutUser from './_handlers/logoutUser';
import markClaimed from './_handlers/markClaimed';
import restoreCoordinape from './_handlers/restoreCoordinape';
import updateAllocations from './_handlers/updateAllocations';
import updateCircle from './_handlers/updateCircle';
import updateContribution from './_handlers/updateContribution';
import updateEpoch from './_handlers/updateEpoch';
import updateTeammates from './_handlers/updateTeammates';
import updateUser from './_handlers/updateUser';
import uploadCircleLogo from './_handlers/uploadCircleLogo';
import uploadOrgLogo from './_handlers/uploadOrgLogo';
import uploadProfileAvatar from './_handlers/uploadProfileAvatar';
import uploadProfileBackground from './_handlers/uploadProfileBackground';
import vouch from './_handlers/vouch';

type HandlerDict = { [handlerName: string]: VercelApiHandler };
const HANDLERS: HandlerDict = {
  adminUpdateUser,
  allocationCsv,
  createCircle,
  createEpoch,
  createNominee,
  createUser,
  createUsers,
  createUserWithToken,
  createVault,
  createVaultTx,
  deleteCircle,
  deleteContribution,
  deleteEpoch,
  deleteUser,
  generateApiKey,
  logoutUser,
  markClaimed,
  restoreCoordinape,
  updateAllocations,
  updateCircle,
  updateContribution,
  updateEpoch,
  updateTeammates,
  updateUser,
  uploadCircleLogo,
  uploadOrgLogo,
  uploadProfileAvatar,
  uploadProfileBackground,
  vouch,
};

export default async function actionHandler(
  req: VercelRequest,
  res: VercelResponse
) {
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

  handlerMap[actionName](req, res);
}
