import { Suspense, useEffect, useState } from 'react';

import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

import { useEpochMerkleRoot } from 'recoilState';

test('useEpochMerkleRoot for epoch 8', async () => {
  const TestComponent = () => {
    const info = useEpochMerkleRoot(8);
    const [merkleRoot, setMerkleRoot] = useState<string | undefined>();

    useEffect(() => {
      if (info) {
        setMerkleRoot(info.merkleRoot);
      }
    }, [info]);
    return (
      <div>
        <span>Merkle Root: {merkleRoot}</span>
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

  await screen.findByText(
    'Merkle Root: 0x307864356433363035363564386137663730323061376637633137303765303031323830303337353230373135393130363234643261623830343466643139653337'
  );
});
