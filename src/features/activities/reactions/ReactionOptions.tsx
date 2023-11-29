import React, { Dispatch, useEffect, useRef } from 'react';

import { keyframes, styled } from '../../../stitches.config';
import { Flex, Text } from '../../../ui';

import { ReactionButton } from './ReactionButton';

export const DEFAULT_REACTIONS = [
  '🔥',
  '💃',
  '👀',
  '🧠',
  '🙏🏼',
  '💀',
  '⭐️',
  '😆',
  '❤️',
  '🚀',
];

const reactionOptionsWidth = '300px';
const reactionOptionWidth = '34px';

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
  drawer,
}: {
  addReaction(reaction: string): void;
  deleteReaction(id: number): void;
  setShowAddReaction: Dispatch<React.SetStateAction<boolean>>;
  myReactions: { [key: string]: number };
  drawer?: boolean;
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
          background: drawer ? '$surfaceNested' : '$surface',
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
          background: drawer ? '$surface' : '$dim',
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
              color="reaction"
              key={r}
              onClick={() =>
                myReactions[r] ? deleteReaction(myReactions[r]) : addReaction(r)
              }
              data-myreaction={!!myReactions[r]}
              css={{
                width: `${reactionOptionWidth}`,
                height: `calc(${reactionOptionWidth} - 2px)`,
                position: 'relative',
                borderColor: 'transparent',
              }}
            >
              <input
                id={'react-' + r}
                data-testid={'toggle-' + r}
                className="reaction-input"
                type="checkbox"
              />
              <StyledLabel
                className="reaction-label"
                htmlFor={'react-' + r}
                aria-label="like"
                onClick={e => {
                  e.stopPropagation();
                }}
              >
                {[...Array(16)].map((e, i) => (
                  <Text
                    size="large"
                    className={`expando${i}`}
                    key={i}
                    css={{
                      position: 'absolute',
                      // size the clickarea to be as big as the button
                      width: `${reactionOptionWidth}`,
                      height: `${reactionOptionWidth}`,
                      left: `calc(${reactionOptionWidth} / -2)`,
                      top: `calc(${reactionOptionWidth} / -2)`,
                      padding: '1px 5px',
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
