import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
<<<<<<< HEAD
=======
import { GoogleOAuthProvider } from '@react-oauth/google';
>>>>>>> 906622b (googleauth addition)

import App from './app';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
<<<<<<< HEAD
    <BrowserRouter>
      <Suspense>
        <App />
      </Suspense>
=======

    <BrowserRouter>
      <GoogleOAuthProvider clientId = "417095378156-2056gof1b4gvdhf09s0a377b9nblueq1.apps.googleusercontent.com">
        <Suspense>
          <App />
        </Suspense>
      </GoogleOAuthProvider>
      
>>>>>>> 906622b (googleauth addition)
    </BrowserRouter>
  </HelmetProvider>
);
