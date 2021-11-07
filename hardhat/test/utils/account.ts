import { Signer } from 'ethers';

export type Account = {
  address: string;
  signer: Signer;
};

export async function getAccountFromSigner(signer: Signer): Promise<Account> {
  const address = await signer.getAddress();
  return {
    address,
    signer,
  };
}
