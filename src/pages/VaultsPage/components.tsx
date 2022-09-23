import { paths } from 'routes/paths';
import { AppLink, Link, Text } from 'ui';
import { shortenAddress } from 'utils';
import { makeExplorerUrl } from 'utils/provider';

export const VaultExternalLink = ({
  vaultAddress,
  chainId,
}: {
  vaultAddress: string;
  chainId: number;
}) => {
  return (
    <Link
      css={{ color: '$primary', marginLeft: '$md' }}
      target="_blank"
      href={makeExplorerUrl(chainId, vaultAddress, 'address')}
    >
      {shortenAddress(vaultAddress, false)}
    </Link>
  );
};

export const OwnerProfileLink = ({
  ownerAddress,
}: {
  ownerAddress: string;
}) => {
  return (
    <Text p as="p" size="small">
      Owner:{' '}
      <AppLink to={paths.profile(ownerAddress)}>
        {shortenAddress(ownerAddress)}
      </AppLink>
    </Text>
  );
};
