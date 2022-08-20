import React from 'react';

import { Link } from './Link/Link';

const HintButton = ({
  children,
  href,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <Link
      css={{ color: '$primary' }}
      target="_blank"
      rel={'noreferrer'}
      href={href}
    >
      {children}
    </Link>
  );
};

export default HintButton;
