import React, { useState } from 'react';

import { useApeSnackbar } from '../../hooks';
import { X } from '../../icons/__generated';
import Plus from '../../icons/__generated/Plus';
import { CSS } from '../../stitches.config';
import { Box, Button } from '../../ui';
import { normalizeError } from '../../utils/reporting';

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
      size="small"
      css={{
        ...css,
        width: '144px',
        '@sm': { visibility: 'visible' },
        '> .remove': { display: 'none' },
        '&:hover': {
          '> .remove': {
            display: 'inline',
          },
        },
      }}
      disabled={updatingTeammate}
      onClick={toggleTeammate}
      color={member.teammate ? 'tag' : 'primary'}
      outlined={member.teammate ? false : true}
    >
      {member.teammate && (
        <Box className="remove" css={{ mr: '$xs' }}>
          <X color="alert" />
        </Box>
      )}
      {!member.teammate && (
        <Box css={{ mr: '$xs' }}>
          <Plus />
        </Box>
      )}
      {updatingTeammate
        ? 'Saving...'
        : member.teammate
        ? 'Collaborator'
        : 'Add Collaborator'}
    </Button>
  );
};
