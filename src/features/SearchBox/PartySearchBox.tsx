import { Dispatch } from 'react';

import { coLinksPaths } from '../../routes/paths';

import { PartySearchResults } from './PartySearchResults';
import { SearchBox } from './SearchBox';

export const PartySearchBox = ({
  size = 'medium',
  registerKeyDown = true,
  profileFunc = coLinksPaths.profileGive,
  skillFunc = coLinksPaths.giveSkill,
}: {
  size?: 'medium' | 'large';
  registerKeyDown?: boolean;
  profileFunc?(address: string): string;
  skillFunc?(skill: string): string;
}) => {
  const resultsFunc = ({
    setPopoverOpen,
    inputRef,
  }: {
    setPopoverOpen: Dispatch<React.SetStateAction<boolean>>;
    inputRef: React.RefObject<HTMLInputElement>;
  }): React.ReactNode => {
    return (
      <PartySearchResults
        setPopoverOpen={setPopoverOpen}
        inputRef={inputRef}
        profileFunc={profileFunc}
        skillFunc={skillFunc}
      />
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
