import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'normalize.css'
import App from './App';
import store from './store';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

let persistor = persistStore(store);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <HashRouter>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </HashRouter>
  </Provider>
);


