import _ from 'lodash';

import { chain } from '../cosoul/chains';

export const switchToCorrectChain = async (library: any) => {
  // add and/or switch to the proper chain
  await library.send('wallet_addEthereumChain', [
    // use chain options without 'gasSettings' key
    _.omit(chain, 'gasSettings'),
  ]);
};
