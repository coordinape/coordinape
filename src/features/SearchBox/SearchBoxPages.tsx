import { Command } from 'cmdk';
import { useNavigate } from 'react-router';

import useConnectedAddress from '../../hooks/useConnectedAddress';
import {
  Award,
  BarChart,
  BoltFill,
  CertificateFill,
  HouseFill,
  PaperPlane,
  PlanetFill,
  Settings,
  ToolsFill,
  UserFill,
} from '../../icons/__generated';
import { coLinksPaths } from '../../routes/paths';
import { Flex, Text } from '../../ui';

const searchPages = (address: string) => [
  {
    name: 'Home',
    path: coLinksPaths.home,
    icon: <HouseFill size="lg" nostroke />,
  },
  {
    name: 'Explore',
    path: coLinksPaths.explore,
    icon: <PlanetFill size="lg" nostroke />,
  },
  {
    name: 'Notifications',
    path: coLinksPaths.notifications,
    icon: <BoltFill size="lg" nostroke />,
  },
  {
    name: 'Profile',
    path: coLinksPaths.profile(address),
    icon: <UserFill size="lg" nostroke />,
  },
  {
    name: 'Edit Profile',
    path: coLinksPaths.account,
    icon: <Settings css={{ path: { fill: 'transparent !important' } }} />,
  },
  {
    name: 'Rep Score',
    path: coLinksPaths.score(address),
    icon: <CertificateFill size="lg" nostroke />,
  },
  {
    name: 'Invites',
    path: coLinksPaths.invites,
    icon: <PaperPlane size="lg" nostroke />,
  },
  {
    name: 'Top Interests',
    path: coLinksPaths.exploreSkills,
    icon: <ToolsFill size="lg" />,
  },
  {
    name: 'Most Links',
    path: coLinksPaths.exploreMostLinks,
    icon: <Award size="lg" />,
  },
  {
    name: 'Holding Most Links',
    path: coLinksPaths.exploreHoldingMost,
    icon: <Award size="lg" />,
  },
  {
    name: 'Linking Activity',
    path: coLinksPaths.linking,
    icon: <BarChart size="lg" />,
  },
  {
    name: 'Highest Rep Score',
    path: coLinksPaths.exploreRepScore,
    icon: <CertificateFill size="lg" nostroke />,
  },
];

export const SearchBoxPages = ({ search }: { search: string }) => {
  const navigate = useNavigate();
  const address = useConnectedAddress(true);

  return (
    <Command.Group heading={'Pages'}>
      {searchPages(address)
        .filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 5)
        .map(item => (
          <Command.Item
            key={item.name}
            value={item.path}
            onSelect={() => navigate(item.path)}
          >
            <Flex
              css={{
                width: '100%',
                alignItems: 'center',
                gap: '$md',
                'svg path': {
                  fill: '$text',
                },
              }}
            >
              {item.icon}
              <Text size={'medium'}>{item.name}</Text>
            </Flex>
          </Command.Item>
        ))}
    </Command.Group>
  );
};
