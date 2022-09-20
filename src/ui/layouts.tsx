import { ReactNode } from 'react';

import { CSS } from 'stitches.config';

import { Avatar, Box, Text } from 'ui';

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
        margin: '$2xl auto',
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

type TwoColumnLayoutProps = {
  children: ReactNode;
  css?: CSS;
};

export const TwoColumnLayout = ({
  children,
  css = {},
}: TwoColumnLayoutProps) => {
  return (
    <Box
      css={{
        display: 'grid',
        gap: '$xl',
        gridTemplateColumns: '1fr 1fr',
        '@sm': { gridTemplateColumns: '1fr' },
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
        <Avatar path="/imgs/avatar/placeholder.jpg" size="medium" />
        <Text css={{ fontWeight: '$bold', fontSize: '$h2', flexGrow: 1 }}>
          {name}
        </Text>
      </Box>
      {children}
    </SingleColumnLayout>
  );
};
