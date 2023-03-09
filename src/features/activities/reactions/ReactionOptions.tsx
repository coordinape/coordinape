import React, { Dispatch, useEffect, useRef } from 'react';

import { keyframes, styled } from '../../../stitches.config';
import { Flex, Text } from '../../../ui';

import { ReactionButton } from './ReactionButton';

export const DEFAULT_REACTIONS = ['👀', '👑', '🤩', '🧠', '🙏🏼', '💀'];

const slideIn = keyframes({
  from: {
    left: '-300px',
    opacity: 0,
    overflowX: 'hidden',
  },
  to: {
    left: 0,
    opacity: 1,
    overflowX: 'visible',
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
        width: 300,
        height: 40,
        left: 24,
        bottom: -8,
        // background: 'green',
        // overflowX: 'hidden',
        // overflowY: 'visible',
        // TODO: only set visible / hidden WHILE we are animating
        // overflowX: 'clip',
      }}
    >
      <Flex
        ref={ref}
        data-open={true}
        css={{
          position: 'absolute',
          overflow: 'visible',
          left: '0',
          // top: '8px',
          zIndex: 9,
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
    </Flex>
  );
};
const StyledLabel = styled('label');
