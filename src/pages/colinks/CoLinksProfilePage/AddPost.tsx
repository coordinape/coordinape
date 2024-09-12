import assert from 'assert';
import { useState } from 'react';

import { CoSoul } from 'features/colinks/fetchCoSouls';
import { PostForm } from 'features/colinks/PostForm';
import { useLinkingStatus } from 'features/colinks/useLinkingStatus';
import { QUERY_KEY_COLINKS } from 'features/colinks/wizard/CoLinksWizard';
import { useQueryClient } from 'react-query';

import { currentPrompt } from '../ActivityPage';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { Plus } from 'icons/__generated';
import { Text, Flex, Button } from 'ui';

export const AddPost = ({ targetAddress }: { targetAddress: string }) => {
  const currentUserAddress = useConnectedAddress(false);
  const isCurrentUser =
    currentUserAddress &&
    targetAddress.toLowerCase() == currentUserAddress.toLowerCase();
  const [promptOffset, setPromptOffset] = useState(0);
  const bumpPromptOffset = () => {
    setPromptOffset(prev => prev + 1);
  };
  const queryClient = useQueryClient();
  const [showPostForm, setPostForm] = useState<boolean>(false);
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const { targetBalance } = useLinkingStatus({
    address: currentUserAddress,
    target: targetAddress,
  });
  return (
    <>
      {isCurrentUser && targetBalance !== undefined && targetBalance > 0 && (
        <Flex column css={{ alignItems: 'flex-start' }}>
          {showPostForm ? (
            <Flex css={{ width: '100%' }}>
              <PostForm
                label={
                  <Text size={'medium'} semibold color={'heading'}>
                    {currentPrompt(promptOffset)}
                  </Text>
                }
                refreshPrompt={bumpPromptOffset}
                showLoading={showLoading}
                onSuccess={() =>
                  queryClient.setQueryData<CoSoul>(
                    [QUERY_KEY_COLINKS, targetAddress, 'cosoul'],
                    oldData => {
                      assert(oldData);
                      return {
                        ...oldData,
                        profile_public: {
                          ...oldData.profile_public,
                          post_count: oldData.profile_public?.post_count + 1,
                          post_count_last_30_days:
                            oldData.profile_public?.post_count_last_30_days + 1,
                        },
                      };
                    }
                  )
                }
                onSave={() => setShowLoading(true)}
              />
            </Flex>
          ) : (
            <Button color="primary" onClick={() => setPostForm(prev => !prev)}>
              <Plus />
              Add Post
            </Button>
          )}
        </Flex>
      )}
    </>
  );
};
