import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';

// Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css';
// toastify
import 'react-toastify/dist/ReactToastify.css';
// Tailwind CSS
import './tailwind.css';

// i18n
import './i18n';

// Redux
import { Provider } from 'react-redux';
import store from './store/index';

// Context Providers
import AppState from './useContext/AppState';
import { SettingsProvider } from './useContext/useSettings';

// UI
import { Toaster } from 'sonner';
import NavigationRoutes from './router/index';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './store/index';

import { VaultProvider } from './useContext/VaultContext'; // import the provider

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Suspense>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppState>
            <SettingsProvider>
              <VaultProvider> {/* ✅ Add VaultProvider here */}
                <BrowserRouter>
                  <NavigationRoutes />
                </BrowserRouter>
                <Toaster position="bottom-left" duration={2500} richColors />
              </VaultProvider>
            </SettingsProvider>
          </AppState>
        </PersistGate>
      </Provider>
    </Suspense>
  </React.StrictMode>
);
