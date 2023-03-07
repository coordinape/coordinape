import { useEffect, useRef, useState } from 'react';

import { GithubCounter, GithubSelector } from '@charkour/react-reactions';

import { Box, Flex, Text } from '../../ui';

import { ContributionRow } from './ContributionRow';
import { DeletedRow } from './DeletedRow';
import { EpochCreatedRow } from './EpochCreatedRow';
import { EpochEndedRow } from './EpochEndedRow';
import { EpochStartedRow } from './EpochStartedRow';
import { NewUserRow } from './NewUserRow';
import {
  Activity,
  IsContribution,
  IsDeleted,
  IsEpochCreated,
  IsEpochEnded,
  IsEpochStarted,
  IsNewUser,
} from './useInfiniteActivities';

export const ActivityRow = ({ activity }: { activity: Activity }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        event.target &&
        !ref.current.contains(event.target as Node)
      ) {
        setShowAddReaction(false);
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  const [showAddReaction, setShowAddReaction] = useState(false);
  const [reactions, setReactions] = useState<{ emoji: string; by: string }[]>(
    []
  );

  const valid = validActivity(activity);
  if (!valid) {
    if (IsDeleted(activity)) {
      return <DeletedRow activity={activity} />;
    } else {
      // TODO: send these to Sentry when this goes into production
      return <Text>Unknown activity: {activity.action}</Text>;
    }
  }

  return (
    <Flex column>
      {valid}
      <Box css={{ position: 'relative' }}>
        {showAddReaction && (
          <Box
            ref={ref}
            css={{
              position: 'absolute',
              top: '-100px',
              left: '0',
              zIndex: 9,
            }}
          >
            <GithubSelector
              reactions={['👀', '🫀', '🧑🏽‍🌾']}
              onSelect={e => {
                setReactions(prev => [...prev, { emoji: e, by: 'randy' }]);
                setShowAddReaction(false);
              }}
            />
          </Box>
        )}
        <Flex>
          <GithubCounter
            counters={reactions}
            onAdd={() => setShowAddReaction(true)}
            onSelect={e =>
              setReactions(prev => [...prev, { emoji: e, by: 'randy2' }])
            }
          />
        </Flex>
      </Box>
    </Flex>
  );
};

const validActivity = (activity: Activity) => {
  if (IsContribution(activity)) {
    return <ContributionRow activity={activity} />;
  } else if (IsNewUser(activity)) {
    return <NewUserRow activity={activity} />;
  } else if (IsEpochCreated(activity)) {
    return <EpochCreatedRow activity={activity} />;
  } else if (IsEpochStarted(activity)) {
    return <EpochStartedRow activity={activity} />;
  } else if (IsEpochEnded(activity)) {
    return <EpochEndedRow activity={activity} />;
  }
  return undefined;
};
