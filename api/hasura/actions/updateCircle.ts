import { VercelRequest, VercelResponse } from '@vercel/node';

import { authCircleAdminMiddleware } from '../../../api-lib/circleAdmin';
import { Contracts } from '../../../api-lib/contracts';
import { endNominees, updateCircle } from '../../../api-lib/gql/mutations';
import { UnprocessableError } from '../../../api-lib/HttpError';
import { getProvider } from '../../../api-lib/provider';
import {
  composeHasuraActionRequestBody,
  updateCircleInput,
} from '../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    input: { payload: input },
  } = composeHasuraActionRequestBody(updateCircleInput).parse(req.body);

  const { chain_id, fixed_payment_token_type } = input;
  if (fixed_payment_token_type) {
    if (!chain_id) {
      throw new UnprocessableError(`Please provide the chain_id.`);
    }
    const provider = getProvider(chain_id);
    const contracts = new Contracts(chain_id, provider);
    const tokens = contracts ? contracts.getAvailableTokens() : [];
    if (!tokens.some(t => t === fixed_payment_token_type)) {
      throw new UnprocessableError(`Payment Token Type not available.`);
    }
  }

  if (input.chain_id) {
    // this is only used to validate the payment token, not to be saved.
    input.chain_id = undefined;
  }
  const updated = await updateCircle(input);

  if (!input.vouching) {
    await endNominees(input.circle_id);
  }
  res.status(200).json(updated);
}

export default authCircleAdminMiddleware(handler);
