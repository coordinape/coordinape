import React from 'react';

import { render, screen } from '@testing-library/react';

import AppLandingPage from './AppLandingPage';

test('renders landing page', () => {
  render(<AppLandingPage />);
  const descriptionElement = screen.getByText(
    /Scale your community with tools to reward contributors, incentivize participation and manage resources/i
  );
  expect(descriptionElement).toBeInTheDocument();
});
