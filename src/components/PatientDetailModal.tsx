import React, { useState } from 'react';
import { Patient, SoapRecord, ReferralPlan } from '../types/midwifery';
import { calculateMAP, evaluateMEOWS, calculatePoedjiRochjati, calculateTBJ } from '../utils/clinicalCalculators';
import { X, Printer, Copy, Check, Sparkles, Send, AlertTriangle, ShieldCheck, Heart, User, FileText, Phone, Ambulance, Plus } from 'lucide-react';

interface PatientDetailModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePatient: (updated: Patient) => void;
  onOpenSbar?: (patient: Patient) => void;
}

export const PatientDetailModal: React.FC<PatientDetailModalProps> = ({
  patient,
  isOpen,
  onClose,
  onUpdatePatient,
  onOpenSbar,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'soap' | 'referral' | 'vulnerable' | 'ai-triage'>('overview');
  const [isGeneratingSoap, setIsGeneratingSoap] = useState(false);
  const [isAnalyzingCase, setIsAnalyzingCase] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);
  const [copiedSbar, setCopiedSbar] = useState(false);

  // New SOAP draft state
  const [newSoap, setNewSoap] = useState<SoapRecord>({
    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    midwifeName: 'Bdn. Penanggung Jawab Pasien',
    subjektif: '',
    objektif: '',
    analisis: '',
    penatalaksanaan: [],
  });
  const [newPenatalaksanaanText, setNewPenatalaksanaanText] = useState('');

  if (!isOpen) return null;

  const mapValue = calculateMAP(patient.vitals.systolic, patient.vitals.diastolic);
  const meows = evaluateMEOWS(patient.vitals);
  const kspr = calculatePoedjiRochjati(patient);
  const tbj = patient.vitals.fundalHeight ? calculateTBJ(patient.vitals.fundalHeight, false) : 0;

  // Handle AI SOAP generation
  const handleGenerateSoapAI = async () => {
    setIsGeneratingSoap(true);
    try {
      const res = await fetch('/api/midwifery/generate-soap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientData: patient,
          triageNotes: `TTV: TD ${patient.vitals.systolic}/${patient.vitals.diastolic}, MEOWS: ${meows.totalScore}, Keluhan: ${patient.chiefComplaint}`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setNewSoap({
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          midwifeName: 'Bdn. Konselor Kebidanan',
          subjektif: data.subjektif || '',
          objektif: data.objektif || '',
          analisis: data.analisis || '',
          penatalaksanaan: data.penatalaksanaan || [],
        });
      } else {
        // Fallback generator
        generateFallbackSoap();
      }
    } catch (err) {
      console.warn('AI call failed, using clinical fallback SOAP:', err);
      generateFallbackSoap();
    } finally {
      setIsGeneratingSoap(false);
    }
  };

  const generateFallbackSoap = () => {
    const isPEB = patient.complexCategories.isPreeclampsiaOrEclampsia;
    const isHPP = patient.complexCategories.isPostpartumHemorrhage;
    const isRemaja = patient.vulnerabilities.isTeenagePregnancy;

    const sub = `Ibu mengeluh ${patient.chiefComplaint.toLowerCase()}. Hamil anak ke-${patient.gravida}, belum pernah/pernah melahirkan ${patient.para} kali, riwayat keguguran ${patient.abortus} kali. HPHT: ${patient.hpht}, perkiraan lahir: ${patient.hpl}. ${isRemaja ? 'Pasien berusia ' + patient.age + ' tahun, memerlukan pendampingan ramah remaja.' : ''}`;
    const obj = `KU: Lemah/Sedang, Kesadaran: ${patient.vitals.consciousness}. TD: ${patient.vitals.systolic}/${patient.vitals.diastolic} mmHg (MAP: ${mapValue} mmHg), Nadi: ${patient.vitals.pulse} x/m, RR: ${patient.vitals.respiratoryRate} x/m, Suhu: ${patient.vitals.temperature}°C. TFU: ${patient.vitals.fundalHeight || '-'} cm, DJJ: ${patient.vitals.fetalHeartRate || '-'} x/m. LILA: ${patient.armCircumference} cm. Lab: Protein urin ${patient.labs.proteinuria || '-'}, Hb: ${patient.labs.hemoglobin || '-'} g/dL, HBsAg: ${patient.labs.hbsagStatus}. Skor MEOWS: ${meows.totalScore} (${meows.alertLevel}).`;
    const ana = `G${patient.gravida}P${patient.para}A${patient.abortus} umur ${patient.age} tahun, hamil ${patient.gestationalAgeWeeks} minggu dengan ${isPEB ? 'Preeklampsia Berat (PEB)' : isHPP ? 'Perdarahan Pascapersalinan (HPP)' : 'Kehamilan Berisiko Tinggi'} ${isRemaja ? '+ Kehamilan Remaja' : ''} ${patient.vulnerabilities.isTripleEliminationPositive ? '+ Triple Eliminasi Reaktif' : ''}. Masalah Potensial: Kedaruratan maternal-neonatal. Kebutuhan Segera: Penanganan emergensi dan stabilisasi rujukan.`;
    const tatalaksana = [
      'Menjelaskan kondisi kehamilan dan hasil pemeriksaan secara transparan kepada ibu dan keluarga.',
      isPEB ? 'Pemberian loading dose MgSO4 40% 4 gram IV perlahan selama 5-10 menit dengan syarat patella (+), RR > 16, urin > 30 ml/jam.' : 'Pemberian uterotonika dan resusitasi cairan kristaloid cepat.',
      isPEB ? 'Lanjutkan MgSO4 6 gram dalam 500 ml Ringer Laktat 28 tetes/menit.' : 'Evaluasi kontraksi uterus dan pantau perdarahan kala IV.',
      'Melakukan stabilisasi sesuai prinsip BAKSOKUDA dan persiapan rujukan ke RS PONEK.',
      'Melakukan pemantauan tanda vital ketat setiap 15-30 menit.',
    ];

    setNewSoap({
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      midwifeName: 'Bdn. Penanggung Jawab Pasien',
      subjektif: sub,
      objektif: obj,
      analisis: ana,
      penatalaksanaan: tatalaksana,
    });
  };

  // Save new SOAP record
  const handleSaveSoap = () => {
    if (!newSoap.analisis || !newSoap.subjektif) {
      alert('Harap lengkapi catatan Subjektif dan Analisis terlebih dahulu.');
      return;
    }

    const updated: Patient = {
      ...patient,
      soapHistory: [newSoap, ...patient.soapHistory],
      updatedAt: new Date().toISOString(),
    };
    onUpdatePatient(updated);
    alert('Catatan SOAP berhasil disimpan ke Rekam Medis pasien!');
    // Reset form
    setNewSoap({
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      midwifeName: 'Bdn. Penanggung Jawab Pasien',
      subjektif: '',
      objektif: '',
      analisis: '',
      penatalaksanaan: [],
    });
  };

  // Run AI Clinical Case Analysis
  const handleAnalyzeCaseAI = async () => {
    setIsAnalyzingCase(true);
    try {
      const res = await fetch('/api/midwifery/analyze-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientData: patient }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiAnalysisResult(data);
        setActiveTab('ai-triage');
      } else {
        alert('Tidak dapat memproses analisis AI server saat ini.');
      }
    } catch (e: any) {
      alert('Gagal menghubungi AI: ' + e.message);
    } finally {
      setIsAnalyzingCase(false);
    }
  };

  // Copy SBAR Referral string
  const handleCopySbar = () => {
    const sbarText = `RANGKUMAN KOMUNIKASI RUJUKAN SBAR
FASILITAS KESEHATAN / PRAKTIK BIDAN -> IGD PONEK RS RUJUKAN

S (Situation):
Pasien: ${patient.name} (${patient.age} thn), No RM: ${patient.medicalRecordNo}
Status: G${patient.gravida}P${patient.para}A${patient.abortus}, Usia Kehamilan: ${patient.gestationalAgeWeeks} minggu
Keluhan: ${patient.chiefComplaint}

B (Background):
HPHT: ${patient.hpht}, HPL: ${patient.hpl}, LILA: ${patient.armCircumference} cm
Riwayat: ${patient.vulnerabilities.hasBadObstetricHistory ? 'Ada riwayat obstetri buruk / SC' : 'Tidak ada riwayat SC'}
Faktor Kerentanan: ${patient.vulnerabilities.isTeenagePregnancy ? 'Kehamilan Remaja, ' : ''}${patient.vulnerabilities.isTripleEliminationPositive ? 'Triple Eliminasi (HBsAg/HIV/Sifilis), ' : ''}${patient.vulnerabilities.isDomesticViolenceVictim ? 'Korban KDRT, ' : ''}${patient.vulnerabilities.isExtremePovertyOrPrasejahtera ? 'PBI JKN Prasejahtera' : '-'}

A (Assessment):
TTV: TD ${patient.vitals.systolic}/${patient.vitals.diastolic} mmHg (MAP ${mapValue} mmHg), Nadi ${patient.vitals.pulse} x/m, RR ${patient.vitals.respiratoryRate} x/m, Suhu ${patient.vitals.temperature}°C
DJJ: ${patient.vitals.fetalHeartRate || '-'} x/m, TFU: ${patient.vitals.fundalHeight || '-'} cm, Protein Urin: ${patient.labs.proteinuria || '-'}, Hb: ${patient.labs.hemoglobin || '-'} g/dL
Skor MEOWS: ${meows.totalScore} (${meows.alertLevel}), Skor KSPR: ${kspr.score} (${kspr.category})

R (Recommendation):
Mohon kesiapan tim PONEK RS rujukan untuk tatalaksana definitif. Pasien dirujuk dengan prinsip BAKSOKUDA didampingi Bidan Fasilitas Kesehatan dengan infus terpasang dan obat emergensi siaga.`;

    navigator.clipboard.writeText(sbarText);
    setCopiedSbar(true);
    setTimeout(() => setCopiedSbar(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-teal-600 flex items-center justify-center font-bold text-white">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight">{patient.name}</h2>
                <span className="text-xs text-slate-300 font-mono">({patient.medicalRecordNo})</span>
              </div>
              <p className="text-xs text-slate-400">
                NIK: {patient.nik} · {patient.neighborhood} · HP: {patient.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenSbar && (
              <button
                type="button"
                onClick={() => onOpenSbar(patient)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-200 border border-teal-500/30 text-xs font-semibold rounded transition-colors whitespace-nowrap shadow-xs"
              >
                <FileText className="w-3.5 h-3.5 text-teal-300" />
                <span>SBAR Handover (Cetak/Unduh)</span>
              </button>
            )}
            <button
              onClick={handleAnalyzeCaseAI}
              disabled={isAnalyzingCase}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAnalyzingCase ? 'Menganalisis...' : 'Analisis AI Sp.OG'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tab Controls (Clean Segmented) */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-medium rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-white text-slate-900 border-t-2 border-teal-600 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ringkasan & Tanda Vital
          </button>
          <button
            onClick={() => setActiveTab('soap')}
            className={`px-4 py-2 text-xs font-medium rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === 'soap'
                ? 'bg-white text-slate-900 border-t-2 border-teal-600 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Form SOAP & Rekam Medis ({patient.soapHistory.length})
          </button>
          <button
            onClick={() => setActiveTab('referral')}
            className={`px-4 py-2 text-xs font-medium rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === 'referral'
                ? 'bg-white text-slate-900 border-t-2 border-teal-600 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rujukan BAKSOKUDA & SBAR
          </button>
          <button
            onClick={() => setActiveTab('vulnerable')}
            className={`px-4 py-2 text-xs font-medium rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === 'vulnerable'
                ? 'bg-white text-slate-900 border-t-2 border-teal-600 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Asuhan Kelompok Rentan
          </button>
          {aiAnalysisResult && (
            <button
              onClick={() => setActiveTab('ai-triage')}
              className={`px-4 py-2 text-xs font-medium rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'ai-triage'
                  ? 'bg-white text-teal-800 border-t-2 border-teal-600 font-semibold shadow-xs'
                  : 'text-teal-700 hover:text-teal-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Hasil Analisis Sp.OG
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: OVERVIEW & VITALS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* MEOWS Warning Alert Banner if score > 0 */}
              {meows.totalScore > 0 && (
                <div className={`p-4 border rounded-lg flex items-start gap-3 ${meows.badgeColor}`}>
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <strong className="block text-sm font-bold">
                      Deteksi Dini MEOWS: {meows.alertLevel} (Skor: {meows.totalScore})
                    </strong>
                    <p>{meows.recommendation}</p>
                    <div className="text-[11px] opacity-80 pt-1">
                      Pemicu: {meows.yellowTriggers} parameter kuning · {meows.redTriggers} parameter merah
                    </div>
                  </div>
                </div>
              )}

              {/* Patient Core Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Obstetric Bio */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
                  <span className="font-bold text-slate-900 text-sm block">Status Obstetri</span>
                  <div className="space-y-1 text-slate-700">
                    <div>
                      <span className="text-slate-500">Paritas: </span>
                      <strong>
                        G{patient.gravida} P{patient.para} A{patient.abortus} (Hidup: {patient.livingChildren})
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Usia Ibu: </span>
                      <strong className="font-mono tabular-nums">{patient.age} tahun</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">HPHT: </span>
                      <strong className="font-mono">{patient.hpht}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Taksiran Persalinan (HPL): </span>
                      <strong className="font-mono text-teal-800">{patient.hpl}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Usia Kehamilan: </span>
                      <strong className="font-mono text-slate-900">{patient.gestationalAgeWeeks} minggu</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Suami: </span>
                      <span>{patient.husbandName}</span>
                    </div>
                  </div>
                </div>

                {/* Vitals & Exam */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
                  <span className="font-bold text-slate-900 text-sm block">Tanda Vital & Fisik</span>
                  <div className="space-y-1 text-slate-700 font-mono">
                    <div>
                      <span className="text-slate-500">Tekanan Darah: </span>
                      <strong className={patient.vitals.systolic >= 140 ? 'text-rose-700' : 'text-slate-900'}>
                        {patient.vitals.systolic}/{patient.vitals.diastolic} mmHg
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500">MAP (Mean Arterial): </span>
                      <strong className={mapValue >= 90 ? 'text-rose-700' : 'text-slate-900'}>
                        {mapValue} mmHg {mapValue >= 90 ? '(Risiko PEB)' : '(Normal)'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Nadi / HR: </span>
                      <span>{patient.vitals.pulse} bpm</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Laju Napas (RR): </span>
                      <span>{patient.vitals.respiratoryRate} x/menit</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Suhu: </span>
                      <span>{patient.vitals.temperature} °C</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Kesadaran: </span>
                      <span>{patient.vitals.consciousness}</span>
                    </div>
                  </div>
                </div>

                {/* Fetal & Nutrition */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
                  <span className="font-bold text-slate-900 text-sm block">Janin & Status Gizi</span>
                  <div className="space-y-1 text-slate-700">
                    <div>
                      <span className="text-slate-500">TFU: </span>
                      <strong className="font-mono">{patient.vitals.fundalHeight || '-'} cm</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">DJJ (Denyut Janin): </span>
                      <strong className="font-mono text-teal-800">{patient.vitals.fetalHeartRate || '-'} bpm</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Taksiran Berat (TBJ): </span>
                      <strong className="font-mono">{tbj > 0 ? `${tbj} gram` : '-'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">LILA: </span>
                      <strong className={`font-mono ${patient.armCircumference < 23.5 ? 'text-rose-700 font-bold' : ''}`}>
                        {patient.armCircumference} cm {patient.armCircumference < 23.5 ? '(KEK)' : '(Normal)'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500">BB / TB: </span>
                      <span className="font-mono">{patient.weight} kg / {patient.height} cm</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lab Results Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Hasil Skrining Laboratorium Terpadu</span>
                  <span className="text-xs text-slate-500">Standar Pemeriksaan ANC</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 divide-x divide-y sm:divide-y-0 divide-slate-200 text-xs text-center p-2">
                  <div className="p-2">
                    <span className="text-slate-500 block text-[11px]">Hemoglobin</span>
                    <strong className={`font-mono ${patient.labs.hemoglobin && patient.labs.hemoglobin < 10 ? 'text-rose-700' : 'text-slate-900'}`}>
                      {patient.labs.hemoglobin ? `${patient.labs.hemoglobin} g/dL` : '-'}
                    </strong>
                  </div>
                  <div className="p-2">
                    <span className="text-slate-500 block text-[11px]">Protein Urin</span>
                    <strong className={`font-mono ${patient.labs.proteinuria !== 'Negatif' ? 'text-rose-700' : 'text-slate-900'}`}>
                      {patient.labs.proteinuria || '-'}
                    </strong>
                  </div>
                  <div className="p-2">
                    <span className="text-slate-500 block text-[11px]">GDS</span>
                    <strong className="font-mono text-slate-900">
                      {patient.labs.bloodGlucose ? `${patient.labs.bloodGlucose} mg/dL` : '-'}
                    </strong>
                  </div>
                  <div className="p-2">
                    <span className="text-slate-500 block text-[11px]">Gol. Darah</span>
                    <strong className="font-mono text-slate-900">{patient.labs.bloodGroup || '-'}</strong>
                  </div>
                  <div className="p-2">
                    <span className="text-slate-500 block text-[11px]">HIV (Rapid)</span>
                    <strong className={patient.labs.hivStatus === 'Reaktif' ? 'text-rose-700' : 'text-slate-900'}>
                      {patient.labs.hivStatus}
                    </strong>
                  </div>
                  <div className="p-2">
                    <span className="text-slate-500 block text-[11px]">Sifilis (TP Rapid)</span>
                    <strong className={patient.labs.syphilisStatus === 'Reaktif' ? 'text-rose-700' : 'text-slate-900'}>
                      {patient.labs.syphilisStatus}
                    </strong>
                  </div>
                  <div className="p-2">
                    <span className="text-slate-500 block text-[11px]">Hepatitis B (HBsAg)</span>
                    <strong className={patient.labs.hbsagStatus === 'Reaktif' ? 'text-rose-700' : 'text-slate-900'}>
                      {patient.labs.hbsagStatus}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Poedji Rochjati & Risk Assessment */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                <span className="font-bold text-slate-900 block text-sm">
                  Penilaian Skor Poedji Rochjati (KSPR): Skor {kspr.score} · {kspr.category}
                </span>
                <p className="text-slate-700">{kspr.description}</p>
              </div>
            </div>
          )}

          {/* TAB 2: SOAP RECORD & EDITOR */}
          {activeTab === 'soap' && (
            <div className="space-y-6">
              {/* New SOAP Input Card */}
              <div className="p-4 bg-teal-50/40 border border-teal-200 rounded-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Catat Asuhan Kebidanan SOAP (7 Langkah Varney)</h3>
                    <p className="text-xs text-slate-500">
                      Standar dokumentasi rekam medis kebidanan berperspektif keselamatan maternal
                    </p>
                  </div>
                  <button
                    onClick={handleGenerateSoapAI}
                    disabled={isGeneratingSoap}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded transition-colors whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isGeneratingSoap ? 'Menyusun SOAP...' : 'Buat Draft SOAP Otomatis (AI)'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* S: Subjektif */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 block">S - Subjektif (Anamnesa Pasien):</label>
                    <textarea
                      rows={4}
                      value={newSoap.subjektif}
                      onChange={(e) => setNewSoap({ ...newSoap, subjektif: e.target.value })}
                      placeholder="Keluhan utama, riwayat kehamilan saat ini, riwayat persalinan lalu, keluhan penyerta, aspek psikososial..."
                      className="w-full p-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-teal-700 bg-white"
                    />
                  </div>

                  {/* O: Objektif */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 block">O - Objektif (Hasil Pemeriksaan):</label>
                    <textarea
                      rows={4}
                      value={newSoap.objektif}
                      onChange={(e) => setNewSoap({ ...newSoap, objektif: e.target.value })}
                      placeholder="KU, kesadaran, TTV, TFU, Leopold, DJJ, his, pembukaan serviks, hasil lab Hb/Protein/Triple eliminasi..."
                      className="w-full p-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-teal-700 bg-white"
                    />
                  </div>

                  {/* A: Analisis */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 block">A - Analisis (Diagnosis Nomenklatur & Kebutuhan Segera):</label>
                    <textarea
                      rows={4}
                      value={newSoap.analisis}
                      onChange={(e) => setNewSoap({ ...newSoap, analisis: e.target.value })}
                      placeholder="Contoh: G1P0A0 umur 17 thn hamil 35 mgg dengan PEB impending eklampsia + Kehamilan Remaja + KEK. Masalah potensial: Kejang eklampsia..."
                      className="w-full p-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-teal-700 bg-white"
                    />
                  </div>

                  {/* P: Penatalaksanaan */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 block">P - Penatalaksanaan & Evaluasi:</label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newPenatalaksanaanText}
                          onChange={(e) => setNewPenatalaksanaanText(e.target.value)}
                          placeholder="Tambah poin tindakan (misal: Berikan MgSO4 bolus, pasang kateter)..."
                          className="flex-1 p-2 border border-slate-300 rounded text-xs bg-white"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newPenatalaksanaanText.trim()) {
                              e.preventDefault();
                              setNewSoap({
                                ...newSoap,
                                penatalaksanaan: [...newSoap.penatalaksanaan, newPenatalaksanaanText.trim()],
                              });
                              setNewPenatalaksanaanText('');
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newPenatalaksanaanText.trim()) {
                              setNewSoap({
                                ...newSoap,
                                penatalaksanaan: [...newSoap.penatalaksanaan, newPenatalaksanaanText.trim()],
                              });
                              setNewPenatalaksanaanText('');
                            }
                          }}
                          className="px-3 py-1 bg-slate-800 text-white rounded text-xs"
                        >
                          + Tambah
                        </button>
                      </div>

                      {/* List of actions */}
                      <ul className="space-y-1 max-h-32 overflow-y-auto bg-white p-2 border border-slate-200 rounded">
                        {newSoap.penatalaksanaan.length === 0 ? (
                          <li className="text-slate-400 italic">Belum ada poin tindakan ditambahkan</li>
                        ) : (
                          newSoap.penatalaksanaan.map((item, idx) => (
                            <li key={idx} className="flex items-start justify-between gap-2 text-slate-700">
                              <span>· {item}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setNewSoap({
                                    ...newSoap,
                                    penatalaksanaan: newSoap.penatalaksanaan.filter((_, i) => i !== idx),
                                  });
                                }}
                                className="text-rose-600 hover:text-rose-800 font-bold ml-2"
                              >
                                ×
                              </button>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-teal-100">
                  <button
                    onClick={handleSaveSoap}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Simpan ke Rekam Medis Pasien
                  </button>
                </div>
              </div>

              {/* SOAP History Timeline */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Riwayat Catatan SOAP Sebelumnya</h4>
                {patient.soapHistory.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">Belum ada riwayat SOAP yang tercatat.</p>
                ) : (
                  patient.soapHistory.map((soap, index) => (
                    <div key={index} className="p-4 bg-white border border-slate-200 rounded-lg space-y-3 text-xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="font-mono text-slate-500">{soap.date}</span>
                        <span className="font-semibold text-teal-800">{soap.midwifeName}</span>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <strong className="text-slate-900 block font-semibold">Subjektif (S):</strong>
                          <p className="text-slate-700 whitespace-pre-line">{soap.subjektif}</p>
                        </div>
                        <div>
                          <strong className="text-slate-900 block font-semibold">Objektif (O):</strong>
                          <p className="text-slate-700 whitespace-pre-line">{soap.objektif}</p>
                        </div>
                        <div>
                          <strong className="text-slate-900 block font-semibold">Analisis (A):</strong>
                          <p className="text-slate-700 whitespace-pre-line font-medium">{soap.analisis}</p>
                        </div>
                        <div>
                          <strong className="text-slate-900 block font-semibold">Penatalaksanaan (P):</strong>
                          <ul className="list-disc list-inside space-y-1 text-slate-700 mt-1">
                            {soap.penatalaksanaan.map((item, pIdx) => (
                              <li key={pIdx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: REFERRAL BAKSOKUDA & SBAR */}
          {activeTab === 'referral' && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-900 text-white rounded-lg flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold">Protokol Stabilisasi Rujukan Maternal BAKSOKUDA</h3>
                  <p className="text-xs text-slate-300">
                    Sistem Rujukan Terpadu (SISRUTE) ke Rumah Sakit PONEK Rujukan
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {onOpenSbar && (
                    <button
                      type="button"
                      onClick={() => onOpenSbar(patient)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded transition-colors shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-white" />
                      <span>Lembar Resmi SBAR (Cetak / Unduh)</span>
                    </button>
                  )}
                  <button
                    onClick={handleCopySbar}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded transition-colors border border-slate-700"
                  >
                    {copiedSbar ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSbar ? 'Tersalin!' : 'Salin Resume'}</span>
                  </button>
                </div>
              </div>

              {/* BAKSOKUDA Checklist Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="font-bold text-slate-900 block">B - Bidan / Tenaga Kesehatan Pendamping</span>
                  <p className="text-slate-700">
                    Bidan jaga berkompetensi APN/PONED mendampingi di dalam ambulans membawa partus set steril dan obat darurat.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="font-bold text-slate-900 block">A - Alat Medis Siaga Ambulans</span>
                  <p className="text-slate-700">
                    Tabung oksigen penuh, sungkup O2, suction lendir bayi, resusitator kit, tensimeter, doppler, sarung tangan steril.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="font-bold text-slate-900 block">K - Keluarga & Calon Donor Darah</span>
                  <p className="text-slate-700">
                    Suami/keluarga pengambil keputusan ikut serta + 2 orang calon donor darah golongan yang cocok ({patient.labs.bloodGroup || 'Siaga'}).
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="font-bold text-slate-900 block">S - Surat Rujukan & Komunikasi SISRUTE</span>
                  <p className="text-slate-700">
                    Surat rujukan lengkap berisi tanda vital, terapi yang telah diberikan, dan notifikasi telepon ke IGD PONEK RS rujukan.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="font-bold text-slate-900 block">O - Obat-obatan Lanjutan Selama Perjalanan</span>
                  <p className="text-slate-700">
                    Infus cairan kristaloid tetap mengalir (misal: RL + drip MgSO4 28 tpm), sedia Kalsium Glukonat, Oksitosin, Metergin cadangan.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="font-bold text-slate-900 block">K - Kendaraan Ambulans Siaga</span>
                  <p className="text-slate-700">
                    Ambulans siaga dengan sirine aktif dan pengemudi terlatih jalur evakuasi cepat ke Rumah Sakit PONEK rujukan.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="font-bold text-slate-900 block">U - Uang & Jaminan Kesehatan</span>
                  <p className="text-slate-700">
                    Kartu BPJS Kesehatan / KIS PBI aktif, Jampersal, KTP dan Kartu Keluarga asli ibu dan penanggung jawab.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="font-bold text-slate-900 block">DA - Doa & Ketenangan Pasien</span>
                  <p className="text-slate-700">
                    Dukungan emosional dan spiritual kepada ibu dan keluarga untuk meminimalkan kecemasan dan stres selama rujukan.
                  </p>
                </div>
              </div>

              {/* SBAR Card Display */}
              <div className="p-4 bg-slate-50 border border-slate-300 rounded-lg space-y-3 text-xs">
                <span className="font-bold text-slate-900 text-sm block">Format Komunikasi Verbal & Pesan SBAR untuk RS Rujukan</span>
                <div className="space-y-2 text-slate-800">
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <strong>S (Situation):</strong> Ny. {patient.name} ({patient.age} thn), G{patient.gravida}P{patient.para}A{patient.abortus} UK {patient.gestationalAgeWeeks} mgg. Keluhan: {patient.chiefComplaint}
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <strong>B (Background):</strong> HPHT: {patient.hpht}, HPL: {patient.hpl}, Riwayat: {patient.complexCategories.otherComplications || 'Kasus risiko tinggi'}.
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <strong>A (Assessment):</strong> TD: {patient.vitals.systolic}/{patient.vitals.diastolic} mmHg (MAP {mapValue}), Nadi {patient.vitals.pulse}, RR {patient.vitals.respiratoryRate}, Protein urin {patient.labs.proteinuria}, MEOWS {meows.totalScore}. Terapi awal di Puskesmas telah diberikan.
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <strong>R (Recommendation):</strong> Mohon penerimaan di IGD PONEK untuk tindakan definitif dokter spesialis Sp.OG dan kesiapan NICU.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VULNERABLE POPULATION CARE */}
          {activeTab === 'vulnerable' && (
            <div className="space-y-6 text-xs">
              <div className="p-4 bg-purple-900 text-white rounded-lg">
                <h3 className="text-sm font-bold">Rencana Asuhan Khusus Kelompok Rentan & Perlindungan Gender</h3>
                <p className="text-xs text-purple-200">
                  Pendekatan komprehensif lintas program (Gizi, Imunisasi, PKPR, Psikologi, dan Dinas Sosial)
                </p>
              </div>

              {/* Vulnerabilities Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Teenage Pregnancy */}
                <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-2">
                  <span className="font-bold text-slate-900 text-sm block">1. Asuhan Kehamilan Remaja (&lt; 20 Tahun)</span>
                  <p className="text-slate-600">
                    Status pasien: {patient.vulnerabilities.isTeenagePregnancy ? 'Ya (Usia ' + patient.age + ' tahun)' : 'Tidak'}
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li>Konseling Pelayanan Kesehatan Peduli Remaja (PKPR) tanpa stigma.</li>
                    <li>Waspada disproporsi sefalopelvik (CPD) bila TB &lt; 145 cm.</li>
                    <li>Pemantauan ketat MAP untuk deteksi dini preeklampsia usia muda.</li>
                    <li>Intervensi PMT pemulihan jika LILA &lt; 23.5 cm untuk mencegah BBLR & stunting.</li>
                  </ul>
                </div>

                {/* Triple Elimination */}
                <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-2">
                  <span className="font-bold text-slate-900 text-sm block">2. Program PPIA Triple Eliminasi</span>
                  <p className="text-slate-600">
                    Status: {patient.labs.hbsagStatus === 'Reaktif' ? 'HBsAg Reaktif' : 'Skrining terlaksana'}
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li>Ibu HBsAg (+): Siapkan alokasi HBIg 0.5 ml + Vaksin HepB-0 untuk bayi dalam &lt; 24 jam lahir.</li>
                    <li>Ibu HIV (+): Terapi ARV kombinasi (TLD) seumur hidup, profilaksis Zidovudin pada bayi.</li>
                    <li>Ibu Sifilis (+): Injeksi Benzatin Penisilin 2.4 juta IU IM, obati pasangan seksual.</li>
                  </ul>
                </div>

                {/* Domestic Violence / KDRT */}
                <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-2">
                  <span className="font-bold text-slate-900 text-sm block">3. Penanganan Korban KDRT & Trauma</span>
                  <p className="text-slate-600">
                    Status pasien: {patient.vulnerabilities.isDomesticViolenceVictim ? 'Korban Kekerasan Aktif' : 'Tidak teridentifikasi'}
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li>Ruang privasi tertutup dengan garansi kerahasiaan medis penuh.</li>
                    <li>Pencatatan medikolegal rinci (visum et repertum bila diperlukan).</li>
                    <li>Pemeriksaan USG/Doppler cermat untuk mendeteksi solusio plasenta pasca benturan.</li>
                    <li>Koordinasi rahasia dengan UPTD PPA / Dinas Sosial setempat untuk safe house.</li>
                  </ul>
                </div>

                {/* Extreme Poverty / Stunting */}
                <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-2">
                  <span className="font-bold text-slate-900 text-sm block">4. Intervensi Kemiskinan Ekstrem & Stunting</span>
                  <p className="text-slate-600">
                    Status: {patient.vulnerabilities.isExtremePovertyOrPrasejahtera ? 'Keluarga Prasejahtera / PBI JKN' : 'Mampu'}
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li>Pemberian Makanan Tambahan (PMT) kaya protein hewani (telur, ikan) 90 hari.</li>
                    <li>Suplementasi TTD (Tablet Tambah Darah) rutin dan kalsium.</li>
                    <li>Pendampingan kader posyandu wilayah binaan selama masa nifas.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AI TRIAGE CASE ANALYSIS RESULT */}
          {activeTab === 'ai-triage' && aiAnalysisResult && (
            <div className="space-y-6 text-xs">
              <div className="p-4 bg-teal-900 text-white rounded-lg flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold">Hasil Analisis Klinis Konsultan Sp.OG (AI Powered)</h3>
                  <p className="text-xs text-teal-200">
                    Berdasarkan Pedoman POGI, PNPK Preeklampsia, dan Buku Saku Maternal Kemenkes RI
                  </p>
                </div>
                <div className="bg-teal-800 text-teal-100 px-3 py-1 rounded text-xs font-semibold">
                  Tingkat Risiko: {aiAnalysisResult.riskLevel}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <span className="font-bold text-slate-900 text-sm block">Diagnosis Utama & Banding</span>
                  <p className="font-semibold text-teal-800">{aiAnalysisResult.primaryDiagnosis}</p>
                  <div className="pt-2">
                    <span className="text-slate-500 font-semibold block">Diagnosis Banding:</span>
                    <ul className="list-disc list-inside text-slate-700">
                      {aiAnalysisResult.differentialDiagnosis?.map((d: string, i: number) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <span className="font-bold text-slate-900 text-sm block">Langkah Tindakan Segera di Puskesmas</span>
                  <ul className="list-disc list-inside text-slate-700 space-y-1">
                    {aiAnalysisResult.immediateActions?.map((act: string, i: number) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Emergency Medications */}
              {aiAnalysisResult.emergencyMedications?.length > 0 && (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 font-bold text-slate-800">
                    Instruksi Medikamentosa Emergensi
                  </div>
                  <div className="p-3 space-y-2">
                    {aiAnalysisResult.emergencyMedications.map((med: any, i: number) => (
                      <div key={i} className="p-2.5 bg-white border border-slate-200 rounded space-y-0.5">
                        <strong className="text-teal-900 block font-bold">{med.name}</strong>
                        <p className="text-slate-700">Dosis & Rute: {med.dosage}</p>
                        <p className="text-slate-500 text-[11px]">Parameter Pemantauan: {med.monitoring}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vulnerable considerations */}
              {aiAnalysisResult.vulnerableGroupConsiderations?.length > 0 && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg space-y-2">
                  <strong className="text-purple-950 font-bold block">
                    Pertimbangan Khusus Kelompok Rentan Pasien Ini:
                  </strong>
                  <ul className="list-disc list-inside text-purple-900 space-y-1">
                    {aiAnalysisResult.vulnerableGroupConsiderations.map((v: string, i: number) => (
                      <li key={i}>{v}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
