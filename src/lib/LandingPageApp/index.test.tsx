import React from 'react';

import { render, screen } from '@testing-library/react';

import LandingPageApp from '.';

test('renders landing page', () => {
  render(<LandingPageApp />);
  const descriptionElement = screen.getByText(
    /Scale your community with tools to reward contributors, incentivize participation and manage resources/i
  );
  expect(descriptionElement).toBeInTheDocument();
});
