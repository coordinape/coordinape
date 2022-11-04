import { ComponentStory, ComponentMeta } from '@storybook/react';
import faker from 'faker';

import { Table as TableComponent } from './Table';

export default {
  component: TableComponent,
} as ComponentMeta<typeof TableComponent>;

type User = {
  userId: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
};

const generateUser = (): User => ({
  userId: faker.datatype.uuid(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  jobTitle: faker.name.jobTitle(),
});

const headers: string[] = ['userId', 'firstName', 'lastName', 'jobTitle'];

const data = Array.from({ length: 8 }).map(generateUser);

const Template: ComponentStory<typeof TableComponent> = args => (
  <TableComponent {...args}>
    <thead>
      <tr>
        {headers.map(header => (
          <th key={header}>{header}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map(({ userId, firstName, lastName, jobTitle }) => (
        <tr key={userId}>
          <td>{userId}</td>
          <td>{firstName}</td>
          <td>{lastName}</td>
          <td>{jobTitle}</td>
        </tr>
      ))}
    </tbody>
  </TableComponent>
);

export const Table = Template.bind({});
