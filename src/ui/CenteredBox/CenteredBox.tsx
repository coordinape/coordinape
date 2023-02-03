import { Flex, Panel } from 'ui';

const CenteredBox = ({ children }: { children: React.ReactNode }) => {
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
        }}
      >
        {children}
      </Panel>
    </Flex>
  );
};

export default CenteredBox;
