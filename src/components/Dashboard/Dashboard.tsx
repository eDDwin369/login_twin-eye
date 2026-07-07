import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { HeroSection } from './HeroSection';
import { QuickActions } from './QuickActions';
import { GettingStarted } from './GettingStarted';
import { MainContent } from './MainContent';
import { AccountSettings } from '../AccountSettings/AccountSettings';
import './Dashboard.css';

interface DashboardProps {
  onLogout?: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [currentView, setCurrentView] = useState('overview');

  return (
    <div className="dashboard-wrapper dashboard-fade-in">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="dashboard-main">
        <Header onLogout={onLogout} />
        <div className="dashboard-content-scrollable">
          <div className="dashboard-container">
            {currentView === 'overview' ? (
              <>
                <HeroSection />
                <QuickActions />
                <GettingStarted />
                <MainContent />
              </>
            ) : (
              <AccountSettings setCurrentView={setCurrentView} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
