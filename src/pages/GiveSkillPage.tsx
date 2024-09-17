import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';

import { webAppURL } from '../config/webAppURL';
import { Wand } from '../icons/__generated';
import { coLinksPaths } from '../routes/paths';
import { disabledStyle } from '../stitches.config';
import { Button, Flex, Link } from '../ui';
import { TwoColumnSmallRightLayout } from '../ui/layouts';

import { GiveSkillLeaderboard } from './GiveSkillLeaderboard';

export const GiveSkillPage = () => {
  const { skill } = useParams();

  const castLeaderboardUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(skill ? '#' + skill + ' GIVE Leaders' : '')}&embeds[]=${webAppURL('colinks')}/api/frames/router/meta/skill.leaderboard/${encodeURIComponent(skill ?? '')}`;

  return (
    <Flex column>
      <Helmet>
        <title>{skill} / GIVE / CoLinks</title>
      </Helmet>
      <TwoColumnSmallRightLayout
        css={{
          '@xs': {
            gap: '0',
          },
        }}
      >
        <Flex column>
          <GiveSkillLeaderboard
            mapFunc={coLinksPaths.giveSkillMap}
            profileFunc={coLinksPaths.profileGive}
          />
        </Flex>
        <Flex column>
          <Button
            as={Link}
            href={castLeaderboardUrl}
            target="_blank"
            rel="noreferrer"
            css={{
              ...(!skill && {
                ...disabledStyle,
              }),
            }}
          >
            <Wand fa size={'md'} /> Cast in Farcaster
          </Button>
        </Flex>
      </TwoColumnSmallRightLayout>
    </Flex>
  );
};
