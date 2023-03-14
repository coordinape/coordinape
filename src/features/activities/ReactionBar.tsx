import { useEffect, useRef, useState } from 'react';

import { PlusCircledIcon } from '@radix-ui/react-icons';
import { useMutation } from 'react-query';

import { useMyProfile } from '../../recoilState';
import { Flex, Text } from '../../ui';

import { createReactionMutation, deleteReactionMutation } from './mutations';
import { ReactionButton } from './ReactionButton';
import { Reaction } from './useInfiniteActivities';

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

  const [reactionGroups, setReactionGroups] = useState<ReactionGroup[]>([]);

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

    setReactionGroups(() => {
      const keys = Object.keys(reactionGroupsMap);
      keys.sort();
      return keys.map(k => reactionGroupsMap[k]);
    });
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
  });

  const addReaction = (reaction: string) => {
    createReaction({ activity_id: activityId, reaction });
  };

  const defaultReactions = ['👀', '🫀', '🧑', '🌾'];
  const [showAddReaction, setShowAddReaction] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  type ReactionGroup = {
    reaction: string;
    count: number;
    myReaction?: number;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        event.target &&
        !ref.current.contains(event.target as Node)
      ) {
        event.stopPropagation();
        setShowAddReaction(false);
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <Flex css={{ position: 'relative' }}>
      {showAddReaction && (
        <Flex
          ref={ref}
          css={{
            position: 'absolute',
            top: '-54px',
            left: '0',
            zIndex: 9,
            background: '$dim',
            padding: '$xs',
            borderRadius: '$2',
          }}
        >
          {defaultReactions.map(r => {
            const reacted: boolean = reactionGroups.some(
              myReaction => myReaction.reaction === r && myReaction.myReaction
            );
            return (
              <ReactionButton
                key={r}
                disabled={reacted}
                onClick={() => addReaction(r)}
              >
                <Text size="large">{r}</Text>
              </ReactionButton>
            );
          })}
        </Flex>
      )}
      <ReactionButton onClick={() => setShowAddReaction(prev => !prev)}>
        <PlusCircledIcon />
      </ReactionButton>

      <Flex css={{ alignItems: 'center' }}>
        {reactionGroups.map(rg => (
          <ReactionButton
            key={rg.reaction}
            myReaction={rg.myReaction}
            onClick={() => {
              rg.myReaction
                ? deleteReaction(rg.myReaction)
                : addReaction(rg.reaction);
            }}
          >
            <Text css={{ alignItems: 'center' }}>
              {rg.reaction} {rg.count}
            </Text>
          </ReactionButton>
        ))}
      </Flex>
    </Flex>
  );
};
