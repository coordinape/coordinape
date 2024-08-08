import { Dispatch } from 'react';

import { PartySearchResults } from './PartySearchResults';
import { SearchBox } from './SearchBox';

export const PartySearchBox = ({
  size = 'medium',
  registerKeyDown = true,
}: {
  size?: 'medium' | 'large';
  registerKeyDown?: boolean;
}) => {
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

  return (
    <SearchBox
      size={size}
      registerKeyDown={registerKeyDown}
      resultsFunc={resultsFunc}
      placeholder="Search Skill or Person"
    />
  );
};
