import { useState } from 'react';

import { NavOrg } from 'features/nav/getNavData';

import { Avatar, Select } from 'ui';

export const CircleSelector = ({
  org,
  onCircleSelection,
}: {
  org: NavOrg;
  onCircleSelection: (selectedValue: string) => void;
}) => {
  const myCircles = org.myCircles;
  const circleOptions = myCircles.map(circle => ({
    label: circle.name,
    value: circle.id.toString(),
    icon: (
      <Avatar
        name={circle.name}
        size="xs"
        margin="none"
        css={{ mr: '$sm' }}
        path={circle.logo}
      />
    ),
  }));
  const firstCircle = myCircles && myCircles[0];
  const [circleForContribution, setCircleForContribution] = useState(
    firstCircle.id.toString()
  );
  const handleCircleChange = (selectedValue: string) => {
    setCircleForContribution(selectedValue);
    onCircleSelection(selectedValue); // Call the callback in the parent
  };

  return (
    <Select
      css={{ width: '100%', mx: '$xs' }}
      options={circleOptions}
      value={circleForContribution}
      onValueChange={handleCircleChange}
      defaultValue={firstCircle.id}
      disabled={myCircles.length < 2}
      id="circle_for_contribution"
    />
  );
};
