import { ReactElement, useEffect } from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot, useRecoilState } from 'recoil';
import { withDesign } from 'storybook-addon-designs';

import { Box } from '../../ui';
import { rApiManifest } from 'recoilState';

import { DefaultPage } from './DefaultPage';

export default {
  title: 'Design System/Molecules/DefaultPage',
  component: DefaultPage,
  decorators: [withDesign],
} as ComponentMeta<typeof DefaultPage>;

const mockManifest = {
  active_epochs: [],
  circles: [],
  myUsers: [],
  profile: { id: 1, address: '0x0' },
};

const RecoilFixtures = ({ children }: { children: ReactElement }) => {
  const [manifest, setManifest] = useRecoilState(rApiManifest);
  useEffect(() => {
    setManifest(mockManifest);
  }, []);
  return manifest ? children : null;
};

const Template: ComponentStory<typeof DefaultPage> = () => {
  return (
    <RecoilRoot>
      <RecoilFixtures>
        <MemoryRouter>
          <Box
            css={{
              display: 'grid',
              placeItems: 'center',
              padding: '$md',
              backgroundColor: '$surface',
            }}
          >
            <DefaultPage />
          </Box>
        </MemoryRouter>
      </RecoilFixtures>
    </RecoilRoot>
  );
};

export const HasNoCircles = Template.bind({});

HasNoCircles.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/wXF7xGVv1j2SqwWfgbamS8/App-1.0?node-id=2777%3A6502',
  },
};
