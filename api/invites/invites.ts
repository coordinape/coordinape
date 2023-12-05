// Function to generate a random string containing three mnemonics
import { default as crypto } from 'crypto';

import { ethers } from 'ethers';

import { adminClient } from '../../api-lib/gql/adminClient';

export function generateRandomMnemonics(): string {
  // Generate a random mnemonic phrase
  const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
  const words = mnemonic.split(' ');

  // Pick three random words from the mnemonic
  const randomWords = [];
  for (let i = 0; i < 3; i++) {
    // Create a secure random number of size words.length
    const randomIndex = Math.floor(secureRandomNumber() % words.length);
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

function secureRandomNumber(): number {
  const buffer = crypto.randomBytes(4);
  return buffer.readUInt32BE(0);
}
