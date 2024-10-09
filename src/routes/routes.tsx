import { Routes } from 'react-router-dom';

import { useIsGiftCircleSite } from '../hooks';

import { coLinksRoutes } from './coLinksRoutes';
import { coSoulRoutes } from './coSoulRoutes';
import { giveRoutes } from './giveRoutes';
import { useRecordPageView } from './hooks';

export const AppRoutes = () => {
  useRecordPageView();
  const isGiftCircle = useIsGiftCircleSite();

  const routes = [
    ...(isGiftCircle ? [...coSoulRoutes, ...giveRoutes] : coLinksRoutes),
  ];
  return <Routes>{routes}</Routes>;
};
