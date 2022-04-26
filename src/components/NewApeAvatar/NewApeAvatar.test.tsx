import { render } from '@testing-library/react';

import { NewApeAvatar } from './NewApeAvatar';

const profileAvatar = 'https://i.imgur.com/wSTFkRM.png';
const profileName = 'Some Random Name';

test('NewApeAvatar renders correctly', () => {
  const { container, getByTestId, getByRole } = render(
    <NewApeAvatar name={profileName} profileImagePath={profileAvatar}>
      {profileName}
    </NewApeAvatar>
  );

  const avatarComponent = getByTestId('avatar');
  expect(avatarComponent).toBeInTheDocument();
  const avater = getByRole('img');
  expect(avater).toHaveAttribute('src', profileAvatar);
  expect(avater).toHaveAttribute('alt', profileName);
  expect(container).toBeDefined();
});
