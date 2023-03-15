import React, { useEffect, useState } from 'react';

import { useMutation } from 'react-query';

import { Smile } from '../../../icons/__generated';
import { useMyProfile } from '../../../recoilState';
import { Flex } from '../../../ui';
import { Reaction } from '../useInfiniteActivities';

import { createReactionMutation, deleteReactionMutation } from './mutations';
import { ReactionButton } from './ReactionButton';
import { ReactionCounts } from './ReactionCounts';
import { DEFAULT_REACTIONS, ReactionOptions } from './ReactionOptions';
import '../heart.css';

export type ReactionGroup = {
  reaction: string;
  count: number;
  myReaction?: number;
};

export const ReactionBar = ({
  activityId,
  reactions,
}: {
  activityId: number;
  reactions: Reaction[];
}) => {
  const { id: myProfileId } = useMyProfile();
  const [currentReactions, setCurrentReactions] =
    useState<Reaction[]>(reactions);
  const [groupedReactions, setGroupedReactions] = useState<{
    [key: string]: ReactionGroup;
  }>({});
  const [myReactions, setMyReactions] = useState<{ [key: string]: number }>({});
  const [showAddReaction, setShowAddReaction] = useState(false);

  useEffect(() => {
    // reduce the reactions to counts
    const reactionGroupsMap = currentReactions.reduce<{
      [key: string]: ReactionGroup;
    }>((rgm, reaction) => {
      const rg = rgm[reaction.reaction] ?? {
        reaction: reaction.reaction,
        count: 0,
      };
      rg.count++;

      if (reaction.profile?.id === myProfileId) {
        rg.myReaction = reaction.id;
      }
      rgm[reaction.reaction] = rg;

      return rgm;
    }, {});

    setGroupedReactions(reactionGroupsMap);

    const myReacts: { [key: string]: number } = {};
    for (const react of Object.keys(reactionGroupsMap)) {
      const myReact = reactionGroupsMap[react]?.myReaction;
      if (myReact) {
        myReacts[react] = myReact;
      }
    }
    setMyReactions(myReacts);
  }, [currentReactions]);

  const { mutate: createReaction } = useMutation(createReactionMutation, {
    onSuccess: newReaction => {
      setCurrentReactions(prevState => [...prevState, newReaction]);
    },
    onSettled: () => {
      setShowAddReaction(false);
    },
  });

  const { mutate: deleteReaction } = useMutation(deleteReactionMutation, {
    onSuccess: id => {
      setCurrentReactions(prevState => prevState.filter(r => r.id !== id));
    },
    onSettled: () => {
      setShowAddReaction(false);
    },
  });

  const addReaction = (reaction: string) => {
    setTimeout(() => {
      createReaction({ activity_id: activityId, reaction });
    }, 500);
  };

  return (
    <Flex css={{ position: 'relative', overflowY: 'visible', minHeight: 24 }}>
      {showAddReaction && (
        <ReactionOptions
          deleteReaction={(id: number) => {
            deleteReaction(id);
          }}
          addReaction={addReaction}
          setShowAddReaction={setShowAddReaction}
          myReactions={myReactions}
        />
      )}

      <Flex css={{ alignItems: 'center', gap: '$xs' }}>
        <ReactionButton
          color="transparent"
          onClick={() => setShowAddReaction(prev => !prev)}
          css={{
            border: 'none',
            borderRadius: 9999,
            p: 0,
            mr: '$xxs',
            minHeight: 0,
            zIndex: 10,
            '&:hover': {
              color: '$linkHover',
            },
            svg: {
              marginRight: 0,
            },
          }}
        >
          <span role="img" aria-label="react">
            <Smile />
          </span>
        </ReactionButton>
        <ReactionCounts
          addReaction={(r: string) => {
            addReaction(r);
          }}
          deleteReaction={(id: number) => {
            deleteReaction(id);
          }}
          reactionGroups={DEFAULT_REACTIONS.map(
            react => groupedReactions[react]
          )}
        />
      </Flex>
    </Flex>
  );
};
