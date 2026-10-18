/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Patient } from './types/midwifery';
import { INITIAL_PATIENTS } from './data/initialPatients';
import { Header } from './components/Header';
import { PatientList } from './components/PatientList';
import { PatientDetailModal } from './components/PatientDetailModal';
import { NewPatientModal } from './components/NewPatientModal';
import { ClinicalProtocolsView } from './components/ClinicalProtocolsView';
import { ClinicalCalculatorsView } from './components/ClinicalCalculatorsView';
import { AiConsultantView } from './components/AiConsultantView';
import { EmergencySosModal } from './components/EmergencySosModal';
import { MidwiferyModelsView } from './components/MidwiferyModelsView';
import { SbarHandoverModal } from './components/SbarHandoverModal';
import { Stethoscope, ShieldCheck, Heart, PhoneCall, Building2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'models' | 'cohort' | 'new-case' | 'protocols' | 'calculators' | 'ai-consult'>('models');
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const saved = localStorage.getItem('indonesia_midwifery_patients');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load stored patients:', e);
    }
    return INITIAL_PATIENTS;
  });

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [sbarPatient, setSbarPatient] = useState<Patient | null>(null);
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [isEmergencySosOpen, setIsEmergencySosOpen] = useState(false);

  // Sync to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem('indonesia_midwifery_patients', JSON.stringify(patients));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [patients]);

  // Handle active tab change
  const handleTabChange = (tab: 'models' | 'cohort' | 'new-case' | 'protocols' | 'calculators' | 'ai-consult') => {
    if (tab === 'new-case') {
      setIsNewPatientModalOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  // Add new patient
  const handleSaveNewPatient = (newPatient: Patient) => {
    setPatients((prev) => [newPatient, ...prev]);
    setSelectedPatient(newPatient); // Open detail right away
    setActiveTab('cohort');
  };

  // Update existing patient
  const handleUpdatePatient = (updated: Patient) => {
    setPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setSelectedPatient(updated);
  };

  const emergencyCount = patients.filter(
    (p) => p.status === 'Gawat Darurat PONED' || p.meowsScore >= 3
  ).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800 selection:bg-teal-200">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenSos={() => setIsEmergencySosOpen(true)}
        emergencyCount={emergencyCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'models' && <MidwiferyModelsView />}

        {activeTab === 'cohort' && (
          <PatientList
            patients={patients}
            onSelectPatient={(p) => setSelectedPatient(p)}
            onNewPatient={() => setIsNewPatientModalOpen(true)}
            onOpenSbar={(p) => setSbarPatient(p)}
          />
        )}

        {activeTab === 'protocols' && <ClinicalProtocolsView />}

        {activeTab === 'calculators' && <ClinicalCalculatorsView />}

        {activeTab === 'ai-consult' && <AiConsultantView patients={patients} />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-700" />
            <span className="font-semibold text-slate-700">SI-Asuhan Kebidanan Terpadu Nasional</span>
            <span aria-hidden="true">·</span>
            <span>Praktik Mandiri Bidan (BPM), Klinik Pratama, Puskesmas, & Rumah Sakit</span>
            <span aria-hidden="true">·</span>
            <span>Republik Indonesia</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <span>Standar Asuhan Kemenkes RI · IBI · POGI</span>
            <span aria-hidden="true">·</span>
            <span>SISRUTE & Komunikasi SBAR</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          isOpen={!!selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onUpdatePatient={handleUpdatePatient}
          onOpenSbar={(p) => setSbarPatient(p)}
        />
      )}

      {sbarPatient && (
        <SbarHandoverModal
          patient={sbarPatient}
          isOpen={!!sbarPatient}
          onClose={() => setSbarPatient(null)}
        />
      )}

      {isNewPatientModalOpen && (
        <NewPatientModal
          isOpen={isNewPatientModalOpen}
          onClose={() => setIsNewPatientModalOpen(false)}
          onSave={handleSaveNewPatient}
        />
      )}

      {isEmergencySosOpen && (
        <EmergencySosModal
          isOpen={isEmergencySosOpen}
          onClose={() => setIsEmergencySosOpen(false)}
        />
      )}
    </div>
  );
}
