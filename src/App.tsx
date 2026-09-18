import React, { useState } from 'react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MetricsDashboard } from './components/MetricsDashboard';
import { TerminalConsole } from './components/TerminalConsole';
import { GenerationsTable } from './components/GenerationsTable';
import { ArchitectureView } from './components/ArchitectureView';
import { OOMModal } from './components/OOMModal';
import { MilestoneCelebrationModal } from './components/MilestoneCelebrationModal';

const DashboardContent: React.FC = () => {
  const { activeTab } = useSimulation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100 overflow-hidden">
      {/* Desktop & Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <Sidebar />
      </div>

      {/* Backdrop for mobile */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'metrics' && <MetricsDashboard />}
          {activeTab === 'terminal' && <TerminalConsole />}
          {activeTab === 'history' && <GenerationsTable />}
          {activeTab === 'architecture' && <ArchitectureView />}
        </main>
      </div>

      {/* OOM Final State Extraction Dialog */}
      <OOMModal />

      {/* Goal Milestone Celebration & Audit Modal */}
      <MilestoneCelebrationModal />
    </div>
  );
};

export default function App() {
  return (
    <SimulationProvider>
      <DashboardContent />
    </SimulationProvider>
  );
}
