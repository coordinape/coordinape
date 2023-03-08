import { useEffect, useRef, useState } from 'react';

import { useMutation } from 'react-query';

import { fadeIn } from '../../keyframes';
import { useMyProfile } from '../../recoilState';
import { styled } from '../../stitches.config';
import { Flex, Text } from '../../ui';

import { createReactionMutation, deleteReactionMutation } from './mutations';
import { ReactionButton } from './ReactionButton';
import { Reaction } from './useInfiniteActivities';

import './heart.css';

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

  const defaultReactions = ['👀', '👑', '🤩', '🧠', '🙏🏼', '💀'];
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
            left: '28px',
            top: '-8px',
            zIndex: 9,
            background: '$dim',
            padding: '$xs',
            borderRadius: '$2',
            gap: '$xs',
            animation: `${fadeIn} .2s ease`,
            transition: '1.0s all',
          }}
        >
          {defaultReactions.map(r => {
            return (
              <ReactionButton
                key={r}
                onClick={() =>
                  myReactions[r]
                    ? deleteReaction(myReactions[r])
                    : addReaction(r)
                }
                css={{
                  borderColor: myReactions[r] ? '$neutral' : '$primary',
                }}
              >
                <input
                  id={'react-' + r}
                  className="toggle-heart"
                  type="checkbox"
                />
                <StyledLabel
                  className="heart-label"
                  htmlFor={'react-' + r}
                  aria-label="like"
                >
                  <Text size="large">{r}</Text>
                </StyledLabel>
              </ReactionButton>
            );
          })}
        </Flex>
      )}

      <Flex css={{ alignItems: 'center', gap: '$xs' }}>
        <ReactionButton
          onClick={() => setShowAddReaction(prev => !prev)}
          css={{
            width: 24,
            height: 24,
            borderRadius: 9999,
            padding: 0,
          }}
        >
          <span role="img" aria-label="react">
            ☺
          </span>
        </ReactionButton>
        {defaultReactions.map(react => {
          const rg = groupedReactions[react];
          if (!rg) {
            return null;
          }
          return (
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
          );
        })}
      </Flex>
    </Flex>
  );
};

const StyledLabel = styled('label');
