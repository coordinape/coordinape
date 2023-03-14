import React, { Dispatch, useEffect, useRef } from 'react';

import { keyframes, styled } from '../../../stitches.config';
import { Flex, Text } from '../../../ui';

import { ReactionButton } from './ReactionButton';

export const DEFAULT_REACTIONS = ['🔥', '💃', '👀', '🧠', '🙏🏼', '💀'];

const reactionOptionsWidth = '300px';

const slideIn = keyframes({
  from: {
    left: `calc(${reactionOptionsWidth} * -1)`,
    opacity: 0,
  },
  to: {
    left: 0,
    opacity: 1,
  },
});

export const ReactionOptions = ({
  addReaction,
  deleteReaction,
  setShowAddReaction,
  myReactions,
}: {
  addReaction(reaction: string): void;
  deleteReaction(id: number): void;
  setShowAddReaction: Dispatch<React.SetStateAction<boolean>>;
  myReactions: { [key: string]: number };
}) => {
  const ref = useRef<HTMLDivElement>(null);

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
    <Flex
      css={{
        position: 'absolute',
        width: `${reactionOptionsWidth}`,
        height: 40,
        left: 24,
        bottom: -8,
        '&:after': {
          content: '',
          width: `${reactionOptionsWidth}`,
          height: 40,
          background: '$surface',
          position: 'absolute',
          left: `calc(${reactionOptionsWidth} * -1)`,
          zIndex: 10,
        },
      }}
    >
      <Flex
        ref={ref}
        data-open={true}
        css={{
          position: 'absolute',
          overflow: 'visible',
          left: '0',
          background: '$dim',
          padding: '$xs',
          borderRadius: '$2',
          gap: '$xs',
          '&[data-open="true"]': {
            animation: `${slideIn} .15s ease-out`,
          },
        }}
      >
        {DEFAULT_REACTIONS.map(r => {
          return (
            <ReactionButton
              key={r}
              onClick={() =>
                myReactions[r] ? deleteReaction(myReactions[r]) : addReaction(r)
              }
              css={{
                borderColor: myReactions[r] ? '$neutral' : '$primary',
                opacity: myReactions[r] ? 0.4 : 1,
                width: 34,
                height: 32,
                position: 'relative',
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
                {[...Array(16)].map((e, i) => (
                  <Text
                    size="large"
                    className={`expando${i}`}
                    key={i}
                    css={{
                      position: 'absolute',
                      left: -12,
                      top: -14,
                    }}
                  >
                    {r}
                  </Text>
                ))}
              </StyledLabel>
            </ReactionButton>
          );
        })}
      </Flex>
    </Flex>
  );
};
const StyledLabel = styled('label');
