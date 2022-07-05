import { styled } from '../../stitches.config';
import { Flex } from 'ui/Flex/Flex';

export const Table = styled(Flex, {
  flexDirection: 'column',
  background: '$white',
  boxShadow: '0px 12px 26px rgba(16, 30, 115, 0.06)',
  borderRadius: '$md',
});

export const Root = styled('table', {
  borderCollapse: 'collapse',
  position: 'relative',
  flexGrow: 4,
});

export const Header = styled('thead', {});

export const HeaderCell = styled('th', {
  width: '11.6%',
  fontSize: 14,
  fontWeight: 300,
  color: '$text',
  height: 48,
  cursor: 'pointer',
  userSelect: 'none',
  background: '$subtleGray',
  '&:first-child': {
    paddingLeft: '$md',
  },
  variants: {
    align: {
      center: {
        textAlign: 'center',
      },
      left: {
        textAlign: 'left',
      },
    },
    area: {
      narrow: {
        width: '5%',
      },
      wide: {
        width: '20%',
      },
    },
    clickable: {
      true: {
        '&:hover': {
          background: '$surfaceGray',
        },
      },
    },
  },
  defaultVariants: {
    align: 'center',
  },
});

export const Body = styled('tbody', {});

export const Row = styled('tr', {
  borderBottom: '0.5px solid #E3E3E3',
  minHeight: 48,
});

export const Cell = styled('td', {
  fontSize: 14,
  fontWeight: 400,
  color: '$text',
  textAlign: 'center',
  '&:first-child': {
    px: '$md',
  },
  variants: {
    align: {
      center: {
        textAlign: 'center',
      },
      left: {
        textAlign: 'left',
      },
    },
    area: {
      narrow: {
        width: '5%',
      },
      wide: {
        width: '20%',
      },
    },
    disabled: {
      true: {
        opacity: 0.3,
      },
    },
  },
  defaultVariants: {
    align: 'center',
  },
});
