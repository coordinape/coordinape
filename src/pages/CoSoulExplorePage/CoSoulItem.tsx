import { AppLink, Avatar, Box, Flex, Image, Text } from '../../ui';

import { CoSoul } from './useInfiniteCoSouls';

const s3bucket = process.env.REACT_APP_S3_BASE_URL;

export const CoSoulItem = ({ cosoul }: { cosoul: CoSoul }) => {
  return (
    <AppLink to={`/cosoul/${cosoul.address}`}>
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
            src={`${s3bucket}/cosoul/screenshots/${cosoul.token_id}.png`}
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
