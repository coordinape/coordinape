import { ReactNode } from 'react';

import { CSS } from 'stitches.config';

import { OrganizationHeader } from 'components';
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

export const OrgLayout = ({ children, css = {} }: SingleColumnLayoutProps) => {
  return (
    <SingleColumnLayout css={css}>
      <OrganizationHeader css={{ mb: '$xl' }} />
      {children}
    </SingleColumnLayout>
  );
};
