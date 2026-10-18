import React, { useState } from 'react';
import { Patient, RiskLevel } from '../types/midwifery';
import { calculateMAP, evaluateMEOWS } from '../utils/clinicalCalculators';
import { Search, AlertTriangle, UserCheck, ShieldAlert, Heart, FileText, ChevronRight, Activity, Plus } from 'lucide-react';

interface PatientListProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onNewPatient: () => void;
  onOpenSbar?: (patient: Patient) => void;
}

export const PatientList: React.FC<PatientListProps> = ({
  patients,
  onSelectPatient,
  onNewPatient,
  onOpenSbar,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'emergency' | 'vulnerable' | 'referred' | 'anemia-kek'>('all');

  // Filter patients
  const filteredPatients = patients.filter((patient) => {
    // Search
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.medicalRecordNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.nik.includes(searchQuery) ||
      patient.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterCategory === 'emergency') {
      return patient.status === 'Gawat Darurat PONED' || patient.meowsScore >= 3;
    }
    if (filterCategory === 'vulnerable') {
      return (
        patient.vulnerabilities.isTeenagePregnancy ||
        patient.vulnerabilities.isDomesticViolenceVictim ||
        patient.vulnerabilities.isTripleEliminationPositive ||
        patient.vulnerabilities.isExtremePovertyOrPrasejahtera
      );
    }
    if (filterCategory === 'referred') {
      return patient.status === 'Dirujuk ke RS PONEK';
    }
    if (filterCategory === 'anemia-kek') {
      return (
        patient.complexCategories.isSevereAnemiaOrKEK ||
        (patient.labs.hemoglobin && patient.labs.hemoglobin < 10) ||
        patient.armCircumference < 23.5
      );
    }

    return true;
  });

  // Calculate stats
  const totalCount = patients.length;
  const emergencyCount = patients.filter(
    (p) => p.status === 'Gawat Darurat PONED' || p.meowsScore >= 3
  ).length;
  const vulnerableCount = patients.filter(
    (p) =>
      p.vulnerabilities.isTeenagePregnancy ||
      p.vulnerabilities.isDomesticViolenceVictim ||
      p.vulnerabilities.isTripleEliminationPositive ||
      p.vulnerabilities.isExtremePovertyOrPrasejahtera
  ).length;
  const referredCount = patients.filter((p) => p.status === 'Dirujuk ke RS PONEK').length;

  return (
    <div className="space-y-6">
      {/* Clinic Context Banner */}
      <div className="p-4 bg-teal-900 text-white rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-teal-300 font-semibold block">
            Sistem Informasi Asuhan Kebidanan Nasional · Fasyankes & Praktik Bidan
          </span>
          <h1 className="text-xl font-bold tracking-tight text-white mt-0.5">
            Kohort Asuhan Kasus Kompleks Kebidanan & Kelompok Rentan
          </h1>
          <p className="text-xs text-teal-100 mt-1 max-w-3xl">
            Sistem pemantauan klinis terintegrasi standar Pelayanan Obstetri Neonatal Emergensi Dasar (PONED),
            skrining risiko dini MEOWS, dan perlindungan kesehatan maternal bagi kelompok rentan.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <button
            onClick={onNewPatient}
            className="flex items-center gap-2 px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            + Registrasi Kasus Baru
          </button>
        </div>
      </div>

      {/* Metric Strip (Clean Unboxed & Tabular) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-lg">
          <span className="text-xs text-slate-500 block">Total Pasien Terdaftar</span>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1">
            {totalCount}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Pasien aktif dalam kohort KIA</span>
        </div>

        <div className="p-4 bg-white border border-rose-200 rounded-lg">
          <span className="text-xs text-rose-700 font-medium block">Gawat Darurat PONED</span>
          <div className="text-2xl font-bold font-mono text-rose-700 tabular-nums mt-1">
            {emergencyCount}
          </div>
          <span className="text-xs text-rose-600 mt-1 block">Perlu tindakan stabilisasi cito</span>
        </div>

        <div className="p-4 bg-white border border-amber-200 rounded-lg">
          <span className="text-xs text-amber-800 font-medium block">Kelompok Rentan</span>
          <div className="text-2xl font-bold font-mono text-amber-800 tabular-nums mt-1">
            {vulnerableCount}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Remaja, Triple Eliminasi, KDRT, KEK</span>
        </div>

        <div className="p-4 bg-white border border-blue-200 rounded-lg">
          <span className="text-xs text-blue-700 font-medium block">Rujukan PONEK RS</span>
          <div className="text-2xl font-bold font-mono text-blue-700 tabular-nums mt-1">
            {referredCount}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Protokol BAKSOKUDA / SISRUTE</span>
        </div>
      </div>

      {/* Control Bar: Search and Filter Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pasien (Nama, NIK, No. Rekam Medis, Kelurahan)..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700 bg-white"
          />
        </div>

        {/* Filter Tabs (Interactive Segmented Control) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              filterCategory === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({totalCount})
          </button>
          <button
            onClick={() => setFilterCategory('emergency')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              filterCategory === 'emergency'
                ? 'bg-white text-rose-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Gawat Darurat ({emergencyCount})
          </button>
          <button
            onClick={() => setFilterCategory('vulnerable')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              filterCategory === 'vulnerable'
                ? 'bg-white text-amber-800 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kelompok Rentan ({vulnerableCount})
          </button>
          <button
            onClick={() => setFilterCategory('anemia-kek')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              filterCategory === 'anemia-kek'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Anemia & KEK
          </button>
          <button
            onClick={() => setFilterCategory('referred')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              filterCategory === 'referred'
                ? 'bg-white text-blue-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rujukan RS ({referredCount})
          </button>
        </div>
      </div>

      {/* Patient Cards / Table List */}
      {filteredPatients.length === 0 ? (
        <div className="p-8 text-center bg-white border border-slate-200 rounded-lg">
          <p className="text-sm text-slate-600">Tidak ada pasien yang sesuai dengan pencarian atau filter.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterCategory('all');
            }}
            className="mt-3 text-xs font-semibold text-teal-700 hover:underline"
          >
            Reset filter pencarian
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPatients.map((patient) => {
            const mapValue = calculateMAP(patient.vitals.systolic, patient.vitals.diastolic);
            const meows = evaluateMEOWS(patient.vitals);

            return (
              <div
                key={patient.id}
                onClick={() => onSelectPatient(patient)}
                className="p-4 bg-white border border-slate-200 hover:border-teal-600 rounded-lg transition-all cursor-pointer shadow-xs hover:shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left Column: Patient Bio & Clinical Flags */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="text-base font-bold text-slate-900 hover:text-teal-700 transition-colors">
                        {patient.name}
                      </h3>
                      {/* Zero-Pill Metadata Discipline: Clean unboxed text with dots */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                        <span>{patient.medicalRecordNo}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{patient.age} tahun</span>
                        <span aria-hidden="true">·</span>
                        <span>
                          G{patient.gravida}P{patient.para}A{patient.abortus}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">UK {patient.gestationalAgeWeeks} mgg</span>
                      </div>
                    </div>

                    {/* Chief Complaint / Triage Highlights */}
                    <p className="text-xs text-slate-700 line-clamp-2">
                      <strong className="text-slate-900 font-semibold">Keluhan: </strong>
                      {patient.chiefComplaint}
                    </p>

                    {/* Unboxed Metadata Indicators (No static pill sandwich) */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 pt-1">
                      {patient.complexCategories.isPreeclampsiaOrEclampsia && (
                        <span className="text-rose-700 font-semibold">
                          PEB / Hipertensi Gestasional
                        </span>
                      )}
                      {patient.complexCategories.isPostpartumHemorrhage && (
                        <span className="text-rose-700 font-semibold">
                          HPP / Atonia Uteri
                        </span>
                      )}
                      {patient.complexCategories.isSevereAnemiaOrKEK && (
                        <span className="text-amber-700 font-medium">
                          KEK / Anemia (LILA {patient.armCircumference} cm)
                        </span>
                      )}
                      {patient.vulnerabilities.isTeenagePregnancy && (
                        <span className="text-indigo-700 font-medium">
                          Kehamilan Remaja (Usia {patient.age} th)
                        </span>
                      )}
                      {patient.vulnerabilities.isTripleEliminationPositive && (
                        <span className="text-purple-700 font-medium">
                          Triple Eliminasi (HBsAg Reaktif)
                        </span>
                      )}
                      {patient.vulnerabilities.isDomesticViolenceVictim && (
                        <span className="text-rose-800 font-medium">
                          Korban KDRT / Perlindungan Khusus
                        </span>
                      )}
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500">{patient.neighborhood}</span>
                    </div>
                  </div>

                  {/* Right Column: Vitals, MEOWS & Action */}
                  <div className="shrink-0 flex items-center md:flex-col md:items-end justify-between gap-3 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
                    {/* Vitals Summary */}
                    <div className="text-left md:text-right space-y-0.5">
                      <div className="flex items-center md:justify-end gap-2 text-xs font-mono tabular-nums text-slate-800">
                        <span>TD: {patient.vitals.systolic}/{patient.vitals.diastolic}</span>
                        <span className="text-slate-400">·</span>
                        <span>MAP: {mapValue}</span>
                        <span className="text-slate-400">·</span>
                        <span>N: {patient.vitals.pulse}</span>
                      </div>

                      {/* Status and MEOWS */}
                      <div className="flex items-center md:justify-end gap-2 text-xs">
                        <span
                          className={`font-semibold ${
                            patient.status === 'Gawat Darurat PONED'
                              ? 'text-rose-700'
                              : patient.status === 'Dirujuk ke RS PONEK'
                              ? 'text-blue-700'
                              : 'text-teal-800'
                          }`}
                        >
                          {patient.status}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="font-mono text-slate-500 tabular-nums">
                          MEOWS: {meows.totalScore} ({meows.alertLevel})
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      {onOpenSbar && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenSbar(patient);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded transition-colors whitespace-nowrap border border-slate-200"
                        >
                          <FileText className="w-3.5 h-3.5 text-teal-700" />
                          <span>SBAR Handover</span>
                        </button>
                      )}
                      <div className="flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-900">
                        <span>Buka Asuhan</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
