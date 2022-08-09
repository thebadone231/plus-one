import React from 'react';
import { Navigation } from './services/index';
import { AuthenticationContextProvider } from './services/Firebase';

export default function App() {
  return (
    <>
      <AuthenticationContextProvider>
        <Navigation />
      </AuthenticationContextProvider>
    </>
  );
}
