import { Helmet } from 'react-helmet';
import { Navigate, useParams } from 'react-router-dom';

import { webAppURL } from '../config/webAppURL';
import { Wand } from '../icons/__generated';
import { coLinksPaths } from '../routes/paths';
import { disabledStyle } from '../stitches.config';
import { Button, Flex, Link } from '../ui';

import { ResponsiveColumnLayout } from './colinks/give/GivePage';
import { GiveSkillLeaderboard } from './GiveSkillLeaderboard';

export const GiveSkillPage = () => {
  const { skill } = useParams();

  const castLeaderboardUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(skill ? '#' + skill + ' GIVE Leaders' : '')}&embeds[]=${webAppURL('colinks')}/api/frames/router/meta/skill.leaderboard/${encodeURIComponent(skill ?? '')}`;

  return (
    <Flex column>
      <Helmet>
        <title>{skill} / GIVE / CoLinks</title>
      </Helmet>
      <ResponsiveColumnLayout>
        <Flex column>
          <GiveSkillLeaderboard />
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
      </ResponsiveColumnLayout>
    </Flex>
  );
};

export const GiveSkillRedirect = () => {
  const { skill } = useParams();
  return <Navigate to={coLinksPaths.giveSkill(skill ?? '')} replace />;
};
