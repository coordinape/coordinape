import { Routes } from 'react-router-dom';

import { useIsCoLinksSite } from '../features/colinks/useIsCoLinksSite';

import { coLinksRoutes } from './coLinksRoutes';
import { coSoulRoutes } from './coSoulRoutes';
import { giveRoutes } from './giveRoutes';
import { useRecordPageView } from './hooks';

export const AppRoutes = () => {
  useRecordPageView();
  const isCoLinksSite = useIsCoLinksSite();

  const routes = [
    ...(isCoLinksSite ? coLinksRoutes : [...coSoulRoutes, ...giveRoutes]),
  ];
  return <Routes>{routes}</Routes>;
};
