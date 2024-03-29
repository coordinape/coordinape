import React from 'react';

import { Flex, Text } from '../../../ui';

import { ReactionGroup } from './ReactionBar';
import { ReactionButton } from './ReactionButton';

export const ReactionCounts = ({
  addReaction,
  deleteReaction,
  reactionGroups,
}: {
  addReaction(reaction: string): void;
  deleteReaction(id: number): void;
  reactionGroups: ReactionGroup[];
}) => {
  return (
    <Flex css={{ gap: '$sm', flexWrap: 'wrap' }}>
      {reactionGroups.map(rg => {
        if (!rg) {
          return null;
        }
        return (
          <ReactionButton
            color="reaction"
            data-myreaction={!!rg.myReaction}
            key={rg.reaction}
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
  );
};
