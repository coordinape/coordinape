import { ReactNode } from 'react';

import { ThemeContext } from 'features/theming/ThemeProvider';
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
    <ThemeContext.Consumer>
      {({ theme }) => (
        <Box
          css={{
            maxWidth: '$mediumScreen',
            p: '$lg $xl',
            '@sm': { p: '$xl $lg' },
            margin: theme == 'legacy' ? '$2xl auto' : '0',
            display: 'flex',
            flexDirection: 'column',
            gap: '$md',
            ...css,
          }}
        >
          {children}
        </Box>
      )}
    </ThemeContext.Consumer>
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
