import { RecentGives } from 'features/colinks/RecentGives';
import { Helmet } from 'react-helmet';
import { Navigate, NavLink, useParams } from 'react-router-dom';

import { coLinksPaths } from '../routes/paths';
import { Button, Flex } from '../ui';
import useMobileDetect from 'hooks/useMobileDetect';
import { Maximize } from 'icons/__generated';

import { ResponsiveColumnLayout } from './colinks/give/GivePage';
import { LearnAboutGiveCard } from './colinks/give/LearnAboutGiveCard';
import { GiveSkillNav } from './GiveSkillNav';
import { AutosizedGiveGraph } from './NetworkViz/AutosizedGiveGraph';

export const GiveSkillPage = () => {
  const { skill } = useParams();
  const { isMobile } = useMobileDetect();

  return (
    <Flex column>
      <Helmet>
        <title>{skill} / GIVE / CoLinks</title>
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
            <Flex
              css={{
                position: 'relative',
                height: 200,
                width: '100%',
                overflow: 'hidden',
                background: 'rgba(0,0,0,0.1)',
                borderRadius: '$2',
                mb: '$sm',
              }}
            >
              <AutosizedGiveGraph
                mapHeight={200}
                expand={false}
                skill={skill}
              />
              <Flex
                css={{
                  position: 'absolute',
                  bottom: '$sm',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Button
                  as={NavLink}
                  to={coLinksPaths.skillGiveMap(`${skill}`)}
                  color={'cta'}
                  size="xs"
                >
                  <Maximize />
                  Expand GIVE Map
                </Button>
              </Flex>
            </Flex>
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
