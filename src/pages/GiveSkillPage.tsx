import { RecentGives } from 'features/colinks/RecentGives';
import { Helmet } from 'react-helmet';
import { Navigate, useParams } from 'react-router-dom';

import { coLinksPaths } from '../routes/paths';
import { Flex } from '../ui';
import useMobileDetect from 'hooks/useMobileDetect';

import { ResponsiveColumnLayout } from './colinks/give/GivePage';
import { LearnAboutGiveCard } from './colinks/give/LearnAboutGiveCard';
import { ShareGiveCard } from './colinks/give/ShareGiveCard';
import { GiveSkillLeaderboardMini } from './GiveSkillLeaderboardMini';
import { GiveSkillNav } from './GiveSkillNav';

export const GiveSkillPage = () => {
  const { skill } = useParams();
  const { isMobile } = useMobileDetect();

  return (
    <Flex column>
      <Helmet>
        <title>{skill} / GIVE / Coordinape</title>
      </Helmet>
      <ResponsiveColumnLayout>
        <Flex column>
          <Flex
            css={{
              gap: '$sm',
              mt: '-$lg',
              mb: '$sm',
            }}
          >
            {skill && <GiveSkillNav skill={skill} />}
          </Flex>

          {skill && <RecentGives skill={skill} />}
        </Flex>
        {!isMobile && (
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
            <GiveSkillLeaderboardMini />
            <ShareGiveCard skill={skill} />
            <LearnAboutGiveCard />
          </Flex>
        )}
      </ResponsiveColumnLayout>
    </Flex>
  );
};

export const GiveSkillRedirect = () => {
  const { skill } = useParams();
  return <Navigate to={coLinksPaths.giveSkill(skill ?? '')} replace />;
};
