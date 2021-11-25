import { Suspense } from 'react';

import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

import { useAllocationStepStatus } from './allocation';

test('useAllocationStepStatus has a default value', async () => {
  const TestComponent = () => {
    const [completed, nextStep] = useAllocationStepStatus(0);
    return (
      <div>
        <span>{completed?.size} steps completed</span>
        <span>{nextStep?.label}</span>
      </div>
    );
  };

  render(
    <RecoilRoot>
      <Suspense fallback="Loading...">
        <TestComponent />
      </Suspense>
    </RecoilRoot>
  );

  await screen.findByText('0 steps completed');
  await screen.findByText('My Epoch');
});
