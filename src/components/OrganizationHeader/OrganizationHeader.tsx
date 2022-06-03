import { CSS } from 'stitches.config';

import { ApeAvatar } from 'components';
import { useCurrentOrg } from 'hooks/gql/useCurrentOrg';
import { Box, Text } from 'ui';

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
      <Text css={{ fontWeight: '$bold', fontSize: '$h2', flexGrow: 1 }}>
        {currentOrg.data?.name}
      </Text>
    </Box>
  );
};
