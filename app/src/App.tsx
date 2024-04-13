import React, { Suspense } from 'react';
import routes from './router';
import { useRoutes } from 'react-router-dom';
import AppHeader from './components/app-header';
import Auth from './utils/auth';
import 'normalize.css'

function App() {
  return (
    <Auth>
      <>
        <AppHeader />
        <Suspense fallback='稍等一下......'>
          <>{useRoutes(routes)}</>
        </Suspense>
      </>
    </Auth>
  );
}

export default App;
