import { makeStyles } from '@material-ui/core';
import React from 'react';

import { ContentSection, HeaderSection } from './components';

const useStyles = makeStyles((theme) => ({}));

interface IProps {
  className?: string;
}

const HomePage = (props: IProps) => {
  return (
    <div>
      <HeaderSection />
      <ContentSection />
    </div>
  );
};

export default HomePage;
