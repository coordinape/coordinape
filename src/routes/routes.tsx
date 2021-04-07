import { LoadingScreen } from 'components';
import { useConnectedWeb3Context, useUserInfo } from 'contexts';
import { MainLayout } from 'layouts';
import React, { Fragment, Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { isSubdomainAddress } from 'utils/domain';

const maindomainRoutes = [
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
];

const subdomainRoutes = [
  {
    exact: true,
    path: '/',
    layout: MainLayout,
    component: lazy(() => import('pages/HomePage')),
  },
  {
    exact: true,
    path: '/profile',
    layout: MainLayout,
    component: lazy(() => import('pages/ProfilePage')),
  },
  {
    exact: true,
    path: '/team',
    layout: MainLayout,
    component: lazy(() => import('pages/TeamPage')),
  },
  {
    exact: true,
    path: '/allocation',
    layout: MainLayout,
    component: lazy(() => import('pages/AllocationPage')),
  },
  {
    exact: true,
    path: '/map',
    layout: MainLayout,
    component: lazy(() => import('pages/GraphPage')),
  },
  {
    exact: true,
    path: '/history',
    layout: MainLayout,
    component: lazy(() => import('pages/HistoryPage')),
  },
];

export const RenderRoutes = () => {
  const { account } = useConnectedWeb3Context();
  const { me } = useUserInfo();

  const renderRoutes = (routes = []) => {
    const isCircled = isSubdomainAddress();
    const isSignedIn = isCircled ? me !== null : account !== null;
    const initialPath = isCircled
      ? me
        ? me.epoch_first_visit
          ? '/profile'
          : (me.teammates || []).length === 0
          ? '/team'
          : '/allocation'
        : '/'
      : account
      ? '/circle'
      : '/';

    return (
      <Suspense fallback={<LoadingScreen />}>
        <Switch>
          {routes.map((route: any, i) => {
            const Layout = route.layout || Fragment;
            const Component = route.component;
            const isHome = route.path === '/';

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

  return (
    <>
      {renderRoutes(
        (isSubdomainAddress() ? subdomainRoutes : maindomainRoutes) as any
      )}
    </>
  );
};

export default RenderRoutes;
