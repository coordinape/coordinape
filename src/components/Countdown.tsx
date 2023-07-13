import React, { useEffect, useState } from 'react';

import { Flex, Text } from 'ui';

interface CountdownProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft: TimeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  }, [calculateTimeLeft]);

  return (
    <Flex css={{ gap: '$sm', fontSize: '$small', color: '$secondaryText' }}>
      {timeLeft.days > 0 && <Text>{timeLeft.days} days </Text>}
      {timeLeft.hours > 0 && <Text>{timeLeft.hours} hours </Text>}
      {timeLeft.minutes > 0 && <Text>{timeLeft.minutes} minutes </Text>}
      <Text>{timeLeft.seconds} seconds </Text>
    </Flex>
  );
};

export default Countdown;
