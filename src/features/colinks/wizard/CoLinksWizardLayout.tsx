import { CoLinksWalletMenu } from 'features/CoLinksWalletMenu';

import { Box, Flex } from 'ui';

export const CoLinksWizardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Box
      css={{
        background: '$background',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        '& > main': { flex: 1, flexGrow: 1 },
      }}
    >
      <Flex
        css={{
          position: 'absolute',
          alignItems: 'center',
          right: '$md',
          top: '$md',
          gap: '$md',
          '@media (max-width: 620px)': { display: 'none' },
        }}
      >
        <CoLinksWalletMenu
          css={{
            '>div': {
              border: 'none',
            },
          }}
        />
      </Flex>

      {children}
    </Box>
  );
};
