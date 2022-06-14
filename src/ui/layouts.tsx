import { ReactNode } from 'react';

import { CSS } from 'stitches.config';

import { ApeAvatar } from 'components';
import { Box, Text } from 'ui';

type SingleColumnLayoutProps = {
  children: ReactNode;
  css?: CSS;
};

export const SingleColumnLayout = ({
  children,
  css = {},
}: SingleColumnLayoutProps) => {
  return (
    <Box
      css={{
        maxWidth: '$mediumScreen',
        px: '$lg',
        margin: '$xl auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '$md',
        ...css,
      }}
    >
      {children}
    </Box>
  );
};

export const OrgLayout = ({
  name,
  children,
  css = {},
}: SingleColumnLayoutProps & { name?: string }) => {
  return (
    <SingleColumnLayout css={css}>
      <Box
        css={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          mb: '$xl',
        }}
      >
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
          {name}
        </Text>
      </Box>
      {children}
    </SingleColumnLayout>
  );
};
