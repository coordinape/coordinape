import { CoLinksWalletMenu } from 'features/CoLinksWalletMenu';
import { CoLogoMark } from 'features/nav/CoLogoMark';
import { NavLogo } from 'features/nav/NavLogo';

import { Flex, HR, Text } from 'ui';

export const WizardInstructions = ({
  children,
  suppressHeader = false,
}: {
  children: React.ReactNode;
  suppressHeader?: boolean;
}) => {
  return (
    <Flex
      column
      css={{
        background: '$surface',
        alignItems: 'flex-start',
        width: '30%',
        minWidth: '300px',
        maxWidth: '500px',
        position: 'absolute',
        m: '$md',
        clipPath:
          'polygon(0 0,100% 0,100% calc(100% - 50px),calc(100% - 60px) 100%,0 100%)',
        scrollbarWidth: 'none',
        zIndex: '2',
        '@sm': {
          width: 'calc(100% - $xl)',
          maxWidth: '400px',
        },
        // gradient overlaying overflowing links
        '&::after': {
          content: '',
          position: 'absolute',
          background: 'linear-gradient(transparent, $navBackground)',
          width: 'calc(100% + 3px)',
          height: `calc($4xl - $xs)`,
          bottom: '0',
          left: '-3px',
          pointerEvents: 'none',
          zIndex: '2',
        },
      }}
    >
      <Flex
        column
        css={{
          p: '$lg',
          pb: '$4xl',
          gap: '$sm',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '@media screen and (max-height: 735px)': {
            maxHeight: `calc(100vh - $1xl)`,
          },
          '@xs': {
            maxHeight: `calc(100vh - $4xl)`,
          },
        }}
      >
        {!suppressHeader && (
          <Flex column>
            <Flex
              css={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <NavLogo />
              <Flex css={{ gap: '$sm' }}>
                <Text
                  size="small"
                  color="secondary"
                  css={{
                    fontStyle: 'italic',
                    letterSpacing: '-0.2px',
                    mr: '-2px',
                  }}
                >
                  by
                </Text>
                <CoLogoMark muted small />
              </Flex>
            </Flex>
            <HR />
            <CoLinksWalletMenu
              inline
              css={{
                mb: '$sm',
                display: 'none',
                '@tablet': { display: 'flex !important' },
              }}
            />
          </Flex>
        )}

        {children}
      </Flex>
    </Flex>
  );
};
