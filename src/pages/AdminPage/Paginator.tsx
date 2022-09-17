import React from 'react';

import { styled } from '../../stitches.config';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'icons/__generated';

const defaults = {
  itemsPerPage: 6,
};

const PaginatorContainer = styled('div', {
  display: 'flex',
  height: '$xl',
  gap: '$sm',
  my: '$md',
  justifyContent: 'flex-end',
});

export const PaginatorButton = styled('button', {
  width: '$xl',
  height: '$xl !important',
  fontFamily: 'Inter',
  fontSize: '$4',
  fontWeight: '$normal',
  padding: 0,
  backgroundColor: 'white',
  color: '$text',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '$1',
  transition: 'all 400ms',
  cursor: 'pointer',
  // STATES
  '&:hover': {
    backgroundColor: '$primary',
    color: '$white',
  },
  '&:disabled': {
    opacity: '0.4',
    backgroundColor: 'transparent',
    color: 'inherit',
    cursor: 'default',
  },
  variants: {
    active: {
      true: {
        // TODO: toggle 'aria-current' instead.
        borderRadius: '$1',
        backgroundColor: '$primary !important',
        color: 'white !important',
      },
    },
  },
});

export interface PaginationProps {
  currentPage: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  delta?: number;
  onPageChange: (page: number) => void;
}

export const Paginator = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  delta,
  onPageChange,
}: PaginationProps) => {
  if (!totalPages && totalItems) {
    // Calculate total pages from {totalItems} & {itemsPerPage}
    totalPages = Math.ceil(
      totalItems / (itemsPerPage || defaults.itemsPerPage)
    );
  }

  // Credits: https://github.com/thisugee/react-stitches-paginator/blob/a45eebd4002ab35466b1967712d53fd770fbbbc6/src/Pagination.tsx#L83-L109
  const pages = React.useMemo((): any[] => {
    const left = currentPage - 1;
    const right = currentPage + 2;
    const pages = [];
    const pagesWithEllipsis = [];

    for (let page = 1; page <= (totalPages as number); page++) {
      if (page === 1 || page === totalPages || (page >= left && page < right)) {
        pages.push(page);
      }
    }

    let lastIterated;
    for (const page of pages) {
      if (lastIterated) {
        if (page - lastIterated === 2) {
          pagesWithEllipsis.push(lastIterated + 1);
        } else if (page - lastIterated !== 1) {
          pagesWithEllipsis.push('...');
        }
      }
      pagesWithEllipsis.push(page);
      lastIterated = page;
    }

    return pagesWithEllipsis;
  }, [currentPage, totalPages, delta]);

  // It's not useful when paginator have single page or none.
  if (pages.length < 2) {
    return <></>;
  }

  return (
    <>
      {pages.length > 1 ? (
        <PaginatorContainer
          css={{
            height: '$xl',
            gap: '$sm',
          }}
        >
          <PaginatorButton
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft />
          </PaginatorButton>

          {pages.map(page => {
            return page === '...' ? (
              // <PaginationItem itemType="ellipsis" key={index} />
              <PaginatorButton disabled>
                <MoreHorizontal />
              </PaginatorButton>
            ) : (
              // when active page === currentPage
              <PaginatorButton
                key={page}
                onClick={() => onPageChange(page)}
                active={page === currentPage}
              >
                {page}
              </PaginatorButton>
            );
          })}

          <PaginatorButton
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight />
          </PaginatorButton>
        </PaginatorContainer>
      ) : null}
    </>
  );
};
