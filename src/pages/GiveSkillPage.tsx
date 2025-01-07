import { RecentGives } from 'features/colinks/RecentGives';
import { Helmet } from 'react-helmet';
import { Navigate, useParams } from 'react-router-dom';

import { coLinksPaths } from '../routes/paths';
import { Flex } from '../ui';

import { ResponsiveColumnLayout } from './colinks/give/GivePage';
import { LearnAboutGiveCard } from './colinks/give/LearnAboutGiveCard';
import { ShareGiveCard } from './colinks/give/ShareGiveCard';
import { GiveSkillLeaderboardMini } from './GiveSkillLeaderboardMini';
import { GiveSkillNav } from './GiveSkillNav';

export const GiveSkillPage = () => {
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
        <Flex column css={{ '@sm': { margin: 'auto' } }}>
          {skill && <RecentGives skill={skill} />}
        </Flex>
        <Flex
          column
          css={{
            gap: '$sm',
            '@sm': {
              gap: '$md',
              flexGrow: 1,
              margin: '0 auto $md',
              width: '100%',
              maxWidth: '$maxMobile !important',
            },
          }}
        >
          <GiveSkillLeaderboardMini />
          {skill !== 'null' && <ShareGiveCard skill={skill} />}
          <LearnAboutGiveCard />
        </Flex>
      </ResponsiveColumnLayout>
    </Flex>
  );
};

export const GiveSkillRedirect = () => {
  const { skill } = useParams();
  return <Navigate to={coLinksPaths.giveSkill(skill ?? '')} replace />;
};
