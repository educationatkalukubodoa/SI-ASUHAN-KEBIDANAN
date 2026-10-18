import React, { useState } from 'react';
import { Patient, CaseStatus } from '../types/midwifery';
import { calculateHPL, calculateGestationalAge, calculateMAP, evaluateMEOWS, calculatePoedjiRochjati } from '../utils/clinicalCalculators';
import { X, Save, AlertCircle } from 'lucide-react';

interface NewPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: Patient) => void;
}

export const NewPatientModal: React.FC<NewPatientModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    medicalRecordNo: `RM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    nik: '',
    age: 24,
    husbandName: '',
    address: '',
    neighborhood: 'Wilayah Binaan Fasyankes',
    phone: '',
    gravida: 1,
    para: 0,
    abortus: 0,
    livingChildren: 0,
    hpht: '',
    hpl: '',
    gestationalAgeWeeks: 0,
    armCircumference: 24.0,
    weight: 52,
    height: 155,
    chiefComplaint: '',
    // Vitals
    systolic: 120,
    diastolic: 80,
    pulse: 80,
    respiratoryRate: 18,
    temperature: 36.5,
    consciousness: 'Compos Mentis' as const,
    fetalHeartRate: 140,
    fundalHeight: 26,
    // Labs
    hemoglobin: 11.5,
    proteinuria: 'Negatif' as const,
    bloodGlucose: 95,
    bloodGroup: 'O+' as const,
    hivStatus: 'Non-reaktif' as 'Non-reaktif' | 'Reaktif' | 'Belum Diperiksa',
    syphilisStatus: 'Non-reaktif' as 'Non-reaktif' | 'Reaktif' | 'Belum Diperiksa',
    hbsagStatus: 'Non-reaktif' as 'Non-reaktif' | 'Reaktif' | 'Belum Diperiksa',
    // Complex Categories
    isPreeclampsiaOrEclampsia: false,
    isPostpartumHemorrhage: false,
    isAntepartumHemorrhage: false,
    isSevereAnemiaOrKEK: false,
    isPrematureRuptureOfMembranes: false,
    isDystociaOrObstructedLabor: false,
    isMaternalInfectionOrSepsis: false,
    hasMedicalComorbidities: false,
    otherComplications: '',
    // Vulnerabilities
    isTeenagePregnancy: false,
    isAdvancedMaternalAge: false,
    isTripleEliminationPositive: false,
    isDomesticViolenceVictim: false,
    isExtremePovertyOrPrasejahtera: false,
    hasDisability: false,
    isUnintendedPregnancy: false,
    hasBadObstetricHistory: false,
    status: 'Dalam Pemantauan' as CaseStatus,
  });

  if (!isOpen) return null;

  // Auto-update HPL and gestational age when HPHT changes
  const handleHphtChange = (hphtDate: string) => {
    const computedHpl = calculateHPL(hphtDate);
    const computedAge = calculateGestationalAge(hphtDate);
    setFormData((prev) => ({
      ...prev,
      hpht: hphtDate,
      hpl: computedHpl,
      gestationalAgeWeeks: computedAge.weeks,
    }));
  };

  // Auto-flag vulnerability if age < 20 or >= 35
  const handleAgeChange = (ageVal: number) => {
    setFormData((prev) => ({
      ...prev,
      age: ageVal,
      isTeenagePregnancy: ageVal < 20,
      isAdvancedMaternalAge: ageVal >= 35,
    }));
  };

  const mapValue = calculateMAP(formData.systolic, formData.diastolic);
  const meows = evaluateMEOWS({
    systolic: formData.systolic,
    diastolic: formData.diastolic,
    pulse: formData.pulse,
    respiratoryRate: formData.respiratoryRate,
    temperature: formData.temperature,
    consciousness: formData.consciousness,
    fetalHeartRate: formData.fetalHeartRate,
    fundalHeight: formData.fundalHeight,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Nama pasien wajib diisi.');
      return;
    }

    const newPatient: Patient = {
      id: `pt-${Date.now()}`,
      medicalRecordNo: formData.medicalRecordNo,
      nik: formData.nik || '737112' + Math.floor(1000000000 + Math.random() * 9000000000),
      name: formData.name,
      age: formData.age,
      husbandName: formData.husbandName,
      address: formData.address,
      neighborhood: formData.neighborhood,
      phone: formData.phone,
      gravida: formData.gravida,
      para: formData.para,
      abortus: formData.abortus,
      livingChildren: formData.livingChildren,
      hpht: formData.hpht,
      hpl: formData.hpl,
      gestationalAgeWeeks: formData.gestationalAgeWeeks,
      armCircumference: formData.armCircumference,
      weight: formData.weight,
      height: formData.height,
      chiefComplaint: formData.chiefComplaint || 'Pemeriksaan kehamilan rutin terpadu',
      vitals: {
        systolic: formData.systolic,
        diastolic: formData.diastolic,
        pulse: formData.pulse,
        respiratoryRate: formData.respiratoryRate,
        temperature: formData.temperature,
        consciousness: formData.consciousness,
        fetalHeartRate: formData.fetalHeartRate,
        fundalHeight: formData.fundalHeight,
      },
      labs: {
        hemoglobin: formData.hemoglobin,
        proteinuria: formData.proteinuria,
        bloodGlucose: formData.bloodGlucose,
        bloodGroup: formData.bloodGroup,
        hivStatus: formData.hivStatus,
        syphilisStatus: formData.syphilisStatus,
        hbsagStatus: formData.hbsagStatus,
      },
      complexCategories: {
        isPreeclampsiaOrEclampsia: formData.isPreeclampsiaOrEclampsia || formData.systolic >= 140,
        isPostpartumHemorrhage: formData.isPostpartumHemorrhage,
        isAntepartumHemorrhage: formData.isAntepartumHemorrhage,
        isSevereAnemiaOrKEK: formData.isSevereAnemiaOrKEK || formData.armCircumference < 23.5,
        isPrematureRuptureOfMembranes: formData.isPrematureRuptureOfMembranes,
        isDystociaOrObstructedLabor: formData.isDystociaOrObstructedLabor,
        isMaternalInfectionOrSepsis: formData.isMaternalInfectionOrSepsis,
        hasMedicalComorbidities: formData.hasMedicalComorbidities,
        otherComplications: formData.otherComplications,
      },
      vulnerabilities: {
        isTeenagePregnancy: formData.age < 20,
        isAdvancedMaternalAge: formData.age >= 35,
        isTripleEliminationPositive:
          formData.hivStatus === 'Reaktif' ||
          formData.syphilisStatus === 'Reaktif' ||
          formData.hbsagStatus === 'Reaktif',
        isDomesticViolenceVictim: formData.isDomesticViolenceVictim,
        isExtremePovertyOrPrasejahtera: formData.isExtremePovertyOrPrasejahtera,
        hasDisability: formData.hasDisability,
        isUnintendedPregnancy: formData.isUnintendedPregnancy,
        hasBadObstetricHistory: formData.hasBadObstetricHistory,
      },
      status: formData.status,
      riskScorePoedjiRochjati: 0,
      meowsScore: meows.totalScore,
      soapHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Calculate Poedji Rochjati
    const kspr = calculatePoedjiRochjati(newPatient);
    newPatient.riskScorePoedjiRochjati = kspr.score;

    onSave(newPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-teal-800 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold tracking-tight">Formulir Registrasi Asuhan Kasus Baru</h2>
            <p className="text-xs text-teal-100">
              Kohort Maternal & Kelompok Rentan · Fasilitas Pelayanan Kesehatan / Praktik Bidan
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-teal-200 hover:text-white p-1 rounded hover:bg-teal-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Section 1: Demografi Pasien */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-1">1. Identitas Pasien & Suami</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-700 font-medium block mb-1">Nama Lengkap Pasien *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Mis. Ny. Nurul Aisyah"
                  className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-700"
                />
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">No. Rekam Medis (RM)</label>
                <input
                  type="text"
                  value={formData.medicalRecordNo}
                  onChange={(e) => setFormData({ ...formData, medicalRecordNo: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded font-mono bg-slate-50"
                />
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">NIK (KTP)</label>
                <input
                  type="text"
                  value={formData.nik}
                  onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                  placeholder="3201..."
                  className="w-full p-2 border border-slate-300 rounded font-mono"
                />
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">Usia Ibu (Tahun) *</label>
                <input
                  type="number"
                  min={10}
                  max={60}
                  value={formData.age}
                  onChange={(e) => handleAgeChange(parseInt(e.target.value) || 20)}
                  className="w-full p-2 border border-slate-300 rounded font-mono"
                />
                {formData.age < 20 && (
                  <span className="text-[11px] text-indigo-700 font-medium block mt-0.5">
                    *Terdeteksi Kehamilan Remaja (&lt; 20 tahun)
                  </span>
                )}
                {formData.age >= 35 && (
                  <span className="text-[11px] text-amber-700 font-medium block mt-0.5">
                    *Terdeteksi Usia Lanjut Reproduksi (&gt;= 35 tahun)
                  </span>
                )}
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">Nama Suami</label>
                <input
                  type="text"
                  value={formData.husbandName}
                  onChange={(e) => setFormData({ ...formData, husbandName: e.target.value })}
                  placeholder="Mis. Tn. Ridwan"
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">No. Handphone / WhatsApp</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full p-2 border border-slate-300 rounded font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-slate-700 font-medium block mb-1">Alamat Domisili Lengkap</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Alamat domisili, RT/RW, Dusun/Lingkungan..."
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">Wilayah Binaan / Fasyankes</label>
                <select
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded bg-white"
                >
                  <option value="Wilayah Binaan 1">Wilayah Binaan 1</option>
                  <option value="Wilayah Binaan 2">Wilayah Binaan 2</option>
                  <option value="Wilayah Binaan 3">Wilayah Binaan 3</option>
                  <option value="Wilayah Binaan 4">Wilayah Binaan 4</option>
                  <option value="Luar Wilayah Binaan">Luar Wilayah Binaan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Riwayat Obstetri & Kehamilan */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-1">2. Riwayat Obstetri & Taksiran Partus</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              <div>
                <label className="text-slate-700 font-medium block mb-1">Gravida (G)</label>
                <input
                  type="number"
                  min={1}
                  value={formData.gravida}
                  onChange={(e) => setFormData({ ...formData, gravida: parseInt(e.target.value) || 1 })}
                  className="w-full p-2 border border-slate-300 rounded font-mono"
                />
              </div>
              <div>
                <label className="text-slate-700 font-medium block mb-1">Para (P)</label>
                <input
                  type="number"
                  min={0}
                  value={formData.para}
                  onChange={(e) => setFormData({ ...formData, para: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border border-slate-300 rounded font-mono"
                />
              </div>
              <div>
                <label className="text-slate-700 font-medium block mb-1">Abortus (A)</label>
                <input
                  type="number"
                  min={0}
                  value={formData.abortus}
                  onChange={(e) => setFormData({ ...formData, abortus: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border border-slate-300 rounded font-mono"
                />
              </div>
              <div>
                <label className="text-slate-700 font-medium block mb-1">Anak Hidup</label>
                <input
                  type="number"
                  min={0}
                  value={formData.livingChildren}
                  onChange={(e) => setFormData({ ...formData, livingChildren: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border border-slate-300 rounded font-mono"
                />
              </div>

              <div className="col-span-2">
                <label className="text-slate-700 font-medium block mb-1">HPHT (Hari Pertama Haid Terakhir)</label>
                <input
                  type="date"
                  value={formData.hpht}
                  onChange={(e) => handleHphtChange(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div>
                <span className="text-slate-500 block">Taksiran Persalinan (HPL - Naegele):</span>
                <strong className="font-mono text-sm text-teal-800">{formData.hpl || '-'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Usia Kehamilan Otomatis:</span>
                <strong className="font-mono text-sm text-slate-900">
                  {formData.gestationalAgeWeeks > 0 ? `${formData.gestationalAgeWeeks} minggu` : '-'}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Status LILA / Gizi:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={formData.armCircumference}
                    onChange={(e) => setFormData({ ...formData, armCircumference: parseFloat(e.target.value) || 24 })}
                    className="w-20 p-1 border border-slate-300 rounded font-mono text-xs"
                  />
                  <span>cm</span>
                  <span className={formData.armCircumference < 23.5 ? 'text-rose-700 font-bold' : 'text-emerald-700'}>
                    {formData.armCircumference < 23.5 ? '(KEK)' : '(Normal)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Tanda Vital & Pemeriksaan Awal */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-1">3. Tanda Vital & Deteksi Cepat MEOWS</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              <div>
                <label className="text-slate-700 font-medium block mb-1">TD Sistolik (mmHg)</label>
                <input
                  type="number"
                  value={formData.systolic}
                  onChange={(e) => setFormData({ ...formData, systolic: parseInt(e.target.value) || 120 })}
                  className="w-full p-2 border border-slate-300 rounded font-mono"
                />
              </div>
              <div>
                <label className="text-slate-700 font-medium block mb-1">TD Diastolik (mmHg)</label>
                <input
                  type="number"
                  value={formData.diastolic}
                  onChange={(e) => setFormData({ ...formData, diastolic: parseInt(e.target.value) || 80 })}
                  className="w-full p-2 border border-slate-300 rounded font-mono"
                />
              </div>
              <div>
                <label className="text-slate-700 font-medium block mb-1">Nadi (bpm)</label>
                <input
                  type="number"
                  value={formData.pulse}
                  onChange={(e) => setFormData({ ...formData, pulse: parseInt(e.target.value) || 80 })}
                  className="w-full p-2 border border-slate-300 rounded font-mono"
                />
              </div>
              <div>
                <label className="text-slate-700 font-medium block mb-1">Laju Napas (x/m)</label>
                <input
                  type="number"
                  value={formData.respiratoryRate}
                  onChange={(e) => setFormData({ ...formData, respiratoryRate: parseInt(e.target.value) || 18 })}
                  className="w-full p-2 border border-slate-300 rounded font-mono"
                />
              </div>
              <div>
                <label className="text-slate-700 font-medium block mb-1">Suhu (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) || 36.5 })}
                  className="w-full p-2 border border-slate-300 rounded font-mono"
                />
              </div>
              <div>
                <label className="text-slate-700 font-medium block mb-1">DJJ Janin (bpm)</label>
                <input
                  type="number"
                  value={formData.fetalHeartRate}
                  onChange={(e) => setFormData({ ...formData, fetalHeartRate: parseInt(e.target.value) || 140 })}
                  className="w-full p-2 border border-slate-300 rounded font-mono"
                />
              </div>
            </div>

            {/* Calculated MAP and MEOWS */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-4">
                <span>
                  MAP: <strong className={`font-mono ${mapValue >= 90 ? 'text-rose-700' : 'text-slate-900'}`}>{mapValue} mmHg</strong>
                </span>
                <span>
                  MEOWS: <strong className="font-mono text-slate-900">{meows.totalScore}</strong> ({meows.alertLevel})
                </span>
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${meows.badgeColor}`}>
                {meows.recommendation}
              </span>
            </div>
          </div>

          {/* Section 4: Laboratorium Dasar & Triple Eliminasi */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-1">4. Hasil Laboratorium & Skrining Triple Eliminasi</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-slate-700 font-medium block mb-1">Hemoglobin (g/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.hemoglobin}
                  onChange={(e) => setFormData({ ...formData, hemoglobin: parseFloat(e.target.value) || 11 })}
                  className="w-full p-2 border border-slate-300 rounded font-mono"
                />
              </div>
              <div>
                <label className="text-slate-700 font-medium block mb-1">Protein Urin</label>
                <select
                  value={formData.proteinuria}
                  onChange={(e) => setFormData({ ...formData, proteinuria: e.target.value as any })}
                  className="w-full p-2 border border-slate-300 rounded bg-white"
                >
                  <option value="Negatif">Negatif</option>
                  <option value="+1">+1 (Positif 1)</option>
                  <option value="+2">+2 (Positif 2)</option>
                  <option value="+3">+3 (Positif 3)</option>
                  <option value="+4">+4 (Positif 4)</option>
                </select>
              </div>
              <div>
                <label className="text-slate-700 font-medium block mb-1">HIV Rapid Test</label>
                <select
                  value={formData.hivStatus}
                  onChange={(e) => setFormData({ ...formData, hivStatus: e.target.value as any })}
                  className="w-full p-2 border border-slate-300 rounded bg-white"
                >
                  <option value="Non-reaktif">Non-reaktif</option>
                  <option value="Reaktif">Reaktif (Positif)</option>
                  <option value="Belum Diperiksa">Belum Diperiksa</option>
                </select>
              </div>
              <div>
                <label className="text-slate-700 font-medium block mb-1">Hepatitis B (HBsAg)</label>
                <select
                  value={formData.hbsagStatus}
                  onChange={(e) => setFormData({ ...formData, hbsagStatus: e.target.value as any })}
                  className="w-full p-2 border border-slate-300 rounded bg-white"
                >
                  <option value="Non-reaktif">Non-reaktif</option>
                  <option value="Reaktif">Reaktif (Positif)</option>
                  <option value="Belum Diperiksa">Belum Diperiksa</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 5: Klaster Kasus Kompleks & Kelompok Rentan (Checklist) */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-1">5. Identifikasi Kasus Kompleks & Kelompok Rentan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Complex Conditions */}
              <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-bold text-slate-900 block">Kategori Komplikasi Obstetri:</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPreeclampsiaOrEclampsia}
                    onChange={(e) => setFormData({ ...formData, isPreeclampsiaOrEclampsia: e.target.checked })}
                    className="rounded text-teal-700"
                  />
                  <span>Preeklampsia Berat (PEB) / Ancaman Eklampsia</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPostpartumHemorrhage}
                    onChange={(e) => setFormData({ ...formData, isPostpartumHemorrhage: e.target.checked })}
                    className="rounded text-teal-700"
                  />
                  <span>Perdarahan Pascapersalinan (HPP / Atonia Uteri)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAntepartumHemorrhage}
                    onChange={(e) => setFormData({ ...formData, isAntepartumHemorrhage: e.target.checked })}
                    className="rounded text-teal-700"
                  />
                  <span>Perdarahan Antepartum (Plasenta Previa / Solusio)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isDystociaOrObstructedLabor}
                    onChange={(e) => setFormData({ ...formData, isDystociaOrObstructedLabor: e.target.checked })}
                    className="rounded text-teal-700"
                  />
                  <span>Partus Tak Maju / Letak Lintang / Sungsang</span>
                </label>
              </div>

              {/* Vulnerable Groups */}
              <div className="space-y-2 p-3 bg-purple-50/50 border border-purple-200 rounded-lg">
                <span className="font-bold text-purple-950 block">Kategori Kelompok Rentan:</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isTeenagePregnancy}
                    onChange={(e) => setFormData({ ...formData, isTeenagePregnancy: e.target.checked })}
                    className="rounded text-teal-700"
                  />
                  <span>Kehamilan Remaja (&lt; 20 tahun)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isDomesticViolenceVictim}
                    onChange={(e) => setFormData({ ...formData, isDomesticViolenceVictim: e.target.checked })}
                    className="rounded text-teal-700"
                  />
                  <span>Korban KDRT / Kekerasan Berbasis Gender</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isExtremePovertyOrPrasejahtera}
                    onChange={(e) => setFormData({ ...formData, isExtremePovertyOrPrasejahtera: e.target.checked })}
                    className="rounded text-teal-700"
                  />
                  <span>Keluarga Prasejahtera (PBI JKN) / Risiko Stunting</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasBadObstetricHistory}
                    onChange={(e) => setFormData({ ...formData, hasBadObstetricHistory: e.target.checked })}
                    className="rounded text-teal-700"
                  />
                  <span>Riwayat Obstetri Buruk (Bekas SC, IUFD, Keguguran Berulang)</span>
                </label>
              </div>
            </div>

            {/* Chief Complaint */}
            <div>
              <label className="text-slate-700 font-medium block mb-1">Keluhan Utama & Catatan Triage Awal</label>
              <textarea
                rows={2}
                value={formData.chiefComplaint}
                onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                placeholder="Misal: Nyeri kepala frontal, pandangan kabur, atau perdarahan jalan lahir..."
                className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-700"
              />
            </div>

            {/* Status Case */}
            <div>
              <label className="text-slate-700 font-medium block mb-1">Status Penanganan Awal</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as CaseStatus })}
                className="w-full md:w-64 p-2 border border-slate-300 rounded bg-white font-semibold"
              >
                <option value="Dalam Pemantauan">Dalam Pemantauan Puskesmas</option>
                <option value="Gawat Darurat PONED">Gawat Darurat PONED (Perlu Stabilisasi)</option>
                <option value="Dirujuk ke RS PONEK">Dirujuk ke RS PONEK</option>
                <option value="Selesai Nifas / Pulih">Selesai Nifas / Pulih</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              Simpan Data Pasien
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
