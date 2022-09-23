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
