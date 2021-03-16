import { LoadingScreen } from 'components';
import { MainLayout } from 'layouts';
import React, { Fragment, Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const routes = [
  {
    exact: true,
    path: '/',
    layout: MainLayout,
    component: lazy(() => import('pages/HomePage')),
  },
  {
    exact: true,
    path: '/map',
    layout: MainLayout,
    component: lazy(() => import('pages/GraphPage')),
  },
  {
    path: '*',
    // eslint-disable-next-line
    component: () => <Redirect to="/" />,
  },
];

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<LoadingScreen />}>
    <Switch>
      {routes.map((route: any, i) => {
        const Layout = route.layout || Fragment;
        const Component = route.component;

        return (
          <Route
            exact={route.exact}
            key={i}
            path={route.path}
            render={(props) => (
              <Layout>
                {route.routes ? (
                  renderRoutes(route.routes)
                ) : (
                  <Component {...props} />
                )}
              </Layout>
            )}
          />
        );
      })}
    </Switch>
  </Suspense>
);

export default routes;
