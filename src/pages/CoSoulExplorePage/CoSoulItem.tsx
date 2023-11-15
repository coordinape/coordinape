import { CoSoul } from '../../features/colinks/fetchCoSouls';
import { Users } from '../../icons/__generated';
import { paths } from '../../routes/paths';
import { AppLink, Avatar, Box, Flex, Image, Text } from '../../ui';
import isFeatureEnabled from 'config/features';

export const CoSoulItem = ({
  cosoul,
  expandedView = true,
}: {
  cosoul: CoSoul;
  expandedView?: boolean;
}) => {
  const repScore = cosoul.profile_public?.reputation_score?.total_score || 0;
  const tier1 = 2;
  const tier2 = 80;
  const tier3 = 100;
  const tierColor =
    repScore > tier3
      ? 'gold'
      : repScore > tier2
      ? 'indigo'
      : repScore > tier1
      ? 'gold'
      : 'transparent';
  return (
    <AppLink
      to={
        expandedView && isFeatureEnabled('soulkeys')
          ? paths.coLinksProfile(cosoul.address)
          : paths.cosoulView(cosoul.address)
      }
    >
      <Box
        key={cosoul.id}
        css={{
          overflow: 'hidden',
          borderRadius: '$4',
          position: 'relative',
          '&:hover': expandedView
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
            {expandedView && (
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
            <Flex css={{ alignItems: 'center', flexShrink: 0, gap: '$xs' }}>
              <Text size={'xs'}>Rep</Text>
              <Text semibold>{repScore ?? 0}</Text>
            </Flex>
          </Flex>
          {expandedView && (
            <Flex
              css={{
                p: '$sm',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              {cosoul.link_holders_aggregate.aggregate?.sum?.amount && (
                <Text tag size="xs" color="complete">
                  <Users />
                  {cosoul.link_holders_aggregate.aggregate?.sum?.amount}
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
