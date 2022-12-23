import React, { useState } from 'react';

import { CSS } from 'stitches.config';

import { normalizeError } from '../../utils/reporting';
import { useApeSnackbar } from 'hooks';
import { Check, Plus, X } from 'icons/__generated';
import { Box, Button } from 'ui';

import { Member } from './index';

type ContributorButtonProps = {
  member: Member;
  updateTeammate(id: number, teammate: boolean): void;
  css?: CSS;
};

// ContributorButton toggles whether a member is a contributor or not
export const ContributorButton = ({
  member,
  updateTeammate,
  css,
}: ContributorButtonProps) => {
  const { showError } = useApeSnackbar();

  const [updatingTeammate, setUpdatingTeammate] = useState(false);

  const toggleTeammate = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setUpdatingTeammate(true);
    try {
      await updateTeammate(member.id, !member.teammate);
    } catch (e) {
      showError(normalizeError(e));
    } finally {
      setUpdatingTeammate(false);
    }
  };

  return (
    <Button
      data-testid="collaborator-button"
      size="small"
      css={{
        fontWeight: '$semibold',
        width: '7.5rem',
        height: '$lg',
        '@sm': {
          visibility: 'visible !important',
          minWidth: 0,
        },
        gap: '$xs',
        whiteSpace: 'nowrap',
        ...css,
        '.remove': { display: 'none' },
        '&:hover': {
          '.remove': {
            display: 'inline',
          },
          '.teammate': {
            display: 'none',
          },
        },
      }}
      disabled={updatingTeammate}
      onClick={toggleTeammate}
      color={member.teammate ? 'tag' : 'primary'}
      outlined={member.teammate ? false : true}
    >
      {member.teammate && (
        <>
          <Box as="span" className="teammate">
            <Check />
          </Box>
          <Box as="span" className="remove">
            <X />
          </Box>
        </>
      )}
      {!member.teammate && (
        <Box as="span">
          <Plus />
        </Box>
      )}
      {updatingTeammate ? 'Saving...' : 'Collaborator'}
    </Button>
  );
};
