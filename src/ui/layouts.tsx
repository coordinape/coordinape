import { ReactNode } from 'react';

import { CSS } from 'stitches.config';

import { Box } from 'ui';

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
        p: '$lg $xl',
        '@sm': { p: '$xl $lg' },
        margin: '0',
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
export const TwoColumnSmallRightLayout = ({
  children,
  css = {},
}: SingleColumnLayoutProps) => {
  return (
    <SingleColumnLayout
      css={{
        ...css,
        display: 'grid',
        gap: '$xl',
        gridTemplateColumns: '1.75fr 1.25fr',
      }}
    >
      {children}
    </SingleColumnLayout>
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
