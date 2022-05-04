import times from 'lodash/times';
import { CSS } from 'stitches.config';

import { Box, Button } from 'ui';

type PaginatorProps = {
  css?: CSS;
  pages: number;
  current: number;
  onSelect: (page: number) => void;
};

export const Paginator = ({
  css,
  pages,
  current,
  onSelect,
}: PaginatorProps) => {
  return (
    <Box
      css={{
        display: 'flex',
        height: '$xl',
        gap: '$sm',
        justifyContent: 'flex-end',
        '> *': {
          width: '$xl',
          height: '$xl !important',
          fontFamily: 'Inter',
          fontSize: '$4',
          fontWeight: '$normal',
          padding: 0,
          backgroundColor: 'white',
          color: '$text',
        },
        ...css,
      }}
    >
      <Button
        color="transparent"
        disabled={current === 0}
        onClick={() => onSelect(current - 1)}
      >
        &#60;
      </Button>
      {times(pages, (n: number) => (
        <Button
          key={n}
          color="transparent"
          css={
            n !== current
              ? {}
              : {
                  borderRadius: '$1',
                  backgroundColor: '$link !important',
                  color: 'white !important',
                }
          }
          onClick={() => onSelect(n)}
        >
          {n + 1}
        </Button>
      ))}
      <Button
        color="transparent"
        disabled={current === pages - 1}
        onClick={() => onSelect(current + 1)}
      >
        &#62;
      </Button>
    </Box>
  );
};
