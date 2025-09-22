import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RegisterPage from './pages/register.jsx';
import UserPage from './pages/user.jsx';
import HomePage from './pages/home.jsx';
import LoginPage from './pages/login.jsx';

import ProductsPage from './pages/products.jsx';
import ProductForm from './pages/product-form.jsx';
import ProductDetail from './pages/product-detail.jsx';
import FavoriteTab from './pages/FavoriteTab.jsx';

import { AuthWrapper } from './components/context/auth.wrapper.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'user',
        element: (
          <AuthWrapper>
            <UserPage />
          </AuthWrapper>
        ),
      },
      {
        path: 'products',
        element: <ProductsPage />,
      },
      {
        path: 'products/create',
        element: (
          <AuthWrapper>
            <ProductForm />
          </AuthWrapper>
        ),
      },
      {
        path: 'products/edit/:id',
        element: (
          <AuthWrapper>
            <ProductForm />
          </AuthWrapper>
        ),
      },
      {
        path: 'products/:id',
        element: <ProductDetail />,
      },
      
      {
        path: 'favorites',
        element: <FavoriteTab />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </React.StrictMode>
);
