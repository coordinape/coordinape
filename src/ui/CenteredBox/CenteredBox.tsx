import { CSS } from 'stitches.config';

import { Flex, Panel } from 'ui';

const CenteredBox = ({
  css,
  children,
}: {
  children: React.ReactNode;
  css?: CSS;
}) => {
  return (
    <Flex
      alignItems="center"
      css={{
        justifyContent: 'center',
        mt: '$4xl',
      }}
    >
      <Panel
        css={{
          width: '50%',
          maxWidth: '700px',
          textAlign: 'center',
          padding: '$xl',
          '@sm': { width: '90%' },
          ...css,
        }}
      >
        {children}
      </Panel>
    </Flex>
  );
};

export default CenteredBox;
