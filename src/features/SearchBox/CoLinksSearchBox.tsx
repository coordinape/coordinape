import { ComponentProps, Dispatch } from 'react';

import { POSTS } from '../../pages/colinks/SearchPage';
import { coLinksPaths } from '../../routes/paths';

import { SearchBox } from './SearchBox';
import { SearchResults } from './SearchResults';

export const CoLinksSearchBox = (
  props: Omit<
    ComponentProps<typeof SearchBox>,
    'resultsFunc' | 'viewResultsPathFunc'
  >
) => {
  const viewResultsPathFunc = (value?: string) => {
    return value
      ? coLinksPaths.searchResult(value ?? '', POSTS)
      : coLinksPaths.search;
  };

  const resultsFunc = ({
    setPopoverOpen,
    inputRef,
  }: {
    setPopoverOpen: Dispatch<React.SetStateAction<boolean>>;
    inputRef: React.RefObject<HTMLInputElement>;
  }): React.ReactNode => {
    return (
      <SearchResults setPopoverOpen={setPopoverOpen} inputRef={inputRef} />
    );
  };

  return (
    <SearchBox
      viewResultsPathFunc={viewResultsPathFunc}
      resultsFunc={resultsFunc}
      {...props}
    />
  );
};
