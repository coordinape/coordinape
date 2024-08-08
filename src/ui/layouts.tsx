import { ReactNode } from 'react';

import { artWidthMobile } from 'features/cosoul/constants';
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
        margin: '0',
        display: 'flex',
        flexDirection: 'column',
        gap: '$md',
        '@sm': { p: '$xl $md' },
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
        gridTemplateColumns: `minmax(auto, $readable) minmax(${artWidthMobile}, 1fr)`,
        '@sm': {
          gridTemplateColumns: '1fr',
        },
        '@md': {
          gridTemplateColumns: 'minmax(auto, $readable) minmax(auto, 1fr)',
        },
        '@tablet': {
          gap: '0',
        },
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
