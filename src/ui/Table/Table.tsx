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
  'th, td': {
    textAlign: 'center',
    fontWeight: 'normal',
    color: '$text',
  },
  'th:first-child, td:first-child': {
    textAlign: 'left',
    paddingLeft: '$md',
  },
  'tbody tr': {
    borderBottom: '0.5px solid $border',
    backgroundColor: '$white',
    height: '$2xl',
  },
  'tbody tr:first-child': {
    borderTop: '0.5px solid $border',
  },
  boxShadow: '0px 12px 26px rgba(16, 30, 115, 0.06)',
  borderRadius: '$3',
  overflow: 'hidden',
});

export type TableType = ReturnType<typeof Table>;
