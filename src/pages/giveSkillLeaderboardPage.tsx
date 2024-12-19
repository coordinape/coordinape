import { Helmet } from 'react-helmet';
import { Navigate, useParams } from 'react-router-dom';

import { coLinksPaths } from '../routes/paths';
import { Flex } from '../ui';

import { GiveBotCard } from './colinks/give/GiveBotCard';
import { ResponsiveColumnLayout } from './colinks/give/GivePage';
import { GivePartyCard } from './colinks/give/GivePartyCard';
import { LearnAboutGiveCard } from './colinks/give/LearnAboutGiveCard';
import { GiveSkillLeaderboard } from './GiveSkillLeaderboard';
import { GiveSkillNav } from './GiveSkillNav';

export const GiveSkillLeaderboardPage = () => {
  const { skill } = useParams();

  return (
    <Flex column>
      <Helmet>
        <title>{skill} / GIVE / Coordinape</title>
      </Helmet>
      <Flex
        css={{
          gap: '$sm',
          mt: '-$lg',
          mb: '$sm',
          ml: '$xl',
        }}
      >
        {skill && <GiveSkillNav skill={skill} />}
      </Flex>
      <ResponsiveColumnLayout>
        <Flex column>
          <GiveSkillLeaderboard />
        </Flex>
        <Flex
          column
          css={{
            gap: '$md',
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
