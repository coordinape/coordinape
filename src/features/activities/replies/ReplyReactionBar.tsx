import React, { useEffect, useState } from 'react';

import { useAuthStore } from 'features/auth';
import { useMutation } from 'react-query';

import { FaceSmile } from '../../../icons/__generated';
import { Flex } from '../../../ui';
import { ReactionButton } from '../reactions/ReactionButton';
import { ReactionCounts } from '../reactions/ReactionCounts';
import {
  DEFAULT_REACTIONS,
  ReactionOptions,
} from '../reactions/ReactionOptions';

import {
  createReplyReactionMutation,
  deleteReplyReactionMutation,
} from './mutations';
import '../heart.css';
import { Reply } from './RepliesBox';

type Reaction = Reply['reactions'][number];

type ReactionGroup = {
  reaction: string;
  count: number;
  myReaction?: number;
};

export const ReplyReactionBar = ({
  reactions,
  drawer,
  replyId,
  activityId,
}: {
  reactions: Reaction[];
  drawer?: boolean;
  replyId: number;
  activityId: number;
}) => {
  const myProfileId = useAuthStore(state => state.profileId);
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

      if (reaction.profile_public?.id === myProfileId) {
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

  const { mutate: createReplyReaction } = useMutation(
    createReplyReactionMutation,
    {
      onSuccess: newReaction => {
        setCurrentReactions(prevState => [...prevState, newReaction]);
      },
      onSettled: () => {
        setShowAddReaction(false);
      },
    }
  );

  const { mutate: deleteReplyReaction } = useMutation(
    deleteReplyReactionMutation,
    {
      onSuccess: id => {
        setCurrentReactions(prevState => prevState.filter(r => r.id !== id));
      },
      onSettled: () => {
        setShowAddReaction(false);
      },
    }
  );

  const addReaction = (reaction: string) => {
    setTimeout(() => {
      createReplyReaction({
        reply_id: replyId,
        reaction,
        activity_id: activityId,
      });
    }, 500);
  };

  return (
    <Flex css={{ position: 'relative', overflowY: 'visible', minHeight: 24 }}>
      {showAddReaction && (
        <ReactionOptions
          drawer={drawer}
          deleteReaction={(id: number) => {
            deleteReplyReaction(id);
          }}
          addReaction={addReaction}
          setShowAddReaction={setShowAddReaction}
          myReactions={myReactions}
        />
      )}
      <Flex css={{ alignItems: 'center', gap: '$sm' }}>
        <ReactionButton
          className="iconReaction"
          color="transparent"
          onClick={() => setShowAddReaction(prev => !prev)}
          css={{
            border: 'none',
            borderRadius: 9999,
            p: 0,
            mr: '$xxs',
            minHeight: 0,
            backgroundColor: 'transparent',
            color: '$secondaryText',
            '&:hover': {
              color: '$linkHover',
              background: '$tagCtaBackground',
            },
            svg: {
              marginRight: 0,
            },
          }}
        >
          <span role="img" aria-label="react">
            <FaceSmile fa />
          </span>
        </ReactionButton>
        <ReactionCounts
          addReaction={(r: string) => {
            addReaction(r);
          }}
          deleteReaction={(id: number) => {
            deleteReplyReaction(id);
          }}
          reactionGroups={DEFAULT_REACTIONS.map(
            react => groupedReactions[react]
          )}
        />
      </Flex>
    </Flex>
  );
};
