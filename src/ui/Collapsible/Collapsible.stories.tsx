import { useState } from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Link } from 'ui';

import {
  Collapsible as CollapsibleComponent,
  CollapsibleContent,
  CollapsibleTrigger,
} from './Collapsible';

export default {
  component: CollapsibleComponent,
} as ComponentMeta<typeof CollapsibleComponent>;

const Template: ComponentStory<typeof CollapsibleComponent> = () => {
  const [open, setOpen] = useState(false);

  return (
    <CollapsibleComponent open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Link>{open ? 'Close' : 'Open'}</Link>
      </CollapsibleTrigger>
      <CollapsibleContent>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet
        sit amet leo id rhoncus. Vestibulum auctor risus cursus, commodo velit
        in, lacinia tellus. Aenean feugiat id massa ut maximus. Proin non turpis
        velit. Sed eget felis nec urna bibendum egestas pellentesque vitae
        magna.
      </CollapsibleContent>
    </CollapsibleComponent>
  );
};

export const Collapsible = Template.bind({});
