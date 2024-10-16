import { LoadingIndicator } from '../../components/LoadingIndicator';
import { Flex, Panel, Text } from '../../ui';
import { Cast } from '../activities/cast';
import { CastRow } from '../farcaster/casts/CastRow';

export const FeaturedCasts = ({
  title,
  casts,
}: {
  title: string;
  casts: Cast[] | undefined;
}) => {
  return (
    <Panel neutral>
      <Flex column css={{ gap: '$md' }}>
        <Text tag size="large" css={{ fontWeight: '$bold' }}>
          {title}
        </Text>
        {casts === undefined ? (
          <LoadingIndicator />
        ) : (
          casts.map(c => <CastRow key={c.id} cast={c} />)
        )}
      </Flex>
    </Panel>
  );
};
