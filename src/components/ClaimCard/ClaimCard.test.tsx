import { render } from '@testing-library/react';

import { ClaimCard, ClaimCardProps } from './ClaimCard';

let props: ClaimCardProps;

describe('ClaimCard', () => {
  beforeEach(() => {
    props = {
      epochInfo: [
        {
          title: 'Core Contributors',
          subTitle: 'Coordinape',
          giveInfo: 'You Received 125 GIVE',
        },
      ],
      actionSection: {
        actionText1: 'Claim 1680 USDC',
        actionText2: 'View History',
        onClaim: () => null,
        onViewHistory: () => null,
      },
    };
  });

  const renderComponent = (_props: ClaimCardProps) =>
    render(<ClaimCard {..._props} />);

  it('should render properly', () => {
    const { getByText, getByTestId } = renderComponent(props);

    expect(getByTestId('action-button-1')).toBeInTheDocument();
    expect(getByTestId('action-button-2')).toBeInTheDocument();
    expect(getByTestId('arrow-diagonal-icon')).toBeInTheDocument();

    expect(getByText(props.epochInfo[0].title)).toBeInTheDocument();
    expect(getByText(props.epochInfo[0].subTitle)).toBeInTheDocument();
    expect(getByText(props.epochInfo[0].giveInfo)).toBeInTheDocument();
  });
});
