import { isFeatureEnabled } from '../../config/features';
import { Key, Users } from '../../icons/__generated';
import { AppLink, Avatar, Box, Flex, Image, Text } from '../../ui';

import { CoSoul } from './useInfiniteCoSouls';

export const CoSoulItem = ({ cosoul }: { cosoul: CoSoul }) => {
  return (
    <AppLink
      to={
        (isFeatureEnabled('soulkeys') ? '/soulkeys' : '/cosoul') +
        `/${cosoul.address}`
      }
    >
      <Box
        key={cosoul.id}
        css={{
          overflow: 'hidden',
          borderRadius: '$4',
          position: 'relative',
          '&:hover': {
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            transform: 'scale(1.05)',
          },
        }}
      >
        <Box
          css={{
            width: '100%',
            aspectRatio: '1 / 1',
          }}
        >
          <Image
            css={{
              width: '100%',
              aspectRatio: '1 / 1',
            }}
            src={`/_vercel/image?url=/cdn/cosoul/screenshots/${cosoul.token_id}.png&w=512&q=100`}
            alt="CoSoul Screenshot"
          />
        </Box>
        <Flex
          css={{
            p: '$sm',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Flex
            css={{
              gap: '$sm',
              alignItems: 'center',
              flexGrow: 0,
              flexShrink: 1,
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
          <Flex column css={{ alignItems: 'flex-end', flexShrink: 0 }}>
            <Text semibold color="cta">
              {cosoul.pgive ?? 0}
            </Text>
            <Text size={'xs'} color="cta" css={{ opacity: 0.8 }}>
              pGIVE
            </Text>
          </Flex>
        </Flex>
        <Flex
          css={{
            p: '$sm',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Text tag size="xs" color="complete">
            <Users />
            {cosoul.key_holders_aggregate.aggregate?.sum?.amount}
          </Text>
          <Text tag size="xs" color="neutral">
            <Key />
            {cosoul.held_keys_aggregate.aggregate?.sum?.amount}
          </Text>
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
