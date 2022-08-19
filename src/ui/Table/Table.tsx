import { styled } from '@stitches/react';

export const Table = styled('table', {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '$3',
  tr: {
    borderBottom: '0.5px solid $lightBackground',
  },
  'thead tr': {
    backgroundColor: '$white',
    height: '$2xl',
  },
  'thead tr th': {
    color: '$secondaryText',
    fontWeight: '$semibold',
  },
  'th, td': {
    textAlign: 'center',
    fontWeight: 'normal',
    color: '$text',
    '&.alignRight': {
      textAlign: 'right',
    },
  },
  'th:first-child, td:first-child': {
    textAlign: 'left',
    paddingLeft: '$md',
  },
  'tbody tr': {
    borderBottom: '0.5px solid $border',
    backgroundColor: '$background',
    height: '$2xl',
  },
  'tbody tr:first-child': {
    borderTop: '0.5px solid $border',
  },
});

export type TableType = ReturnType<typeof Table>;
