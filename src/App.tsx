import { createBrowserRouter } from 'react-router';

import Home from './pages/Home';
import Produto from './pages/Produto';
import Sacola from './pages/Sacola';
import NotFound from './pages/NotFound';
import Layout from './Layout';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/produto/:id',
        element: <Produto />
      },
      {
        path: '/sacola',
        element: <Sacola />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
])

export { router };