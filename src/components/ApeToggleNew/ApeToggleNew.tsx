import React, { useState } from 'react';

import * as ToggleGroup from '@radix-ui/react-toggle-group';
import uniqueId from 'lodash/uniqueId';
import { styled } from 'stitches.config';

import { ApeInfoTooltip } from 'components';
import { Box } from 'ui';

const StyledToggleGroupRoot = styled(ToggleGroup.Root, {
  fontWeight: 300,
  variants: {
    locked: {
      true: {
        opacity: 0.6,
      },
    },
  },
});
const StyledToggleGroupItem = styled(ToggleGroup.Item, {
  minWidth: 102,
  borderRadius: '0 8px 8px 0',
  '&:not(:last-child)': {
    borderRight: '1px solid white',
    borderRadius: '8px 0 0 8px',
  },
  color: '$white',
  backgroundColor: '#A8B1B4',

  textTransform: 'none',
  textAlign: 'center',
  fontSize: 19,
  lineHeight: 1.26,
  padding: '12px 24px',
  variants: {
    active: {
      true: {
        color: '$white',
        background: '$lightBlue',
        '&:hover': {
          background: '$lightBlue',
        },
      },
      false: {
        color: '$text',
        background: '$lightBackground',
        '&:hover': {
          background: '$lighterBlue',
          color: '$white',
        },
      },
    },
  },
});
export const ApeToggleNew = ({
  value,
  onChange,
  infoTooltip,
  label,
  disabled,
}: {
  value: boolean;
  onChange: (newValue: string) => void;
  infoTooltip?: React.ReactNode;
  label?: string;
  disabled?: boolean;
}) => {
  const [enabled, setEnabled] = useState(value);
  const [groupId] = useState(uniqueId('text-field-'));
  return (
    <Box
      css={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      {(!!label || infoTooltip) && (
        <label htmlFor={groupId}>
          {label}{' '}
          {infoTooltip && <ApeInfoTooltip>{infoTooltip}</ApeInfoTooltip>}
        </label>
      )}
      <StyledToggleGroupRoot
        id={groupId}
        type="single"
        defaultValue={value ? 'true' : 'false'}
        onValueChange={value => {
          if (value) {
            onChange(value);
            if (value === 'true') {
              setEnabled(true);
            } else {
              setEnabled(false);
            }
          }
        }}
        disabled={disabled}
        locked={disabled}
      >
        <StyledToggleGroupItem active={enabled ? 'true' : 'false'} value="true">
          Yes
        </StyledToggleGroupItem>
        <StyledToggleGroupItem
          active={enabled ? 'false' : 'true'}
          value="false"
        >
          No
        </StyledToggleGroupItem>
      </StyledToggleGroupRoot>
    </Box>
  );
};

export default ApeToggleNew;
