import React from 'react';
import { Header } from './Header';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

