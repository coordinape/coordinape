import { POSTS } from '../../pages/colinks/SearchPage';
import { coLinksPaths } from '../../routes/paths';

import { SearchBox } from './SearchBox';

export const CoLinksSearchBox = () => {
  const viewResultsPathFunc = (value?: string) => {
    return value
      ? coLinksPaths.searchResult(value ?? '', POSTS)
      : coLinksPaths.search;
  };

  return <SearchBox viewResultsPathFunc={viewResultsPathFunc} />;
};
