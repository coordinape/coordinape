import { CoSoul } from '../../features/colinks/fetchCoSouls';
import { Users } from '../../icons/__generated';
import { paths } from '../../routes/paths';
import { AppLink, Avatar, Box, Flex, Image, Text } from '../../ui';
import isFeatureEnabled from 'config/features';

export const CoSoulItem = ({
  cosoul,
  exploreView = true,
}: {
  cosoul: CoSoul;
  exploreView?: boolean;
}) => {
  const repScore = cosoul.profile_public?.reputation_score?.total_score || 0;
  const tier1 = 1;
  const tier2 = 1000;
  const tier3 = 3000;
  const tierColor =
    repScore > tier3
      ? '#E3A102'
      : repScore > tier2
      ? '#1EC6AD'
      : repScore > tier1
      ? '#9995E0'
      : 'transparent';
  return (
    <AppLink
      to={
        exploreView && isFeatureEnabled('soulkeys')
          ? paths.coLinksProfile(cosoul.address)
          : paths.coLinksRepScore(cosoul.address)
      }
    >
      <Box
        key={cosoul.id}
        css={{
          overflow: 'hidden',
          borderRadius: '$4',
          position: 'relative',
          '&:hover': exploreView
            ? {
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                transform: 'scale(1.05)',
              }
            : undefined,
        }}
      >
        <Box
          css={{
            width: '100%',
            aspectRatio: '1 / 1',
          }}
        >
          <Box
            css={{
              background: tierColor,
              width: '100%',
              aspectRatio: '1 / 1',
              position: 'absolute',
              mixBlendMode: 'overlay',
            }}
          />
          <Image
            css={{
              width: '100%',
              aspectRatio: '1 / 1',
            }}
            src={`https://app.coordinape.com/_vercel/image?url=/cdn/cosoul/screenshots/${cosoul.token_id}.png&w=512&q=100`}
            alt="CoSoul Screenshot"
          />
        </Box>
        <Flex
          column
          css={{
            width: '100%',
            background:
              repScore && repScore > tier1
                ? `linear-gradient(.15turn, color-mix(in srgb, ${tierColor} 40%, $surface), color-mix(in srgb, ${tierColor} 20%, $surface))`
                : '$surface',
          }}
        >
          <Flex
            css={{
              p: '$sm',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '$text',
            }}
          >
            {exploreView && (
              <Flex
                css={{
                  gap: '$sm',
                  alignItems: 'center',
                  flexGrow: 0,
                  flexShrink: 1,
                  color: '$text',
                }}
              >
                <Avatar
                  path={cosoul.profile_public?.avatar}
                  size="small"
                  name={cosoul.profile_public?.name ?? 'New'}
                />
                {/*TODO: if the name is long here this doesn't properly shrink */}
                <Text
                  ellipsis
                  size="small"
                  semibold
                  css={{ flexGrow: 0, flexShrink: 1 }}
                >
                  {abbreviateString(cosoul.profile_public?.name ?? 'Anon', 14)}
                </Text>
              </Flex>
            )}
            <Flex
              css={{
                alignItems: 'center',
                flexShrink: 0,
                width: exploreView ? undefined : '100%',
                gap: '$md',
                justifyContent: 'space-between',
              }}
            >
              <Flex css={{ gap: '$xs', alignItems: 'center' }}>
                <Text size={'xs'}>Rep</Text>
                <Text semibold>{repScore ?? 0}</Text>
              </Flex>
              {!exploreView && (
                <>
                  <Flex css={{ gap: '$xs', alignItems: 'center' }}>
                    <Text size={'xs'}>Holders</Text>
                    <Text semibold>{cosoul.holders ?? 0}</Text>
                  </Flex>
                  <Flex css={{ gap: '$xs', alignItems: 'center' }}>
                    <Text size={'xs'}>Posts</Text>
                    <Text semibold>
                      {cosoul.profile_public?.post_count ?? 0}
                    </Text>
                  </Flex>
                  <Flex css={{ gap: '$xs', alignItems: 'center' }}>
                    <Text size={'xs'}>Posts/30d</Text>
                    <Text semibold>
                      {cosoul.profile_public?.post_count_last_30_days ?? 0}
                    </Text>
                  </Flex>
                  <AppLink
                    to={paths.coLinksRepScore(cosoul.address)}
                    css={{ fontSize: '$xs' }}
                  >
                    View Details
                  </AppLink>
                </>
              )}
            </Flex>
          </Flex>
          {exploreView && (
            <Flex
              css={{
                p: '$sm',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              {cosoul.holders !== 0 && (
                <Text tag size="xs" color="complete">
                  <Users />
                  {cosoul.holders}
                </Text>
              )}
            </Flex>
          )}
        </Flex>
      </Box>
    </AppLink>
  );
};

function abbreviateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength - 3) + '...';
}
