import { LoadingIndicator } from '../../components/LoadingIndicator';
import { Flex, Text } from '../../ui';
import { ActivityRow } from '../activities/ActivityRow';
import { Activity } from '../activities/useInfiniteActivities';

export const FeaturedCasts = ({
  title,
  activities,
}: {
  title: string;
  activities: Activity[] | undefined;
}) => {
  return (
    <>
      <Flex
        column
        css={{
          gap: '$md',
          '.contributionRow': {
            borderRadius: '$2',
          },
        }}
      >
        <Flex
          column
          css={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '$3',
            background: '$tagSuccessBackground',
            p: '$md',
            color: '$tagSuccessText',
            textDecoration: 'none',
          }}
        >
          <Flex
            css={{
              alignItems: 'center',
              gap: '$sm',
            }}
          >
            <Text
              h2
              css={{
                color: '$tagSuccessText',
              }}
            >
              {title}
            </Text>
          </Flex>
        </Flex>
        {!activities ? (
          <LoadingIndicator />
        ) : (
          activities.map(a => <ActivityRow key={a.id} activity={a} />)
        )}
      </Flex>
    </>
  );
};
