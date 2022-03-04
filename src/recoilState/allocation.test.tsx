import { render, screen } from '@testing-library/react';
import { createMock } from 'ts-auto-mock';

import { ICircle } from '../types';
import { TestWrapper } from 'utils/testing';

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
    <TestWrapper>
      <TestComponent />
    </TestWrapper>
  );

  await screen.findByText('Loading...');
});
