import { lazy, Suspense } from 'react';
import { Outlet, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

// Lazy load all pages
const IndexPage = lazy(() => import('src/pages/app'));
const BlogPage = lazy(() => import('src/pages/blog'));
const UserPage = lazy(() => import('src/pages/user'));
const ProductsPage = lazy(() => import('src/pages/products'));
const Login = lazy(() => import('src/pages/login'));
const Signup = lazy(() => import('src/pages/Signup'));
const Page404 = lazy(() => import('src/pages/page-not-found'));

export default function Router() {
  const routes = useRoutes([
    {
      // Default route = Dashboard layout
      path: '/',
      element: (
        <DashboardLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true }, // Home or Dashboard
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    // Public pages (only when user clicks)
    { path: 'login', element: <Login /> },
    { path: 'signup', element: <Signup /> },
    // 404 fallback
    { path: '*', element: <Page404/> },
  ]);

  return routes;
}
