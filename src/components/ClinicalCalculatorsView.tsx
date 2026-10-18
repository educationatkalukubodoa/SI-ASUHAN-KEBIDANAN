import React, { useState } from 'react';
import { calculateMAP, evaluateMEOWS, calculateHPL, calculateGestationalAge, calculateTBJ, calculatePoedjiRochjati } from '../utils/clinicalCalculators';
import { Calculator, Activity, Heart, AlertOctagon, CheckCircle2 } from 'lucide-react';

export const ClinicalCalculatorsView: React.FC = () => {
  // 1. MEOWS State
  const [meowsVitals, setMeowsVitals] = useState({
    systolic: 120,
    diastolic: 80,
    pulse: 82,
    respiratoryRate: 18,
    temperature: 36.6,
    consciousness: 'Compos Mentis' as const,
    fetalHeartRate: 140,
  });

  // 2. MAP State
  const [mapInput, setMapInput] = useState({ systolic: 150, diastolic: 95 });

  // 3. Naegele State
  const [hphtInput, setHphtInput] = useState<string>('2026-03-15');

  // 4. TBJ State
  const [tfuInput, setTfuInput] = useState<number>(30);
  const [headEngagedInput, setHeadEngagedInput] = useState<boolean>(false);

  // 5. KSPR State
  const [ksprAge, setKsprAge] = useState<number>(18);
  const [ksprGravida, setKsprGravida] = useState<number>(1);
  const [ksprPara, setKsprPara] = useState<number>(0);
  const [ksprHeight, setKsprHeight] = useState<number>(148);
  const [ksprLila, setKsprLila] = useState<number>(22.0);
  const [ksprHasPeb, setKsprHasPeb] = useState<boolean>(true);
  const [ksprHasHpp, setKsprHasHpp] = useState<boolean>(false);
  const [ksprHasScHistory, setKsprHasScHistory] = useState<boolean>(false);

  // Computations
  const computedMeows = evaluateMEOWS({
    ...meowsVitals,
    fundalHeight: 0,
  });
  const computedMap = calculateMAP(mapInput.systolic, mapInput.diastolic);
  const computedHpl = calculateHPL(hphtInput);
  const computedGestAge = calculateGestationalAge(hphtInput);
  const computedTbj = calculateTBJ(tfuInput, headEngagedInput);

  const computedKspr = calculatePoedjiRochjati({
    age: ksprAge,
    gravida: ksprGravida,
    para: ksprPara,
    height: ksprHeight,
    armCircumference: ksprLila,
    complexCategories: {
      isPreeclampsiaOrEclampsia: ksprHasPeb,
      isPostpartumHemorrhage: ksprHasHpp,
      isAntepartumHemorrhage: false,
      isSevereAnemiaOrKEK: ksprLila < 23.5,
      isPrematureRuptureOfMembranes: false,
      isDystociaOrObstructedLabor: false,
      isMaternalInfectionOrSepsis: false,
      hasMedicalComorbidities: false,
    },
    vulnerabilities: {
      isTeenagePregnancy: ksprAge < 20,
      isAdvancedMaternalAge: ksprAge >= 35,
      isTripleEliminationPositive: false,
      isDomesticViolenceVictim: false,
      isExtremePovertyOrPrasejahtera: false,
      hasDisability: false,
      isUnintendedPregnancy: false,
      hasBadObstetricHistory: ksprHasScHistory,
    },
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-4 bg-teal-900 text-white rounded-xl shadow-xs">
        <span className="text-xs uppercase tracking-wider text-teal-300 font-semibold block">
          Perhitungan Klinis & Triage Cepat
        </span>
        <h1 className="text-xl font-bold tracking-tight text-white mt-0.5">
          Kalkulator Medis Kebidanan Terintegrasi
        </h1>
        <p className="text-xs text-teal-100 mt-1 max-w-3xl">
          Alat bantu pengambilan keputusan klinis terstandar untuk deteksi dini kegawatdaruratan maternal
          (MEOWS), skrining preeklampsia (MAP), taksiran persalinan (Naegele), taksiran berat janin (TBJ),
          dan Kartu Skor Poedji Rochjati (KSPR).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CALCULATOR 1: MEOWS */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-700" />
              1. MEOWS (Modified Early Obstetric Warning Score)
            </h3>
            <span className="text-xs text-slate-500 font-mono">Standar Kemenkes / RCOG</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-600 font-medium block mb-1">TD Sistolik (mmHg)</label>
              <input
                type="number"
                value={meowsVitals.systolic}
                onChange={(e) => setMeowsVitals({ ...meowsVitals, systolic: parseInt(e.target.value) || 120 })}
                className="w-full p-2 border border-slate-300 rounded font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 font-medium block mb-1">TD Diastolik (mmHg)</label>
              <input
                type="number"
                value={meowsVitals.diastolic}
                onChange={(e) => setMeowsVitals({ ...meowsVitals, diastolic: parseInt(e.target.value) || 80 })}
                className="w-full p-2 border border-slate-300 rounded font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 font-medium block mb-1">Nadi / HR (bpm)</label>
              <input
                type="number"
                value={meowsVitals.pulse}
                onChange={(e) => setMeowsVitals({ ...meowsVitals, pulse: parseInt(e.target.value) || 80 })}
                className="w-full p-2 border border-slate-300 rounded font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 font-medium block mb-1">Laju Napas (x/m)</label>
              <input
                type="number"
                value={meowsVitals.respiratoryRate}
                onChange={(e) => setMeowsVitals({ ...meowsVitals, respiratoryRate: parseInt(e.target.value) || 18 })}
                className="w-full p-2 border border-slate-300 rounded font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 font-medium block mb-1">Suhu (°C)</label>
              <input
                type="number"
                step="0.1"
                value={meowsVitals.temperature}
                onChange={(e) => setMeowsVitals({ ...meowsVitals, temperature: parseFloat(e.target.value) || 36.5 })}
                className="w-full p-2 border border-slate-300 rounded font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 font-medium block mb-1">DJJ Janin (bpm)</label>
              <input
                type="number"
                value={meowsVitals.fetalHeartRate}
                onChange={(e) => setMeowsVitals({ ...meowsVitals, fetalHeartRate: parseInt(e.target.value) || 140 })}
                className="w-full p-2 border border-slate-300 rounded font-mono"
              />
            </div>
            <div className="col-span-2 sm:col-span-3">
              <label className="text-slate-600 font-medium block mb-1">Tingkat Kesadaran</label>
              <select
                value={meowsVitals.consciousness}
                onChange={(e) => setMeowsVitals({ ...meowsVitals, consciousness: e.target.value as any })}
                className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
              >
                <option value="Compos Mentis">Compos Mentis (Sadar Penuh)</option>
                <option value="Apatis">Apatis (Acuh tak acuh)</option>
                <option value="Somnolen">Somnolen (Mengantuk berat tapi bisa dibangunkan)</option>
                <option value="Sopor">Sopor (Hanya respon rangsang nyeri)</option>
                <option value="Koma">Koma (Tidak sadar sama sekali)</option>
              </select>
            </div>
          </div>

          {/* MEOWS Result Card */}
          <div className={`p-4 border rounded-lg space-y-1 text-xs ${computedMeows.badgeColor}`}>
            <div className="flex items-center justify-between">
              <strong className="text-sm font-bold">Hasil Evaluasi MEOWS: {computedMeows.alertLevel}</strong>
              <span className="font-mono font-bold text-base">Skor: {computedMeows.totalScore}</span>
            </div>
            <p className="pt-1">{computedMeows.recommendation}</p>
            <div className="text-[11px] opacity-80 pt-1">
              Parameter Kuning (Waspada): {computedMeows.yellowTriggers} · Parameter Merah (Bahaya): {computedMeows.redTriggers}
            </div>
          </div>
        </div>

        {/* CALCULATOR 2: MAP & PREECLAMPSIA */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-teal-700" />
              2. Mean Arterial Pressure (MAP) & Skrining PEB
            </h3>
            <span className="text-xs text-slate-500 font-mono">Formula: (2D + S) / 3</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-600 font-medium block mb-1">Tekanan Sistolik (mmHg)</label>
              <input
                type="number"
                value={mapInput.systolic}
                onChange={(e) => setMapInput({ ...mapInput, systolic: parseInt(e.target.value) || 120 })}
                className="w-full p-2 border border-slate-300 rounded font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 font-medium block mb-1">Tekanan Diastolik (mmHg)</label>
              <input
                type="number"
                value={mapInput.diastolic}
                onChange={(e) => setMapInput({ ...mapInput, diastolic: parseInt(e.target.value) || 80 })}
                className="w-full p-2 border border-slate-300 rounded font-mono"
              />
            </div>
          </div>

          {/* MAP Result */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Nilai MAP Terhitung:</span>
              <strong className={`text-xl font-mono tabular-nums ${computedMap >= 90 ? 'text-rose-700' : 'text-slate-900'}`}>
                {computedMap} mmHg
              </strong>
            </div>

            {computedMap >= 90 ? (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-900 space-y-0.5">
                <strong className="block font-bold">Peringatan: MAP &gt;= 90 mmHg</strong>
                <p>
                  Indikator kuat risiko tinggi preeklampsia. Bila usia kehamilan 16-20 minggu, pertimbangkan
                  pemberian Aspirin dosis rendah (80-150 mg/hari) dan suplementasi Kalsium 1.5-2.0 g/hari sesuai PNPK POGI.
                </p>
              </div>
            ) : (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-900">
                <span className="font-semibold">Nilai MAP dalam rentang normal (&lt; 90 mmHg).</span> Lanjutkan pemantauan tensi rutin.
              </div>
            )}
          </div>
        </div>

        {/* CALCULATOR 3: Naegele HPL & UK */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-teal-700" />
              3. Rumus Naegele (HPL & Usia Kehamilan)
            </h3>
            <span className="text-xs text-slate-500 font-mono">Hari + 7, Bulan - 3, Tahun + 1</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-600 font-medium block mb-1">Tanggal Hari Pertama Haid Terakhir (HPHT):</label>
              <input
                type="date"
                value={hphtInput}
                onChange={(e) => setHphtInput(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded font-mono text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div>
                <span className="text-slate-500 block">Taksiran Persalinan (HPL):</span>
                <strong className="text-base font-mono text-teal-800">{computedHpl || '-'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Usia Kehamilan Hari Ini:</span>
                <strong className="text-base font-mono text-slate-900">{computedGestAge.text}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* CALCULATOR 4: TBJ Johnson-Toshack */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-teal-700" />
              4. Taksiran Berat Janin (TBJ) Johnson-Toshack
            </h3>
            <span className="text-xs text-slate-500 font-mono">(TFU - n) x 155 gram</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 font-medium block mb-1">Tinggi Fundus Uteri (TFU dalam cm):</label>
                <input
                  type="number"
                  min={15}
                  max={45}
                  value={tfuInput}
                  onChange={(e) => setTfuInput(parseInt(e.target.value) || 28)}
                  className="w-full p-2 border border-slate-300 rounded font-mono"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Kepala Janin Terhadap Panggul:</label>
                <select
                  value={headEngagedInput ? 'true' : 'false'}
                  onChange={(e) => setHeadEngagedInput(e.target.value === 'true')}
                  className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                >
                  <option value="false">Belum Masuk PAP (n = 12)</option>
                  <option value="true">Sudah Masuk PAP (n = 11)</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <span className="text-slate-600">Perkiraan Berat Janin (TBJ):</span>
              <strong className="text-xl font-mono text-teal-800 tabular-nums">
                {computedTbj} gram
              </strong>
            </div>
            <p className="text-[11px] text-slate-500 italic">
              *Toleransi deviasi TBJ formula Johnson-Toshack berkisar +- 10-15%. Jika TBJ &gt; 4.000 g waspadai makrosomia & distosia bahu.
            </p>
          </div>
        </div>

        {/* CALCULATOR 5: Poedji Rochjati (Full Width) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-teal-700" />
              5. Skrining Kartu Skor Poedji Rochjati (KSPR)
            </h3>
            <span className="text-xs text-slate-500 font-mono">Skrining Standar Bidan Indonesia</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="text-slate-600 font-medium block mb-1">Usia Ibu (Thn)</label>
              <input
                type="number"
                value={ksprAge}
                onChange={(e) => setKsprAge(parseInt(e.target.value) || 20)}
                className="w-full p-2 border border-slate-300 rounded font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 font-medium block mb-1">Tinggi Badan (cm)</label>
              <input
                type="number"
                value={ksprHeight}
                onChange={(e) => setKsprHeight(parseInt(e.target.value) || 150)}
                className="w-full p-2 border border-slate-300 rounded font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 font-medium block mb-1">LILA (cm)</label>
              <input
                type="number"
                step="0.1"
                value={ksprLila}
                onChange={(e) => setKsprLila(parseFloat(e.target.value) || 24)}
                className="w-full p-2 border border-slate-300 rounded font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 font-medium block mb-1">Jumlah Anak (Para)</label>
              <input
                type="number"
                value={ksprPara}
                onChange={(e) => setKsprPara(parseInt(e.target.value) || 0)}
                className="w-full p-2 border border-slate-300 rounded font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
            <label className="flex items-center gap-2 cursor-pointer p-2 bg-slate-50 rounded border border-slate-200">
              <input
                type="checkbox"
                checked={ksprHasPeb}
                onChange={(e) => setKsprHasPeb(e.target.checked)}
                className="rounded text-teal-700"
              />
              <span>Tensi Tinggi / Preeklampsia (+8)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-2 bg-slate-50 rounded border border-slate-200">
              <input
                type="checkbox"
                checked={ksprHasHpp}
                onChange={(e) => setKsprHasHpp(e.target.checked)}
                className="rounded text-teal-700"
              />
              <span>Perdarahan HPP / Antepartum (+8)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-2 bg-slate-50 rounded border border-slate-200">
              <input
                type="checkbox"
                checked={ksprHasScHistory}
                onChange={(e) => setKsprHasScHistory(e.target.checked)}
                className="rounded text-teal-700"
              />
              <span>Riwayat Bekas SC / Abortus (+4)</span>
            </label>
          </div>

          {/* Result KSPR */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-500 block">Kategori Risiko Poedji Rochjati:</span>
              <strong className="text-base text-slate-900 block font-bold mt-0.5">
                {computedKspr.category}
              </strong>
              <p className="text-slate-600 mt-1">{computedKspr.description}</p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <span className="text-slate-500 block">Total Skor KSPR:</span>
              <strong className="text-2xl font-mono text-teal-800 tabular-nums">
                {computedKspr.score}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
