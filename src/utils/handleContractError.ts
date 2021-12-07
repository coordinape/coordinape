export const handleContractError = (e: any) => {
  console.error(e);
  if (e.code === 4001) {
    throw Error(`Transaction rejected by your wallet`);
  }
  throw Error(`Failed to submit create vault.`);
};
