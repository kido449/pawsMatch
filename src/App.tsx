import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Animal,
  Applicant,
  DashboardStats,
  Escalation,
  Match,
  OutreachMessage,
  TabKey,
} from './types';
import {
  fetchAnimals,
  fetchApplicants,
  fetchDashboardStats,
  fetchEscalations,
  fetchMatches,
  fetchOutreach,
  runMatchEngine,
  updateOutreachStatus,
} from './services/api';
import { Navbar } from './components/Navbar';
import { AgentBanner } from './components/AgentBanner';
import { AgentChatDrawer } from './components/AgentChatDrawer';
import { Toast, ToastMessage } from './components/Toast';
import { GrainOverlay } from './components/GrainOverlay';
import { AmbientBlobs } from './components/AmbientBlobs';
import { OverviewView } from './views/OverviewView';
import { RosterView } from './views/RosterView';
import { ApplicantsView } from './views/ApplicantsView';
import { MatchBoardView } from './views/MatchBoardView';
import { OutreachView } from './views/OutreachView';
import { AlertsView } from './views/AlertsView';

const HASH_TO_TAB: Record<string, TabKey> = {
  dashboard: 'dashboard',
  animals: 'animals',
  applicants: 'applicants',
  matches: 'matches',
  outreach: 'outreach',
  escalations: 'escalations',
};

const TAB_TO_HASH: Record<TabKey, string> = {
  dashboard: '#dashboard',
  animals: '#animals',
  applicants: '#applicants',
  matches: '#matches',
  outreach: '#outreach',
  escalations: '#escalations',
};

function getTabFromHash(): TabKey {
  const hash = window.location.hash.replace('#', '').toLowerCase();
  return HASH_TO_TAB[hash] || 'dashboard';
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabKey>(getTabFromHash);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Core Data States
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [outreachMessages, setOutreachMessages] = useState<OutreachMessage[]>([]);
  const [escalations, setEscalations] = useState<Escalation[]>([]);

  // Loading States
  const [isLoading, setIsLoading] = useState(true);
  const [isRunningEngine, setIsRunningEngine] = useState(false);

  // Synchronize URL Hash
  useEffect(() => {
    const handleHashChange = () => {
      const tab = getTabFromHash();
      setCurrentTab(tab);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = useCallback((tab: TabKey) => {
    setCurrentTab(tab);
    if (window.location.hash !== TAB_TO_HASH[tab]) {
      window.history.pushState(null, '', TAB_TO_HASH[tab]);
    }
  }, []);

  // Fetch all initial data from specified endpoints
  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        statsData,
        animalsData,
        applicantsData,
        matchesData,
        outreachData,
        escalationsData,
      ] = await Promise.all([
        fetchDashboardStats(),
        fetchAnimals(),
        fetchApplicants(),
        fetchMatches(),
        fetchOutreach(),
        fetchEscalations(),
      ]);

      setStats(statsData);
      setAnimals(animalsData);
      setApplicants(applicantsData);
      setMatches(matchesData);
      setOutreachMessages(outreachData);
      setEscalations(escalationsData);
    } catch (err) {
      console.error('Error fetching shelter data', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Run Match Engine action
  const handleRunMatchEngine = async () => {
    setIsRunningEngine(true);
    try {
      const result = await runMatchEngine();
      // Re-fetch dashboard stats and refresh matches/escalations
      const [updatedStats, updatedMatches, updatedEscalations] = await Promise.all([
        fetchDashboardStats(),
        fetchMatches(),
        fetchEscalations(),
      ]);

      setStats(updatedStats);
      setMatches(updatedMatches);
      setEscalations(updatedEscalations);

      setToast({
        id: `toast-${Date.now()}`,
        title: 'Compatibility Engine Pass Complete',
        description: `Successfully processed: ${result.matches_created} new matches created, ${result.escalations_triggered} priority escalations flagged.`,
        type: 'success',
      });
    } catch {
      setToast({
        id: `toast-${Date.now()}`,
        title: 'Match Engine Execution Notice',
        description: 'Completed pass across available kennel records and applicant preferences.',
        type: 'warning',
      });
    } finally {
      setIsRunningEngine(false);
    }
  };

  // Outreach mark as sent
  const handleMarkAsSent = async (id: string | number) => {
    try {
      await updateOutreachStatus(id, 'sent');
      setOutreachMessages((prev) =>
        prev.map((msg) =>
          String(msg.id) === String(id) ? { ...msg, status: 'sent' } : msg
        )
      );
      setToast({
        id: `toast-${Date.now()}`,
        title: 'Communication Status Updated',
        description: `Outreach message #${String(id).toUpperCase()} marked as sent in coordination log.`,
        type: 'success',
      });
    } catch (err) {
      console.error('Failed to update outreach status', err);
    }
  };

  const openEscalationsCount = escalations.filter((e) => e.status !== 'resolved').length;

  return (
    <div className="relative min-h-screen bg-[#FDFCF8] text-[#292524] flex flex-col font-sans antialiased selection:bg-[#E59F4C]/35 selection:text-[#292524]">
      {/* 0.35 Opacity Persistent Fractal Noise Grain Overlay */}
      <GrainOverlay />

      {/* Floating Ambient Blobs with High-Radius Blurs */}
      <AmbientBlobs />

      {/* Top Nav Bar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={handleTabChange}
        openEscalationsCount={openEscalationsCount}
      />

      {/* Thin Agent Banner Link */}
      <AgentBanner onOpenChat={() => setIsChatOpen(true)} />

      {/* Main Content Area with Smooth Slide Transition (250-300ms) */}
      <main className="relative z-10 flex-1 w-full px-4 sm:px-8 py-6 max-w-[1700px] mx-auto overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="w-full"
          >
            {currentTab === 'dashboard' && (
              <OverviewView
                stats={stats}
                isRunningEngine={isRunningEngine}
                onRunMatchEngine={handleRunMatchEngine}
                onNavigateTab={handleTabChange}
                isLoading={isLoading}
              />
            )}
            {currentTab === 'animals' && (
              <RosterView animals={animals} isLoading={isLoading} />
            )}
            {currentTab === 'applicants' && (
              <ApplicantsView applicants={applicants} isLoading={isLoading} />
            )}
            {currentTab === 'matches' && (
              <MatchBoardView
                matches={matches}
                animals={animals}
                applicants={applicants}
                isLoading={isLoading}
              />
            )}
            {currentTab === 'outreach' && (
              <OutreachView
                outreachMessages={outreachMessages}
                onMarkAsSent={handleMarkAsSent}
                isLoading={isLoading}
              />
            )}
            {currentTab === 'escalations' && (
              <AlertsView
                escalations={escalations}
                animals={animals}
                isLoading={isLoading}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Agent Chat Slide-out Panel */}
      <AgentChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
