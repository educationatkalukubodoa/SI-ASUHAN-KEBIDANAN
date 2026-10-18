import React, { useState } from 'react';
import { X, AlertOctagon, CheckCircle2, PhoneCall, ShieldAlert, Heart, Syringe, Clock } from 'lucide-react';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'peb' | 'hpp' | 'syok' | 'bbl'>('peb');
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(300); // 5 min for IV bolus MgSO4 or KBI

  React.useEffect(() => {
    let interval: any = null;
    if (timerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, secondsLeft]);

  const startTimer = (durationSeconds: number) => {
    setSecondsLeft(durationSeconds);
    setTimerRunning(true);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setSecondsLeft(300);
  };

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-rose-300 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-rose-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-6 h-6 text-rose-200" />
            <div>
              <h2 className="text-lg font-bold tracking-tight">KODE MERAH OBSTETRI: Panduan Tindakan Segera</h2>
              <p className="text-xs text-rose-100">
                Langkah Cepat Penanganan Gawat Darurat Maternal & Neonatal · Fasyankes & Praktik Bidan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-rose-200 hover:text-white p-1 rounded-md hover:bg-rose-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('peb')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === 'peb'
                ? 'bg-white text-rose-700 border-t-2 border-rose-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            PEB & Eklampsia (MgSO4)
          </button>
          <button
            onClick={() => setActiveTab('hpp')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === 'hpp'
                ? 'bg-white text-rose-700 border-t-2 border-rose-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Perdarahan HPP / Atonia (4T)
          </button>
          <button
            onClick={() => setActiveTab('syok')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === 'syok'
                ? 'bg-white text-rose-700 border-t-2 border-rose-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Syok & Resusitasi Cairan
          </button>
          <button
            onClick={() => setActiveTab('bbl')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === 'bbl'
                ? 'bg-white text-rose-700 border-t-2 border-rose-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Resusitasi Bayi Baru Lahir
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Real-time Timer Helper */}
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-rose-600" />
              <div>
                <span className="text-xs font-medium text-slate-700 block">
                  Penghitung Waktu Tindakan Cepat (5 Menit Bolus MgSO4 / KBI Uterus)
                </span>
                <span className="text-xl font-mono font-bold text-rose-700 tabular-nums">
                  {formatTimer(secondsLeft)}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {!timerRunning ? (
                <button
                  onClick={() => startTimer(300)}
                  className="px-3 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded hover:bg-rose-700 transition-colors"
                >
                  Mulai 5 Menit
                </button>
              ) : (
                <button
                  onClick={resetTimer}
                  className="px-3 py-1.5 bg-slate-700 text-white text-xs font-semibold rounded hover:bg-slate-800 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* TAB 1: PEB & Eklampsia */}
          {activeTab === 'peb' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block mb-1">1. Cek Syarat Mutlak</span>
                  <ul className="space-y-1 text-slate-700">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Refleks patella (+) kuat
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Pernapasan &gt;= 16 x/menit
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Urin &gt;= 30 ml/jam via kateter
                    </li>
                  </ul>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block mb-1">2. Dosis Awal (Loading)</span>
                  <p className="text-slate-700">
                    <strong className="text-slate-900">4 gram MgSO4 40%</strong> (10 ml) + 10 ml Aquabidest steril.
                    Suntikkan IV bolus perlahan selama <strong>5-10 menit</strong>.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block mb-1">3. Dosis Pemeliharaan</span>
                  <p className="text-slate-700">
                    <strong className="text-slate-900">6 gram MgSO4 40%</strong> (15 ml) dalam 500 ml Ringer Laktat.
                    Atur <strong>28 tetes/menit</strong> (1 gram/jam) selama 24 jam.
                  </p>
                </div>
              </div>

              {/* Antidote & Warning */}
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-lg flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 space-y-1">
                  <strong className="block text-sm font-bold text-amber-950">
                    ANTIDOTUM WAJIB TERSEDIA: Kalsium Glukonat 10%
                  </strong>
                  <p>
                    Jika terjadi henti napas, depresi pernapasan &lt; 16x/m, atau refleks patella menghilang:
                    <strong> HENTIKAN MgSO4 SEGERA</strong>. Berikan <strong>Kalsium Glukonat 10% 1 gram (10 ml)</strong> IV bolus perlahan dalam 3 menit.
                  </p>
                  <p className="font-semibold text-rose-800">
                    PERINGATAN: Pasien PEB/Eklampsia TIDAK BOLEH diberikan Ergometrin pada kala III/IV persalinan!
                  </p>
                </div>
              </div>

              {/* Blood Pressure Target */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
                <span className="font-bold text-slate-900">Terapi Antihipertensi: </span>
                Jika TD &gt;= 160/110 mmHg, berikan <strong>Nifedipin 10 mg oral</strong> (telan utuh, jangan dikunyah/sublingual). Ulangi setelah 30 menit jika TD belum turun ke target 140-150 / 90-100 mmHg.
              </div>
            </div>
          )}

          {/* TAB 2: HPP & Atonia Uteri */}
          {activeTab === 'hpp' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <span className="font-bold text-slate-900 block">Langkah A: Masase & KBI (Kompresi Bimanual Interna)</span>
                  <p className="text-slate-700">
                    1. Masase fundus uteri 15 detik.<br />
                    2. Kosongkan kandung kemih dengan foley kateter no. 16.<br />
                    3. Masukkan tangan sarung steril, kepalkan tinju di forniks anterior, tangan luar menekan fundus posterior selama <strong>5 menit</strong>.<br />
                    4. Bila berkontraksi: pertahankan 2 menit tambahan. Bila tidak: ajarkan keluarga KBE dan pasang tamponade kondom kateter.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <span className="font-bold text-slate-900 block">Langkah B: Medikamentosa Agresif</span>
                  <ul className="space-y-1 text-slate-700">
                    <li>· <strong>Oksitosin</strong>: 20-40 IU dalam 1000 ml RL tetesan cepat 60 tpm.</li>
                    <li>· <strong>Ergometrin</strong>: 0.2 mg IM (HANYA jika tidak ada riwayat hipertensi).</li>
                    <li>· <strong>Misoprostol</strong>: 800 - 1000 mcg per rektal.</li>
                    <li>· <strong>Asam Traneksamat</strong>: 1 gram (10 ml) IV bolus pelan dalam 10 menit.</li>
                  </ul>
                </div>
              </div>

              {/* Condom Catheter */}
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-900 space-y-1">
                <span className="font-bold text-teal-950 block">Balon Tamponade Kondom Kateter Hidrostatik Sederhana:</span>
                <p>
                  Ikat kondom steril pada ujung kateter foley dengan benang sutra DTT. Masukkan ke dalam kavum uteri hingga melewati OUI. Hubungkan dengan spuit 50 ml atau infus set, masukkan <strong>300 - 500 ml cairan NaCl 0.9% hangat</strong> perlahan sampai perdarahan berhenti. Fiksasi kateter pada paha dan rujuk segera ke RS.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Syok & Cairan */}
          {activeTab === 'syok' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <span className="font-bold text-slate-900 block text-sm">Resusitasi Syok Hipovolemik Maternal</span>
                <p className="text-slate-700">
                  Tanda Syok: Nadi &gt; 110 x/menit, Tekanan Sistolik &lt; 90 mmHg, Akral dingin pucat, Napas cepat &gt; 24 x/menit, Penurunan kesadaran.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                  <div className="p-2.5 bg-white border border-slate-200 rounded">
                    <strong>1. Dua Jalur IV Besar</strong>
                    <p className="text-slate-600">Gunakan abocath no. 16G atau 18G pada kedua ekstremitas atas.</p>
                  </div>
                  <div className="p-2.5 bg-white border border-slate-200 rounded">
                    <strong>2. Guyur 1 Liter Cepat</strong>
                    <p className="text-slate-600">Guyur Ringer Laktat hangat 1.000 ml dalam 15-20 menit pertama.</p>
                  </div>
                  <div className="p-2.5 bg-white border border-slate-200 rounded">
                    <strong>3. Oksigen & Hangatkan</strong>
                    <p className="text-slate-600">Pasang sungkup O2 6-8 Lpm, selimuti ibu, angkat kedua tungkai 30°.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BBL */}
          {activeTab === 'bbl' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <span className="font-bold text-slate-900 block text-sm">Algoritma Resusitasi Bayi Baru Lahir (Kemenkes / IDAI)</span>
                <div className="space-y-2 text-slate-700">
                  <div className="p-2 bg-white border border-slate-200 rounded">
                    <strong>30 Detik Pertama: Langkah Awal</strong>
                    <p>Hangatkan di bawah radian warmer, atur posisi kepala sedikit ekstensi, isap lendir mulut lalu hidung (jika ada sumbatan), keringkan sambil rangsang taktil, ganti kain basah.</p>
                  </div>
                  <div className="p-2 bg-white border border-slate-200 rounded">
                    <strong>Evaluasi Pernapasan & Denyut Jantung (Frekuensi Denyut Jantung / FDJ):</strong>
                    <p>Jika megap-megap / tidak bernapas ATAU FDJ &lt; 100 x/menit: Berikan <strong>Ventilasi Tekanan Positif (VTP)</strong> dengan balon dan sungkup 20-30x dalam 30 detik (tekanan 20-30 cmH2O).</p>
                  </div>
                  <div className="p-2 bg-white border border-slate-200 rounded">
                    <strong>Jika FDJ tetap &lt; 60 x/menit setelah VTP efektif:</strong>
                    <p>Lakukan kompresi dada terkoordinasi dengan VTP (rasio 3 kompresi : 1 ventilasi). Siapkan epinefrin bila diperlukan dan rujukan ke ruang NICU RS PONEK.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Referral Hotline Bar */}
          <div className="p-3 bg-slate-100 rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-800">
              <PhoneCall className="w-4 h-4 text-teal-700" />
              <span className="font-semibold">Kontak Siaga IGD PONEK Rujukan & Ambulans:</span>
              <span className="text-slate-600">IGD PONEK RSUD Terdekat · RSUP Rujukan Provinsi · Hotline Gawat Darurat PSC 119</span>
            </div>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-50 transition-colors font-medium"
            >
              Tutup Panduan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
