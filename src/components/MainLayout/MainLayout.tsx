import { SideNav } from '../../features/nav/SideNav';
import HelpButton from '../HelpButton';
import { GlobalUi } from 'components/GlobalUi';
import { Box, Flex } from 'ui';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
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
      <Flex css={{ height: 'auto' }}>
        <SideNav />
        <Box css={{ width: '100%' }}>
          <GlobalUi />
          <HelpButton />
          <Box
            as="main"
            css={{
              height: '100vh',
              overflowY: 'auto',
              '@sm': {
                zIndex: 1,
                pt: '$3xl',
              }, // for hamburger menu
            }}
          >
            {children}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default MainLayout;

// this is in this file because it depends on the <main> tag defined above
export const scrollToTop = () => {
  document.getElementsByTagName('main')[0].scrollTop = 0;
};
