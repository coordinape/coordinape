import { LoadingScreen } from 'components';
import { useUserInfo } from 'contexts';
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
];

export const RenderRoutes = () => {
  const { me } = useUserInfo();

  const renderRoutes = (routes = []) => {
    const isSignedIn = me !== null;
    const initialPath = !me?.bio
      ? '/profile'
      : (me?.teammates || []).length === 0
      ? '/team'
      : '/allocation';

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
                        pathname: isSignedIn ? initialPath : '/',
                        state: { from: props.location },
                      }}
                    />
                  )
                }
              />
            );
          })}
          <Redirect to={{ pathname: isSignedIn ? initialPath : '/' }} />
        </Switch>
      </Suspense>
    );
  };

  return <>{renderRoutes(routes as any)}</>;
};

export default RenderRoutes;
