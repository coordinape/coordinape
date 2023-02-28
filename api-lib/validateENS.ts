import { getProvider } from './provider';

export const isValidENS = async (name: string, address?: string) => {
  const resolvedAddress = await getProvider(1).resolveName(name);
  if (
    !resolvedAddress ||
    resolvedAddress.toLowerCase() !== address?.toLowerCase()
  ) {
    return false;
  }
  return true;
};
