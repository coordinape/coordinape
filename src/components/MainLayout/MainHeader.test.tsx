import { useEffect } from 'react';

import { act, render, screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';

import { useMediaQuery } from 'hooks';
import { rSelectedCircleIdSource } from 'recoilState';
import { fixtures, TestWrapper, useMockRecoilState } from 'utils/testing';

import { MainHeader } from './MainHeader';

jest.mock('hooks/useMediaQuery', () => ({
  useMediaQuery: jest.fn(),
}));

const snapshotState: any = {};

afterEach(() => snapshotState.release?.());

test('show circle links for distributions route', async () => {
  (useMediaQuery as any).mockReturnValue(false);

  const Harness = () => {
    const navigate = useNavigate();

    useMockRecoilState(snapshotState, set => {
      set(rSelectedCircleIdSource, () => fixtures.circle.id);
    });

    useEffect(() => {
      navigate(`/circles/${fixtures.circle.id}/distributions/10`);
    }, []);

    return <MainHeader />;
  };

  await act(async () => {
    await render(
      <TestWrapper withWeb3>
        <Harness />
      </TestWrapper>
    );
  });

  expect(screen.getByText('Allocate')).toBeTruthy();
});
