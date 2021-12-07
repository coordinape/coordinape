import { Suspense } from 'react';

import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { createMock } from 'ts-auto-mock';

import { ICircle } from '../types';

import { useAllocationStepStatus } from './allocation';

test('useAllocationStepStatus is loading', async () => {
  const TestComponent = () => {
    const [completed, nextStep] = useAllocationStepStatus(0);
    const mockCircle = createMock<ICircle>();
    return (
      <div>
        <span>{completed?.size} steps completed</span>
        <span>{nextStep?.buildLabel(mockCircle)}</span>
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

  await screen.findByText('Loading...');
});
