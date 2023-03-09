/* eslint-disable */
import React from 'react';

import { Text } from '../../../ui';

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
    <>
      {reactionGroups.map(rg => {
        if (!rg) {
          return null;
        }
        console.log(rg);
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
    </>
  );
};
