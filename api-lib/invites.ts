import { default as crypto } from 'crypto';

import { ethers } from 'ethers';

import { adminClient } from './gql/adminClient';

// Function to generate a random string containing three BIP-39 mnemonics words
export function generateRandomMnemonics(): string {
  // Generate a random mnemonic phrase
  const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
  const words = mnemonic.split(' ');

  // Pick three random words from the mnemonic
  const randomWords = [];
  for (let i = 0; i < 3; i++) {
    // Create a secure random number of size words.length
    const randomIndex = secureRandomNumberInRange(words.length);
    randomWords.push(words[randomIndex]);
    // remove the word from the array to avoid duplicates
    words.splice(randomIndex, 1);
  }

  return randomWords.join('-');
}

export const addInviteCodes = async (profile_id: number, num_codes: number) => {
  const inviteCodes = [];
  for (let i = 0; i < num_codes; i++) {
    const inviteCode = generateRandomMnemonics();
    inviteCodes.push(inviteCode);
  }

  return await adminClient.mutate(
    {
      insert_invite_codes: [
        {
          objects: inviteCodes.map(code => ({
            code,
            inviter_id: profile_id,
          })),
        },
        {
          __typename: true,
        },
      ],
    },
    {
      operationName: 'insert_invite_codes',
    }
  );
};

function secureRandomNumberInRange(max: number) {
  const maxUint32 = 0xffffffff;
  let rand = 0;

  do {
    const buffer = crypto.randomBytes(4);
    rand = buffer.readUInt32BE(0);
  } while (rand >= maxUint32 - (maxUint32 % max));

  return Math.floor((rand / maxUint32) * max);
}
