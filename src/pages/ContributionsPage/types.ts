import type { Contribution as IntegrationContribution } from 'hooks/useContributions';

import type { Contribution, Epoch, ContributionsAndEpochs } from './queries';
import type { LinkedElement } from './util';

export type CurrentContribution = {
  contribution: LinkedElement<Contribution>;
  epoch: LinkedElement<Epoch>;
};

export type CurrentIntContribution = {
  contribution: IntegrationContribution;
  epoch?: LinkedElement<Epoch>;
};

export type LinkedContributionsAndEpochs = {
  contributions: Array<LinkedElement<Contribution>>;
  epochs: Array<LinkedElement<Epoch>>;
  users: ContributionsAndEpochs['users'];
};

export type SetActiveContributionProps = {
  setActiveContribution: (
    e: LinkedElement<Epoch>,
    c?: LinkedElement<Contribution>,
    intC?: IntegrationContribution
  ) => void;
  currentContribution: CurrentContribution | null;
};
