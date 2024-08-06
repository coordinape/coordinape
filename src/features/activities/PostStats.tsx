import { ChartSimple, Links } from 'icons/__generated';
import { Link, Text } from 'ui';

export const PostStats = ({ engagementScore }: { engagementScore: number }) => {
  return (
    <Link color="neutral" target="_blank" rel="noreferrer" href={'google.com'}>
      <Text tag color="neutral" size={'xs'} bold>
        <Links fa />
        CoLinks
        <Text semibold>
          <ChartSimple fa size="sm" css={{ mr: '$xs' }} />
          {engagementScore}
        </Text>
      </Text>
    </Link>
  );
};
