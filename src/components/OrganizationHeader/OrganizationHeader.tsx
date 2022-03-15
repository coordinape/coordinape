import { styled, CSS } from 'stitches.config';

import { ApeAvatar } from 'components';
import { useCurrentOrg } from 'hooks/gql/useCurrentOrg';
import { paths } from 'routes/paths';
import { AppLink, Box, Text } from 'ui';

const BigLink = styled(AppLink, {
  padding: '$sm $md',
  marginLeft: '$md',
  borderRadius: '$4',
  fontSize: '$7',
  color: '$mediumGray',
  '&.active': {
    backgroundColor: '$surfaceGray',
    color: '$text',
  },
  '&:hover': {
    backgroundColor: '$subtleGray',
  },
});

export const OrganizationHeader = ({ css = {} }: { css?: CSS }) => {
  const currentOrg = useCurrentOrg();

  return (
    <Box css={{ display: 'flex', alignItems: 'center', width: '100%', ...css }}>
      <ApeAvatar
        alt="organization"
        src="/imgs/avatar/placeholder.jpg"
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '1px solid rgba(94, 111, 116, 0.7)',
          marginRight: '16px',
        }}
      />
      <Text css={{ fontWeight: '$bold', fontSize: '$8', flexGrow: 1 }}>
        {currentOrg.data?.name}
      </Text>
      <BigLink to={paths.vaults}>Vaults</BigLink>
      <BigLink to={paths.adminCircles}>Circles</BigLink>
    </Box>
  );
};
