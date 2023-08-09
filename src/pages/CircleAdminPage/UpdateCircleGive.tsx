import { useState } from 'react';

import { updateCircleStartingTokens } from 'lib/gql/mutations';
import { useQueryClient } from 'react-query';

import { useToast } from 'hooks';
import { Info } from 'icons/__generated';
import { Button, TextField, Flex, Text, Tooltip, Modal } from 'ui';

import { QUERY_KEY_CIRCLE_SETTINGS } from './getCircleSettings';

export const UpdateCircleGive = ({
  circleId,
  circleStartingTokens,
}: {
  circleId: number;
  circleStartingTokens?: number;
}) => {
  const queryClient = useQueryClient();
  const [isApplying, setIsApplying] = useState(false);
  const [startingTokens, setStartingTokens] = useState(
    circleStartingTokens ?? 0
  );
  const [openDialog, setOpenDialog] = useState(false);
  const { showSuccess, showError } = useToast();

  return (
    <>
      <Flex column css={{ gap: '$sm' }}>
        <Text variant="label" as="label" htmlFor={'starting_tokens'}>
          Starting GIVE{' '}
          <Tooltip
            content={<div>The starting GIVE amount for circle members.</div>}
          >
            <Info size="sm" />
          </Tooltip>
        </Text>
        <Flex css={{ gap: '$sm' }}>
          <TextField
            type="number"
            id="starting_tokens"
            value={startingTokens}
            min={0}
            onChange={e => {
              setStartingTokens(Number(e.target.value));
            }}
          ></TextField>
          <Button
            disabled={startingTokens === circleStartingTokens}
            color="secondary"
            onClick={async e => {
              e.preventDefault();
              setOpenDialog(true);
            }}
          >
            {isApplying ? 'Applying...' : 'Apply'}
          </Button>
        </Flex>
      </Flex>
      <Modal
        open={openDialog}
        title="Change the starting GIVE for all Circle Members"
        onOpenChange={() => {
          setOpenDialog(false);
        }}
      >
        <Flex column alignItems="start" css={{ gap: '$md' }}>
          <Text p>
            Clicking &quot;Apply&quot; will set the starting GIVE amount for all
            individual Circle Members.
          </Text>
          <Text p>
            You can still update individual starting GIVE amounts in the Circle
            Members table after setting starting GIVE.
          </Text>
          <Flex css={{ gap: '$sm' }}>
            <Button
              color="primary"
              onClick={async () => {
                setIsApplying(true);
                await updateCircleStartingTokens({
                  circle_id: circleId,
                  starting_tokens: startingTokens,
                })
                  .then(() => {
                    showSuccess('Starting GIVE updated.');
                    queryClient.invalidateQueries(QUERY_KEY_CIRCLE_SETTINGS);
                  })
                  .catch(e => showError(e));
                setIsApplying(false);
                setOpenDialog(false);
              }}
            >
              {isApplying ? 'Applying...' : 'Apply'}
            </Button>
            <Button
              color="destructive"
              onClick={() => {
                setOpenDialog(false);
              }}
            >
              Cancel
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
};
