import { Dispatch } from 'react';

import { PartySearchResults } from './PartySearchResults';
import { SearchBox } from './SearchBox';

export const PartySearchBox = () => {
  const resultsFunc = ({
    setPopoverOpen,
    inputRef,
  }: {
    setPopoverOpen: Dispatch<React.SetStateAction<boolean>>;
    inputRef: React.RefObject<HTMLInputElement>;
  }): React.ReactNode => {
    return (
      <PartySearchResults setPopoverOpen={setPopoverOpen} inputRef={inputRef} />
    );
  };

  return <SearchBox resultsFunc={resultsFunc} />;
};
