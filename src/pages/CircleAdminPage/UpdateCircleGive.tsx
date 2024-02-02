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
          Default GIVE Allotment{' '}
          <Tooltip
            content={<div>The default GIVE allotment for circle members.</div>}
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
        title="Change the default GIVE allotment for all Circle Members"
        onOpenChange={() => {
          setOpenDialog(false);
        }}
      >
        <Flex column alignItems="start" css={{ gap: '$md' }}>
          <Text p>
            Clicking &quot;Apply&quot; will set the default GIVE allotment for
            all individual circle members.
          </Text>
          <Text p>
            You can still update individual GIVE allotment in the circle members
            table after setting default GIVE allotment.
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
                    showSuccess('Default GIVE allotment updated.');
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
