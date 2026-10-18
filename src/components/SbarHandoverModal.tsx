import React, { useState, useRef } from 'react';
import { Patient } from '../types/midwifery';
import { calculateMAP, evaluateMEOWS, calculatePoedjiRochjati, calculateTBJ } from '../utils/clinicalCalculators';
import { X, Printer, Download, Copy, Check, FileText, Send, AlertTriangle, ShieldCheck, UserCheck, Stethoscope, Clock } from 'lucide-react';

interface SbarHandoverModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
}

export const SbarHandoverModal: React.FC<SbarHandoverModalProps> = ({ patient, isOpen, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Handover Context Metadata
  const [handoverType, setHandoverType] = useState<'shift' | 'referral' | 'consultation'>('shift');
  const [handoverDate, setHandoverDate] = useState<string>(
    new Date().toISOString().replace('T', ' ').substring(0, 16)
  );
  const [sourceUnit, setSourceUnit] = useState<string>('Ruang Bersalin (VK) / PONED');
  const [destinationUnit, setDestinationUnit] = useState<string>('Sift Jaga Berikutnya / IGD PONEK RS');
  const [senderName, setSenderName] = useState<string>('Bdn. Penanggung Jawab Pasien');
  const [receiverName, setReceiverName] = useState<string>('Bdn. / Dr. Penerima Jaga');

  // Additional customized notes
  const [additionalRecommendation, setAdditionalRecommendation] = useState<string>(
    'Lanjutkan pemantauan ketat tanda vital tiap 15-30 menit, pastikan infus mengalir lancar, dan laporkan segera bila terjadi penurunan kondisi.'
  );

  if (!isOpen) return null;

  const mapValue = calculateMAP(patient.vitals.systolic, patient.vitals.diastolic);
  const meows = evaluateMEOWS(patient.vitals);
  const kspr = calculatePoedjiRochjati(patient);
  const tbj = patient.vitals.fundalHeight ? calculateTBJ(patient.vitals.fundalHeight, false) : 0;

  // Build structured SBAR contents
  const situationDiagnosis = `G${patient.gravida}P${patient.para}A${patient.abortus}, Usia ${patient.age} tahun, Hamil ${patient.gestationalAgeWeeks} minggu dengan ${
    patient.complexCategories.isPreeclampsiaOrEclampsia
      ? 'Preeklampsia Berat (PEB) / Ancaman Eklampsia'
      : patient.complexCategories.isPostpartumHemorrhage
      ? 'Perdarahan Pascapersalinan (HPP / Atonia Uteri)'
      : patient.complexCategories.isAntepartumHemorrhage
      ? 'Perdarahan Antepartum'
      : patient.complexCategories.isDystociaOrObstructedLabor
      ? 'Partus Tak Maju / Kelainan Letak'
      : 'Kehamilan Berisiko Tinggi'
  } ${patient.vulnerabilities.isTeenagePregnancy ? '+ Kehamilan Remaja' : ''} ${
    patient.vulnerabilities.isTripleEliminationPositive ? '+ Triple Eliminasi' : ''
  } ${patient.complexCategories.isSevereAnemiaOrKEK ? '+ KEK/Anemia' : ''}`;

  const backgroundDetails = [
    `HPHT: ${patient.hpht || '-'} | Taksiran Persalinan (HPL): ${patient.hpl || '-'}`,
    `Status Gizi: LILA ${patient.armCircumference} cm (${patient.armCircumference < 23.5 ? 'KEK' : 'Normal'}), BB: ${patient.weight} kg, TB: ${patient.height} cm`,
    `Riwayat Obstetri: ${patient.vulnerabilities.hasBadObstetricHistory ? 'Ada riwayat obstetri buruk / bekas SC / abortus' : 'Tidak ada riwayat SC / komplikasi masa lalu'}`,
    `Faktor Kelompok Rentan: ${
      [
        patient.vulnerabilities.isTeenagePregnancy && 'Kehamilan Remaja (< 20 thn)',
        patient.vulnerabilities.isAdvancedMaternalAge && 'Usia Lanjut Reproduksi (>= 35 thn)',
        patient.vulnerabilities.isTripleEliminationPositive && 'Triple Eliminasi Reaktif',
        patient.vulnerabilities.isDomesticViolenceVictim && 'Korban KDRT / Perlindungan Khusus',
        patient.vulnerabilities.isExtremePovertyOrPrasejahtera && 'Keluarga Prasejahtera (PBI JKN)',
        patient.vulnerabilities.hasDisability && 'Penyandang Disabilitas',
      ]
        .filter(Boolean)
        .join(', ') || 'Tidak ada faktor kerentanan spesifik teridentifikasi'
    }`,
    `Riwayat Alergi: Tidak ada riwayat alergi obat/makanan yang dilaporkan`,
    patient.soapHistory[0]?.penatalaksanaan?.length
      ? `Terapi Terakhir Diberikan: ${patient.soapHistory[0].penatalaksanaan.slice(0, 3).join('; ')}`
      : 'Terapi Terakhir: Stabilisasi tanda vital dan pemantauan cairan',
  ];

  const assessmentDetails = [
    `TTV Terkini: TD ${patient.vitals.systolic}/${patient.vitals.diastolic} mmHg (MAP ${mapValue} mmHg) | Nadi ${patient.vitals.pulse} bpm | RR ${patient.vitals.respiratoryRate} x/m | Suhu ${patient.vitals.temperature}°C | Kesadaran: ${patient.vitals.consciousness}`,
    `Skor MEOWS: ${meows.totalScore} (${meows.alertLevel}) | Skor KSPR: ${kspr.score} (${kspr.category})`,
    `Pemeriksaan Janin & Uterus: TFU ${patient.vitals.fundalHeight || '-'} cm (TBJ ~${tbj} gram) | DJJ ${patient.vitals.fetalHeartRate || '-'} bpm (${(patient.vitals.fetalHeartRate || 0) >= 120 && (patient.vitals.fetalHeartRate || 0) <= 160 ? 'Reguler / Normal' : 'Perlu Atensi'})`,
    `His & Kemajuan: ${patient.vitals.contractions || 'Belum ada his teratur'} | Pembukaan Serviks: ${patient.vitals.cervicalDilation !== undefined ? `${patient.vitals.cervicalDilation} cm` : 'Belum dilakukan VT'}`,
    `Laboratorium: Protein Urin: ${patient.labs.proteinuria || '-'} | Hb: ${patient.labs.hemoglobin ? `${patient.labs.hemoglobin} g/dL` : '-'} | Gol. Darah: ${patient.labs.bloodGroup || '-'} | Triple Eliminasi: HBsAg (${patient.labs.hbsagStatus}), HIV (${patient.labs.hivStatus}), Sifilis (${patient.labs.syphilisStatus})`,
  ];

  const recommendationDetails = [
    `Rencana Tindakan: ${additionalRecommendation}`,
    `Target Klinis: Tekanan darah stabil < 140/90 mmHg, DJJ janin dalam rentang normal 120-160 bpm, balance cairan urin minimal >= 30 ml/jam via kateter.`,
    `Kriteria Eskalasi Cito: Segera lapor Dokter Spesialis / Dokter Jaga bila MAP >= 90 mmHg atau sistolik >= 160/110, pemicu merah MEOWS >= 1, perdarahan aktif memancar, atau timbul kejang.`,
    handoverType === 'referral'
      ? `Kesiapan Transportasi BAKSOKUDA: Bidan pendamping siaga, tabung O2 terisi, infus MgSO4/RL berjalan, keluarga & donor darah ikut serta, jaminan BPJS/KIS siap.`
      : `Pemberian Obat Sift Berikutnya: Pastikan pemberian infus dan obat lanjutan sesuai jadwal resep.`,
  ];

  // Generate plain text report
  const generateTextReport = () => {
    return `================================================================================
LEMBAR KOMUNIKASI EFEKTIF TIMBANG TERIMA PASIEN (SBAR HANDOVER)
Standar Keselamatan Pasien Maternal (Kemenkes RI · KARS · IBI · POGI)
================================================================================
Tanggal & Waktu    : ${handoverDate}
Jenis Handover     : ${handoverType === 'shift' ? 'Timbang Terima Sift Jaga (Bedside Handover)' : handoverType === 'referral' ? 'Rujukan Pasien Antar Fasyankes (Transfer)' : 'Konsultasi Telepon Dokter Spesialis (TBAK/SBAR)'}
Unit Asal          : ${sourceUnit}
Unit/RS Tujuan     : ${destinationUnit}
Bidan Pengirim     : ${senderName}
Penerima Handover  : ${receiverName}
--------------------------------------------------------------------------------

[S] SITUATION (SITUASI KLINIS SAAT INI)
--------------------------------------------------------------------------------
Identitas Pasien   : ${patient.name} (${patient.age} tahun)
No. Rekam Medis    : ${patient.medicalRecordNo} | NIK: ${patient.nik}
Alamat / Wilayah   : ${patient.address || patient.neighborhood}
Keluhan Utama      : ${patient.chiefComplaint}
Diagnosis Kerja    : ${situationDiagnosis}
Tingkat Urgensi    : ${patient.status} (MEOWS Skor: ${meows.totalScore} - ${meows.alertLevel})

[B] BACKGROUND (LATAR BELAKANG KLINIS & RIWAYAT)
--------------------------------------------------------------------------------
${backgroundDetails.map((b) => `· ${b}`).join('\n')}

[A] ASSESSMENT (PENILAIAN TANDA VITAL & HASIL PEMERIKSAAN)
--------------------------------------------------------------------------------
${assessmentDetails.map((a) => `· ${a}`).join('\n')}

[R] RECOMMENDATION (REKOMENDASI & TINDAKAN LANJUTAN)
--------------------------------------------------------------------------------
${recommendationDetails.map((r) => `· ${r}`).join('\n')}

--------------------------------------------------------------------------------
LEMBAR SERAH TERIMA & VERIFIKASI TBAK (TULIS - BACA - KONFIRMASI)
Bidan yang Menyerahkan:                       Bidan / Dokter yang Menerima:


( ${senderName} )                             ( ${receiverName} )
Tanggal & Jam: ${handoverDate}               Tanggal & Jam: ____________________
================================================================================`;
  };

  // Copy plain text to clipboard
  const handleCopyText = () => {
    const text = generateTextReport();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Download plain text file
  const handleDownloadTxt = () => {
    const text = generateTextReport();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SBAR_${patient.name.replace(/\s+/g, '_')}_${patient.medicalRecordNo}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  // Download formatted Word / HTML file
  const handleDownloadDoc = () => {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>SBAR Handover - ${patient.name}</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.4; color: #111; margin: 20px; }
  h1 { font-size: 14pt; margin-bottom: 2px; text-transform: uppercase; color: #0f766e; }
  .subtitle { font-size: 9pt; color: #555; margin-bottom: 15px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
  th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; font-size: 10pt; }
  th { background-color: #f1f5f9; font-weight: bold; width: 25%; }
  .section-title { background-color: #0f766e; color: white; padding: 5px 8px; font-weight: bold; font-size: 11pt; margin-top: 15px; margin-bottom: 6px; }
  .highlight { font-weight: bold; color: #b91c1c; }
  ul { margin: 4px 0 8px 20px; padding: 0; }
  li { margin-bottom: 3px; }
  .sig-table { margin-top: 25px; border: none; }
  .sig-table td { border: none; padding: 10px; width: 50%; text-align: center; }
</style>
</head>
<body>
  <h1>Lembar Komunikasi Efektif Timbang Terima Pasien (SBAR Handover)</h1>
  <div class="subtitle">Standar Keselamatan Pasien Maternal (Kemenkes RI · KARS · IBI · POGI)</div>
  
  <table>
    <tr><th>Tanggal & Jam Handover</th><td>${handoverDate}</td><th>Jenis Handover</th><td>${handoverType.toUpperCase()}</td></tr>
    <tr><th>Unit / Fasyankes Asal</th><td>${sourceUnit}</td><th>Unit / RS Tujuan</th><td>${destinationUnit}</td></tr>
    <tr><th>Bidan yang Menyerahkan</th><td>${senderName}</td><th>Bidan / Dokter Penerima</th><td>${receiverName}</td></tr>
  </table>

  <div class="section-title">S - SITUATION (SITUASI PASIEN SAAT INI)</div>
  <table>
    <tr><th>Nama Pasien / Usia</th><td><b>${patient.name}</b> (${patient.age} tahun)</td><th>No. RM / NIK</th><td>${patient.medicalRecordNo} / ${patient.nik}</td></tr>
    <tr><th>Diagnosis Kerja</th><td colspan="3"><b>${situationDiagnosis}</b></td></tr>
    <tr><th>Keluhan Utama</th><td colspan="3">${patient.chiefComplaint}</td></tr>
    <tr><th>Status Urgensi / MEOWS</th><td colspan="3"><b>${patient.status}</b> · Skor MEOWS: ${meows.totalScore} (${meows.alertLevel})</td></tr>
  </table>

  <div class="section-title">B - BACKGROUND (LATAR BELAKANG KLINIS & RIWAYAT)</div>
  <ul>
    ${backgroundDetails.map((b) => `<li>${b}</li>`).join('')}
  </ul>

  <div class="section-title">A - ASSESSMENT (PENILAIAN TANDA VITAL & TEMUAN PEMERIKSAAN)</div>
  <ul>
    ${assessmentDetails.map((a) => `<li>${a}</li>`).join('')}
  </ul>

  <div class="section-title">R - RECOMMENDATION (REKOMENDASI & RENCANA TINDAKAN LANJUTAN)</div>
  <ul>
    ${recommendationDetails.map((r) => `<li>${r}</li>`).join('')}
  </ul>

  <table class="sig-table">
    <tr>
      <td>
        Bidan yang Menyerahkan:<br><br><br><br>
        <b>( ${senderName} )</b><br>
        Tgl: ${handoverDate}
      </td>
      <td>
        Bidan / Dokter yang Menerima:<br><br><br><br>
        <b>( ${receiverName} )</b><br>
        Tgl: ____________________
      </td>
    </tr>
  </table>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SBAR_Handover_${patient.name.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  // Trigger Native Clean Print Dialog
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 print:p-0 print:bg-white print:static print:z-auto print:block print:inset-auto">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-2xl border border-slate-300 max-h-[94vh] print:max-h-none print:h-auto print:border-none print:shadow-none print:rounded-none flex flex-col overflow-hidden print:overflow-visible">
        {/* Header Bar (Hidden on print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-teal-600 flex items-center justify-center text-white font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">Lembar SBAR Handover Timbang Terima Pasien</h2>
                <span className="text-xs bg-teal-800 text-teal-100 px-2 py-0.5 rounded font-mono">
                  {patient.medicalRecordNo}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Komunikasi Efektif Keselamatan Pasien Maternal · Standar Kemenkes RI, KARS, IBI & POGI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded transition-colors whitespace-nowrap shadow-xs"
              title="Buka dialog print browser untuk cetak atau simpan sebagai PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
            <button
              onClick={handleDownloadDoc}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded transition-colors whitespace-nowrap"
              title="Unduh laporan berformat Microsoft Word (.doc)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Word (.doc)</span>
            </button>
            <button
              onClick={handleDownloadTxt}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded transition-colors whitespace-nowrap border border-slate-700"
              title="Unduh laporan dalam format teks (.txt)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Teks (.txt)</span>
            </button>
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded transition-colors whitespace-nowrap border border-slate-700"
              title="Salin isi lembar SBAR ke papan klip (clipboard)"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Handover Customization Inputs (No-Print) */}
        <div className="no-print bg-slate-50 border-b border-slate-200 p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="text-slate-600 font-medium block mb-1">Jenis Timbang Terima</label>
              <select
                value={handoverType}
                onChange={(e) => {
                  const val = e.target.value as 'shift' | 'referral' | 'consultation';
                  setHandoverType(val);
                  if (val === 'shift') {
                    setDestinationUnit('Sift Jaga Berikutnya');
                  } else if (val === 'referral') {
                    setDestinationUnit('IGD PONEK RS Rujukan');
                  } else if (val === 'consultation') {
                    setDestinationUnit('Dr. Sp.OG Konsultan Jaga');
                  }
                }}
                className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
              >
                <option value="shift">Timbang Terima Sift Jaga (Bedside)</option>
                <option value="referral">Rujukan Antar Fasyankes (Transfer)</option>
                <option value="consultation">Konsultasi Telepon Dokter (TBAK)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Tanggal & Waktu</label>
              <input
                type="text"
                value={handoverDate}
                onChange={(e) => setHandoverDate(e.target.value)}
                className="w-full p-1.5 border border-slate-300 rounded font-mono text-xs bg-white"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Bidan yang Menyerahkan</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full p-1.5 border border-slate-300 rounded text-xs bg-white"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Bidan / Dokter Penerima</label>
              <input
                type="text"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                className="w-full p-1.5 border border-slate-300 rounded text-xs bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-600 font-medium block mb-1">Unit / Fasyankes Asal Pengirim:</label>
              <input
                type="text"
                value={sourceUnit}
                onChange={(e) => setSourceUnit(e.target.value)}
                placeholder="misal: Ruang Bersalin (VK) / BPM / Puskesmas"
                className="w-full p-1.5 border border-slate-300 rounded text-xs bg-white"
              />
            </div>
            <div>
              <label className="text-slate-600 font-medium block mb-1">Unit / RS Tujuan Penerima:</label>
              <input
                type="text"
                value={destinationUnit}
                onChange={(e) => setDestinationUnit(e.target.value)}
                placeholder="misal: Sift Berikutnya / IGD PONEK RS Rujukan"
                className="w-full p-1.5 border border-slate-300 rounded text-xs bg-white"
              />
            </div>
          </div>
        </div>

        {/* Printable SBAR Document Body */}
        <div ref={printRef} className="print-container p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-xs print:p-0 print:text-black print:overflow-visible">
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-3 text-center space-y-1">
            <h1 className="text-base md:text-lg font-bold tracking-tight text-slate-900 uppercase">
              Lembar Komunikasi Efektif Timbang Terima Pasien (SBAR Handover)
            </h1>
            <p className="text-xs text-slate-600">
              Standar Keselamatan Pasien Maternal · Berdasarkan Pedoman Kemenkes RI, KARS, IBI, dan POGI
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-mono pt-1">
              <span>Waktu: {handoverDate}</span>
              <span>·</span>
              <span>Unit Asal: {sourceUnit}</span>
              <span>·</span>
              <span>Tujuan: {destinationUnit}</span>
              <span>·</span>
              <span>Tipe: {handoverType === 'shift' ? 'Sift Handover' : handoverType === 'referral' ? 'Transfer Rujukan' : 'Konsultasi'}</span>
            </div>
          </div>

          {/* SBAR Grid Blocks */}
          <div className="space-y-4">
            {/* S: SITUATION */}
            <div className="border border-slate-300 rounded-lg overflow-hidden print-break-inside-avoid">
              <div className="bg-teal-800 text-white px-4 py-2 flex items-center justify-between font-bold text-xs uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white text-teal-900 flex items-center justify-center text-xs font-black">
                    S
                  </span>
                  Situation (Situasi Klinis Pasien Saat Ini)
                </span>
                <span className="font-mono text-[11px] normal-case bg-teal-900 px-2 py-0.5 rounded">
                  MEOWS: {meows.totalScore} ({meows.alertLevel})
                </span>
              </div>
              <div className="p-4 bg-white space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Nama Pasien: </span>
                    <strong className="text-slate-900 text-sm font-bold">{patient.name}</strong>
                    <span className="text-slate-500 font-mono ml-1">({patient.age} tahun)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">No. RM / NIK: </span>
                    <span className="font-mono text-slate-900">{patient.medicalRecordNo} / {patient.nik}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-slate-500 font-medium">Diagnosis Kerja Kebidanan: </span>
                    <strong className="text-teal-950 font-bold block mt-0.5 text-xs">
                      {situationDiagnosis}
                    </strong>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-slate-500 font-medium">Keluhan Utama / Alasan Handover: </span>
                    <p className="text-slate-800 mt-0.5">{patient.chiefComplaint}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* B: BACKGROUND */}
            <div className="border border-slate-300 rounded-lg overflow-hidden print-break-inside-avoid">
              <div className="bg-slate-800 text-white px-4 py-2 flex items-center justify-between font-bold text-xs uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white text-slate-900 flex items-center justify-center text-xs font-black">
                    B
                  </span>
                  Background (Latar Belakang Klinis & Riwayat)
                </span>
                <span className="font-mono text-[11px] normal-case bg-slate-900 px-2 py-0.5 rounded">
                  KSPR: {kspr.score} ({kspr.category})
                </span>
              </div>
              <div className="p-4 bg-white space-y-2">
                <ul className="space-y-1.5 text-xs text-slate-800">
                  {backgroundDetails.map((bg, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-teal-700 font-bold mt-0.5">·</span>
                      <span>{bg}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* A: ASSESSMENT */}
            <div className="border border-slate-300 rounded-lg overflow-hidden print-break-inside-avoid">
              <div className="bg-teal-900 text-white px-4 py-2 flex items-center justify-between font-bold text-xs uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white text-teal-950 flex items-center justify-center text-xs font-black">
                    A
                  </span>
                  Assessment (Penilaian Tanda Vital & Temuan Pemeriksaan)
                </span>
                <span className="font-mono text-[11px] normal-case bg-teal-950 px-2 py-0.5 rounded">
                  MAP: {mapValue} mmHg {mapValue >= 90 ? '(Tinggi / PEB)' : '(Normal)'}
                </span>
              </div>
              <div className="p-4 bg-white space-y-3">
                {/* Vitals Mini Table */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center border border-slate-200 rounded p-2 bg-slate-50 font-mono text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Tekanan Darah</span>
                    <strong className={patient.vitals.systolic >= 140 ? 'text-rose-700 font-bold' : 'text-slate-900'}>
                      {patient.vitals.systolic}/{patient.vitals.diastolic}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">MAP (Mean)</span>
                    <strong className={mapValue >= 90 ? 'text-rose-700 font-bold' : 'text-slate-900'}>
                      {mapValue}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Nadi / HR</span>
                    <strong className="text-slate-900">{patient.vitals.pulse} bpm</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Laju Napas</span>
                    <strong className="text-slate-900">{patient.vitals.respiratoryRate} x/m</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Suhu Tubuh</span>
                    <strong className="text-slate-900">{patient.vitals.temperature} °C</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">DJJ Janin</span>
                    <strong className="text-teal-800 font-bold">{patient.vitals.fetalHeartRate || '-'} bpm</strong>
                  </div>
                </div>

                {/* Additional Clinical Findings */}
                <ul className="space-y-1.5 text-xs text-slate-800 pt-1">
                  {assessmentDetails.slice(1).map((as, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-teal-700 font-bold mt-0.5">·</span>
                      <span>{as}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* R: RECOMMENDATION */}
            <div className="border border-slate-300 rounded-lg overflow-hidden print-break-inside-avoid">
              <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between font-bold text-xs uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white text-slate-950 flex items-center justify-center text-xs font-black">
                    R
                  </span>
                  Recommendation (Rekomendasi & Rencana Tindakan Lanjutan)
                </span>
                <span className="font-mono text-[11px] normal-case bg-slate-800 px-2 py-0.5 rounded">
                  Eskalasi Klinis Siaga
                </span>
              </div>
              <div className="p-4 bg-white space-y-3">
                <ul className="space-y-2 text-xs text-slate-800">
                  {recommendationDetails.map((rc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-700 font-bold mt-0.5">·</span>
                      <span>{rc}</span>
                    </li>
                  ))}
                </ul>

                {/* Interactive editable note for live adjustment */}
                <div className="no-print pt-2 border-t border-slate-100">
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Edit / Tambah Catatan Instruksi Khusus Penerima:
                  </label>
                  <textarea
                    rows={2}
                    value={additionalRecommendation}
                    onChange={(e) => setAdditionalRecommendation(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Verification & Signature Section */}
          <div className="pt-6 border-t-2 border-slate-200 print-break-inside-avoid">
            <div className="text-center font-bold text-xs text-slate-900 uppercase tracking-wider mb-4">
              Lembar Verifikasi Serah Terima Klinis (TBAK: Tulis - Baca - Konfirmasi)
            </div>
            <div className="grid grid-cols-2 gap-8 text-center text-xs">
              <div className="space-y-12">
                <span className="text-slate-600 block">Bidan / Petugas yang Menyerahkan:</span>
                <div>
                  <strong className="text-slate-900 block font-bold underline">( {senderName} )</strong>
                  <span className="text-[11px] text-slate-500 font-mono">Waktu: {handoverDate}</span>
                </div>
              </div>

              <div className="space-y-12">
                <span className="text-slate-600 block">Bidan / Dokter yang Menerima:</span>
                <div>
                  <strong className="text-slate-900 block font-bold underline">( {receiverName} )</strong>
                  <span className="text-[11px] text-slate-500 font-mono">Konfirmasi Verifikasi TBAK (+)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions Bar (No-Print) */}
        <div className="no-print bg-slate-100 border-t border-slate-200 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 text-[11px]">
            Dokumen SBAR ini siap dicetak langsung ke PDF atau printer fisik tanpa elemen layar yang mengganggu.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Buka Dialog Cetak (Print / Simpan PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
