import { LoadingScreen } from 'components';
import { useConnectedWeb3Context, useUserInfo } from 'contexts';
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
    path: '/circle',
    layout: MainLayout,
    component: lazy(() => import('pages/CircleSelectPage')),
  },
  {
    exact: true,
    path: '/:protocol/:circle',
    layout: MainLayout,
    component: lazy(() => import('pages/HomePage')),
  },
  {
    exact: true,
    path: '/:protocol/:circle/profile',
    layout: MainLayout,
    component: lazy(() => import('pages/ProfilePage')),
  },
  {
    exact: true,
    path: '/:protocol/:circle/team',
    layout: MainLayout,
    component: lazy(() => import('pages/TeamPage')),
  },
  {
    exact: true,
    path: '/:protocol/:circle/allocation',
    layout: MainLayout,
    component: lazy(() => import('pages/AllocationPage')),
  },
  {
    exact: true,
    path: '/:protocol/:circle/map',
    layout: MainLayout,
    component: lazy(() => import('pages/GraphPage')),
  },
  {
    exact: true,
    path: '/:protocol/:circle/history',
    layout: MainLayout,
    component: lazy(() => import('pages/HistoryPage')),
  },
];

export const RenderRoutes = () => {
  const { account } = useConnectedWeb3Context();
  const { circle, me } = useUserInfo();

  const renderRoutes = (routes = []) => {
    const isSignedIn = circle ? me !== null : account !== null;
    const initialPath = circle
      ? me
        ? me.epoch_first_visit
          ? `/${circle.protocol.name}/${circle.name}/profile`
          : (me.teammates || []).length === 0
          ? `/${circle.protocol.name}/${circle.name}/team`
          : `/${circle.protocol.name}/${circle.name}/allocation`
        : `/${circle.protocol.name}/${circle.name}`
      : account
      ? '/circle'
      : '/';

    return (
      <Suspense fallback={<LoadingScreen />}>
        <Switch>
          {routes.map((route: any, i) => {
            const Layout = route.layout || Fragment;
            const Component = route.component;
            const isHome = circle
              ? route.path === '/:protocol/:circle'
              : route.path === '/';

            return (
              <Route
                exact={route.exact}
                key={i}
                path={route.path}
                render={(props) =>
                  isSignedIn !== isHome ? (
                    <Layout>
                      {route.routes ? (
                        renderRoutes(route.routes)
                      ) : (
                        <Component {...props} />
                      )}
                    </Layout>
                  ) : (
                    <Redirect
                      to={{
                        pathname: initialPath,
                        state: { from: props.location },
                      }}
                    />
                  )
                }
              />
            );
          })}
          <Redirect to={{ pathname: initialPath }} />
        </Switch>
      </Suspense>
    );
  };

  return <>{renderRoutes(routes as any)}</>;
};

export default RenderRoutes;
