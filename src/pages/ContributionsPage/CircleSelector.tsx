import { useState } from 'react';

import { NavOrg } from 'features/nav/getNavData';

import { Text, Select } from 'ui';

export const CircleSelector = ({ org }: { org: NavOrg }) => {
  const myCircles = org.myCircles;
  const circleOptions = myCircles.map(circle => ({
    label: circle.name,
    value: circle.id.toString(),
  }));
  const firstCircle = myCircles && myCircles[0];
  const [circleForContribution, setCircleForContribution] = useState(
    firstCircle.id.toString()
  );

  return (
    <>
      <Text>part of {myCircles?.length} circles</Text>
      <Select
        css={{ width: '100%' }}
        options={circleOptions}
        value={circleForContribution}
        onValueChange={setCircleForContribution}
        defaultValue={firstCircle.id}
        disabled={myCircles.length < 2}
        id="repeat_type"
        label="Cycles"
      />
    </>
  );
};
