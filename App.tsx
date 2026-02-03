
import React, { useState } from 'react';
import { View } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Maintenance from './pages/Maintenance';
import CarWash from './pages/CarWash';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);

  const renderView = () => {
    switch (currentView) {
      case View.Dashboard:
        return <Dashboard />;
      case View.Maintenance:
        return <Maintenance />;
      case View.CarWash:
        return <CarWash />;
      case View.Settings:
        return <div className="p-12 text-center text-text-secondary">Settings page coming soon...</div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background-dark overflow-hidden">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      <main className="flex-1 overflow-y-auto h-screen relative scroll-smooth">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
