import React from 'react';
import { AlertTriangle, Activity, Stethoscope } from 'lucide-react';

interface HeaderProps {
  activeTab: 'models' | 'cohort' | 'new-case' | 'protocols' | 'calculators' | 'ai-consult';
  setActiveTab: (tab: 'models' | 'cohort' | 'new-case' | 'protocols' | 'calculators' | 'ai-consult') => void;
  onOpenSos: () => void;
  emergencyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSos,
  emergencyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Wordmark Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold shadow-sm">
              <Stethoscope className="w-5 h-5 text-teal-100" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap block">
                SI-ASUHAN KEBIDANAN
              </span>
              <span className="text-xs text-slate-500 block leading-none">
                Standar Nasional Asuhan Kemenkes RI · IBI · POGI
              </span>
            </div>
          </div>

          {/* Zone 2: 5 clean single-line nav links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('models')}
              className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'models'
                  ? 'bg-teal-50 text-teal-800 font-semibold border border-teal-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Model Asuhan
            </button>
            <button
              onClick={() => setActiveTab('cohort')}
              className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'cohort'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Kohort & Triase
            </button>
            <button
              onClick={() => setActiveTab('new-case')}
              className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'new-case'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              + Input Kasus Baru
            </button>
            <button
              onClick={() => setActiveTab('protocols')}
              className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'protocols'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Protokol Klinis
            </button>
            <button
              onClick={() => setActiveTab('calculators')}
              className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'calculators'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Kalkulator Medis
            </button>
            <button
              onClick={() => setActiveTab('ai-consult')}
              className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'ai-consult'
                  ? 'bg-teal-50 text-teal-800 font-semibold border border-teal-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              Konsultan AI
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenSos}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
            >
              <AlertTriangle className="w-4 h-4 text-white" />
              <span>Gawat Darurat SOS</span>
              {emergencyCount > 0 && (
                <span className="bg-rose-900 text-rose-100 px-1.5 py-0.5 rounded text-[11px] font-mono tabular-nums">
                  {emergencyCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex overflow-x-auto border-t border-slate-100 px-2 py-1.5 gap-1 bg-slate-50">
        <button
          onClick={() => setActiveTab('models')}
          className={`px-2.5 py-1 text-xs rounded whitespace-nowrap ${activeTab === 'models' ? 'bg-white shadow-xs font-semibold text-teal-800' : 'text-slate-600'}`}
        >
          Model Asuhan
        </button>
        <button
          onClick={() => setActiveTab('cohort')}
          className={`px-2.5 py-1 text-xs rounded whitespace-nowrap ${activeTab === 'cohort' ? 'bg-white shadow-xs font-semibold text-slate-900' : 'text-slate-600'}`}
        >
          Kohort Pasien
        </button>
        <button
          onClick={() => setActiveTab('new-case')}
          className={`px-2.5 py-1 text-xs rounded whitespace-nowrap ${activeTab === 'new-case' ? 'bg-white shadow-xs font-semibold text-slate-900' : 'text-slate-600'}`}
        >
          + Kasus Baru
        </button>
        <button
          onClick={() => setActiveTab('protocols')}
          className={`px-2.5 py-1 text-xs rounded whitespace-nowrap ${activeTab === 'protocols' ? 'bg-white shadow-xs font-semibold text-slate-900' : 'text-slate-600'}`}
        >
          Protokol Klinis
        </button>
        <button
          onClick={() => setActiveTab('calculators')}
          className={`px-2.5 py-1 text-xs rounded whitespace-nowrap ${activeTab === 'calculators' ? 'bg-white shadow-xs font-semibold text-slate-900' : 'text-slate-600'}`}
        >
          Kalkulator
        </button>
        <button
          onClick={() => setActiveTab('ai-consult')}
          className={`px-2.5 py-1 text-xs rounded whitespace-nowrap ${activeTab === 'ai-consult' ? 'bg-white shadow-xs font-semibold text-teal-800' : 'text-slate-600'}`}
        >
          Konsultan AI
        </button>
      </div>
    </header>
  );
};
