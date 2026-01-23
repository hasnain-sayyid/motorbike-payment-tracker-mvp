import React from 'react';
import './App.css';
import PaymentTracker from './pages/PaymentTracker';
import { LanguageProvider } from './contexts/LanguageContext';
import { AdminProvider } from './contexts/AdminContext';
import LanguageToggle from './components/LanguageToggle';

function App() {
  return (
    <LanguageProvider>
      <AdminProvider>
        <div className="App">
          <LanguageToggle />
          <PaymentTracker />
        </div>
      </AdminProvider>
    </LanguageProvider>
  );
}

export default App;