import { DateTime } from 'luxon';

import { useContributions } from 'hooks/useContributions';
import { Panel, Text } from 'ui';

import { ContributionRow } from './ContributionRow';
import type { Contribution, Epoch } from './queries';
import type { SetActiveContributionProps } from './types';
import { contributionIcon } from './util';
import type { LinkedElement } from './util';

type ContributionListProps = {
  contributions: Array<LinkedElement<Contribution>>;
  epoch: LinkedElement<Epoch>;
  userAddress?: string;
} & SetActiveContributionProps;

export const ContributionList = ({
  epoch,
  contributions,
  setActiveContribution,
  currentContribution,
  userAddress,
}: ContributionListProps) => {
  // epochs are listed in chronologically descending order
  // so the next epoch in the array is the epoch that ended
  // before the one here
  const priorEpoch = epoch.next();
  const integrationContributions = useContributions({
    address: userAddress || '',
    startDate: priorEpoch
      ? priorEpoch.end_date
      : // add a buffer of time before the start date if this is the first epoch
        // Querying from epoch time 0 is apparently an unwelcome
        // practice for some integrators
        DateTime.fromISO(epoch.start_date).minus({ months: 1 }).toISO(),
    endDate: epoch.end_date,
    mock: false,
  });

  return (
    <>
      {contributions.length || integrationContributions?.length ? (
        <>
          {contributions.map(c => (
            <ContributionRow
              key={c.id}
              active={currentContribution?.contribution.id === c.id}
              description={c.description}
              datetime_created={c.created_at}
              onClick={() => {
                setActiveContribution(epoch, c, undefined);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActiveContribution(epoch, c, undefined);
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            />
          ))}
          {integrationContributions?.map(c => (
            <Panel
              key={c.title}
              css={{
                border: '1px solid $border',
                cursor: 'pointer',
                '&:hover': {
                  background: '$highlight',
                  borderColor: '$link',
                },
              }}
              onClick={() => {
                setActiveContribution(epoch, undefined, c);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActiveContribution(epoch, undefined, c);
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              <Text
                ellipsis
                css={{
                  mr: '10px',
                  '@lg': {
                    maxWidth: '53rem',
                  },
                  '@md': {
                    maxWidth: '36rem',
                  },
                  '@sm': {
                    maxWidth: 'none',
                  },
                }}
              >
                {contributionIcon(c.source)}
                {c.title}
              </Text>
            </Panel>
          ))}
        </>
      ) : epoch.id !== 0 ? (
        <Text>You don&apos;t have any contributions in this epoch</Text>
      ) : (
        <Text>You don&apos;t have any contributions yet</Text>
      )}
    </>
  );
};
