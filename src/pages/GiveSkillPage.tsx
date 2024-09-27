import { Helmet } from 'react-helmet';
import { Navigate, useParams } from 'react-router-dom';
import { CSS } from 'stitches.config';

import { webAppURL } from '../config/webAppURL';
import { Wand } from '../icons/__generated';
import { coLinksPaths } from '../routes/paths';
import { Button, Flex, Link } from '../ui';

import { GiveBotCard } from './colinks/give/GiveBotCard';
import { ResponsiveColumnLayout } from './colinks/give/GivePage';
import { GivePartyCard } from './colinks/give/GivePartyCard';
import { LearnAboutGiveCard } from './colinks/give/LearnAboutGiveCard';
import { GiveSkillLeaderboard } from './GiveSkillLeaderboard';

export const GiveSkillPage = () => {
  const { skill } = useParams();

  return (
    <Flex column>
      <Helmet>
        <title>{skill} / GIVE / CoLinks</title>
      </Helmet>
      <ResponsiveColumnLayout smallColumnReverse>
        <Flex column>
          <CastButton
            skill={skill}
            css={{
              display: 'none',
              '@sm': {
                display: 'block',
                mb: '$md',
              },
            }}
          />
          <GiveSkillLeaderboard />
        </Flex>
        <Flex
          column
          css={{
            gap: '$xl',
            flexGrow: 1,
            '@sm': {
              flexDirection: 'row',
              gap: '$sm',
              pb: '$sm',
              overflow: 'scroll',
              mx: '-$md',
              px: '$md',
            },
          }}
        >
          <CastButton
            skill={skill}
            css={{
              '@sm': {
                display: 'none',
              },
            }}
          />
          <LearnAboutGiveCard />
          <GivePartyCard />
          <GiveBotCard />
        </Flex>
      </ResponsiveColumnLayout>
    </Flex>
  );
};

export const GiveSkillRedirect = () => {
  const { skill } = useParams();
  return <Navigate to={coLinksPaths.giveSkill(skill ?? '')} replace />;
};

const CastButton = ({ css, skill }: { css?: CSS; skill?: string }) => {
  const castLeaderboardUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(skill ? '#' + skill + ' GIVE Leaders' : '')}&embeds[]=${webAppURL('colinks')}/api/frames/router/meta/skill.leaderboard/${encodeURIComponent(skill ?? '')}`;

  return (
    <Button
      as={Link}
      href={castLeaderboardUrl}
      target="_blank"
      rel="noreferrer"
      css={{
        ...css,
      }}
    >
      <Wand fa size={'md'} /> Cast in Farcaster
    </Button>
  );
};
