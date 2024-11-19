import { DownloadIcon } from '@radix-ui/react-icons';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Helmet } from 'react-helmet';
import { Navigate, useParams } from 'react-router-dom';
import { CSS } from 'stitches.config';

import { webAppURL } from '../config/webAppURL';
import { useToast } from '../hooks';
import useProfileId from '../hooks/useProfileId';
import { Wand } from '../icons/__generated';
import { client } from '../lib/gql/client';
import { coLinksPaths } from '../routes/paths';
import { Button, Flex, Link } from '../ui';
import { normalizeError } from '../utils/reporting';

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
          {skill && (
            <ExportCSVButton
              skill={skill}
              css={{
                display: 'none',
                '@sm': {
                  display: 'block',
                  mb: '$md',
                },
              }}
            />
          )}
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
          <CastButton
            skill={skill}
            css={{
              '@sm': {
                display: 'none',
              },
            }}
          />
          {skill && (
            <ExportCSVButton
              skill={skill}
              css={{
                '@sm': {
                  display: 'none',
                },
              }}
            />
          )}
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

const ExportCSVButton = ({ css, skill }: { css?: CSS; skill: string }) => {
  const { openConnectModal } = useConnectModal();

  const profileId = useProfileId(false);
  const { showError } = useToast();

  const exportCSV = async () => {
    if (!profileId) {
      if (openConnectModal) {
        openConnectModal();
      }
    } else {
      try {
        const { skillCsv } = await client.mutate(
          {
            skillCsv: [
              {
                payload: { skill },
              },
              {
                file: true,
              },
            ],
          },
          { operationName: 'generateSkill_' + skill }
        );
        if (skillCsv?.file) {
          const a = document.createElement('a');
          a.href = skillCsv.file;
          a.click();
          a.href = '';
        }
      } catch (e: any) {
        showError('unable to generate csv: ' + normalizeError(e));
      }
    }
  };

  return (
    <Button
      as={Link}
      onClick={exportCSV}
      target="_blank"
      rel="noreferrer"
      css={{
        ...css,
      }}
    >
      <DownloadIcon /> Export CSV
    </Button>
  );
};
