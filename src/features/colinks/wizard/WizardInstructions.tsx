import { NavLogo } from 'features/nav/NavLogo';

import { Flex, HR, Text } from 'ui';

export const WizardInstructions = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Flex
      column
      css={{
        background: '$surface',
        alignItems: 'flex-start',
        p: '$lg',
        pb: '$4xl',
        gap: '$md',
        width: '30%',
        minWidth: '300px',
        position: 'absolute',
        m: '$md',
        clipPath:
          'polygon(0 0,100% 0,100% calc(100% - 50px),calc(100% - 60px) 100%,0 100%)',
        maxHeight: '90vh',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        scrollbarWidth: 'none',
      }}
    >
      <NavLogo suppressAppMenu />
      <Flex column css={{ width: '100%' }}>
        <Text h2 display>
          CoLinks
        </Text>
        <HR />
      </Flex>

      {children}
    </Flex>
  );
};
