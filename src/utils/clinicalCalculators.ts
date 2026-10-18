import { Patient, Vitals } from '../types/midwifery';

/**
 * Calculate Mean Arterial Pressure (MAP)
 * Formula: (2 * Diastolic + Systolic) / 3
 * Normal: 70 - 100 mmHg. MAP >= 90 mmHg on trimester 2 indicates high risk of preeclampsia.
 */
export function calculateMAP(systolic: number, diastolic: number): number {
  if (!systolic || !diastolic) return 0;
  return Math.round(((2 * diastolic + systolic) / 3) * 10) / 10;
}

/**
 * Calculate Modified Early Obstetric Warning Score (MEOWS)
 * Standard trigger criteria based on UK RCOG / Kemenkes Maternal Early Warning System.
 * Normal: 0 (Hijau / Aman)
 * 1 parameter kuning = Waspada / Observasi berkala
 * 2 kuning atau 1 merah = Peringatan / Evaluasi Dokter / Siaga Rujukan
 * >= 2 merah = GAWAT DARURAT SEGERA (Tindakan emergensi PONED/PONEK)
 */
export interface MeowsEvaluation {
  totalScore: number;
  yellowTriggers: number;
  redTriggers: number;
  alertLevel: 'Normal' | 'Waspada (1 Kuning)' | 'Perhatian Tinggi (2+ Kuning / 1 Merah)' | 'Gawat Darurat Maternal (2+ Merah)';
  badgeColor: string;
  recommendation: string;
}

export function evaluateMEOWS(vitals: Vitals): MeowsEvaluation {
  let yellows = 0;
  let reds = 0;

  // 1. Respiratory Rate (x/menit)
  if (vitals.respiratoryRate < 10 || vitals.respiratoryRate >= 30) {
    reds += 1;
  } else if ((vitals.respiratoryRate >= 10 && vitals.respiratoryRate <= 14) || (vitals.respiratoryRate >= 21 && vitals.respiratoryRate <= 29)) {
    yellows += 1;
  }

  // 2. Heart Rate / Pulse (bpm)
  if (vitals.pulse < 40 || vitals.pulse >= 120) {
    reds += 1;
  } else if ((vitals.pulse >= 40 && vitals.pulse <= 50) || (vitals.pulse >= 100 && vitals.pulse <= 119)) {
    yellows += 1;
  }

  // 3. Systolic BP (mmHg)
  if (vitals.systolic < 90 || vitals.systolic >= 160) {
    reds += 1;
  } else if ((vitals.systolic >= 140 && vitals.systolic <= 159) || (vitals.systolic >= 90 && vitals.systolic <= 99)) {
    yellows += 1;
  }

  // 4. Diastolic BP (mmHg)
  if (vitals.diastolic >= 110) {
    reds += 1;
  } else if (vitals.diastolic >= 90 && vitals.diastolic <= 109) {
    yellows += 1;
  }

  // 5. Temperature (°C)
  if (vitals.temperature < 35.0 || vitals.temperature >= 38.5) {
    reds += 1;
  } else if (vitals.temperature >= 37.5 && vitals.temperature < 38.5) {
    yellows += 1;
  }

  // 6. Consciousness
  if (vitals.consciousness !== 'Compos Mentis') {
    reds += 1;
  }

  // 7. Fetal Heart Rate (DJJ) if available
  if (vitals.fetalHeartRate) {
    if (vitals.fetalHeartRate < 100 || vitals.fetalHeartRate > 180) {
      reds += 1; // Severe bradycardia/tachycardia
    } else if ((vitals.fetalHeartRate >= 100 && vitals.fetalHeartRate < 110) || (vitals.fetalHeartRate > 160 && vitals.fetalHeartRate <= 180)) {
      yellows += 1;
    }
  }

  const totalScore = yellows * 1 + reds * 2;

  let alertLevel: MeowsEvaluation['alertLevel'] = 'Normal';
  let badgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  let recommendation = 'Tanda vital dalam batas aman. Lakukan pemantauan rutin sesuai jadwal asuhan.';

  if (reds >= 2) {
    alertLevel = 'Gawat Darurat Maternal (2+ Merah)';
    badgeColor = 'text-rose-700 bg-rose-50 border-rose-300';
    recommendation = 'KODE MERAH OBSTETRI: Panggil tim gawat darurat Puskesmas, pasang 2 jalur IV kanula kaliber besar, siapkan resusitasi & stabilisasi BAKSOKUDA, segera hubungi RS PONEK!';
  } else if (reds === 1 || yellows >= 2) {
    alertLevel = 'Perhatian Tinggi (2+ Kuning / 1 Merah)';
    badgeColor = 'text-amber-800 bg-amber-50 border-amber-300';
    recommendation = 'Pemeriksaan segera oleh Bidan Koordinator / Dokter Puskesmas. Evaluasi ketat TTV setiap 15-30 menit. Siapkan rencana rujukan bila tidak ada perbaikan.';
  } else if (yellows === 1) {
    alertLevel = 'Waspada (1 Kuning)';
    badgeColor = 'text-amber-700 bg-amber-50/60 border-amber-200';
    recommendation = 'Observasi tanda vital ulang dalam 30-60 menit. Catat faktor pencetus dan edukasi tanda bahaya pada pasien.';
  }

  return {
    totalScore,
    yellowTriggers: yellows,
    redTriggers: reds,
    alertLevel,
    badgeColor,
    recommendation,
  };
}

/**
 * Calculate Naegele's Estimated Date of Delivery (HPL / TP)
 * Formula: Day + 7, Month - 3, Year + 1 (for Apr - Dec)
 * Or: Day + 7, Month + 9, Year (for Jan - Mar)
 */
export function calculateHPL(hphtDateString: string): string {
  if (!hphtDateString) return '';
  const date = new Date(hphtDateString);
  if (isNaN(date.getTime())) return '';

  const day = date.getDate();
  const month = date.getMonth(); // 0-indexed (0 = Jan)
  const year = date.getFullYear();

  let targetDay = day + 7;
  let targetMonth = month - 3;
  let targetYear = year + 1;

  if (month < 3) {
    targetMonth = month + 9;
    targetYear = year;
  }

  const hplDate = new Date(targetYear, targetMonth, targetDay);
  return hplDate.toISOString().split('T')[0];
}

/**
 * Calculate Gestational Age in Weeks and Days based on HPHT
 */
export function calculateGestationalAge(hphtDateString: string): { weeks: number; days: number; text: string } {
  if (!hphtDateString) return { weeks: 0, days: 0, text: '0 minggu' };
  const hpht = new Date(hphtDateString);
  const today = new Date();
  if (isNaN(hpht.getTime())) return { weeks: 0, days: 0, text: '0 minggu' };

  const diffTime = today.getTime() - hpht.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { weeks: 0, days: 0, text: 'Tanggal belum terjadi' };

  const weeks = Math.floor(diffDays / 7);
  const remainingDays = diffDays % 7;

  return {
    weeks,
    days: remainingDays,
    text: `${weeks} minggu ${remainingDays > 0 ? `${remainingDays} hari` : ''}`.trim(),
  };
}

/**
 * Calculate Estimated Fetal Weight (TBJ) using Johnson-Toshack formula
 * TBJ = (TFU - n) x 155 gram
 * n = 12 jika kepala janin belum masuk Pintu Atas Panggul (PAP)
 * n = 11 jika kepala janin sudah masuk PAP
 */
export function calculateTBJ(tfuCm: number, headEngaged: boolean): number {
  if (!tfuCm || tfuCm < 15) return 0;
  const n = headEngaged ? 11 : 12;
  const tbj = (tfuCm - n) * 155;
  return Math.max(0, Math.round(tbj));
}

/**
 * Calculate Poedji Rochjati Risk Score (KSPR)
 * Baseline: 2 points (Skor awal semua ibu hamil)
 * 2 = Kehamilan Risiko Rendah (KRR)
 * 6 - 10 = Kehamilan Risiko Tinggi (KRT)
 * >= 12 = Kehamilan Risiko Sangat Tinggi (KRST)
 */
export function calculatePoedjiRochjati(patient: Partial<Patient>): { score: number; category: string; description: string } {
  let score = 2; // Baseline score awal

  const age = patient.age || 25;
  const g = patient.gravida || 1;
  const p = patient.para || 0;
  const lila = patient.armCircumference || 24;
  const tb = patient.height || 155;

  // Faktor Kelompok I (Ada Potensi Bahaya)
  if (age <= 16) score += 4; // Terlalu muda hamil I <= 16 thn
  if (age >= 35 && p === 0) score += 4; // Terlalu tua hamil I >= 35 thn
  if (age >= 35 && p > 0) score += 4; // Terlalu tua hamil lagi >= 35 thn
  if (tb < 145) score += 4; // Terlalu pendek < 145 cm
  if (p >= 4) score += 4; // Terlalu banyak anak >= 4
  if (patient.vulnerabilities?.hasBadObstetricHistory) score += 4; // Pernah keguguran/riwayat SC/vacum
  if (lila < 23.5) score += 4; // KEK / Kurang Energi Kronis

  // Faktor Kelompok II (Ada Bahaya)
  if (patient.labs?.proteinuria && patient.labs.proteinuria !== 'Negatif') score += 8; // Preeklampsia
  if (patient.complexCategories?.isSevereAnemiaOrKEK || (patient.labs?.hemoglobin && patient.labs.hemoglobin < 8)) score += 4; // Anemia
  if (patient.complexCategories?.isPrematureRuptureOfMembranes) score += 8; // KPD
  if (patient.complexCategories?.isAntepartumHemorrhage) score += 8; // Perdarahan antepartum
  if (patient.complexCategories?.hasMedicalComorbidities) score += 4; // Penyakit penyerta

  // Faktor Kelompok III (Ada Gawat Darurat)
  if (patient.complexCategories?.isPreeclampsiaOrEclampsia && (patient.vitals?.systolic && patient.vitals.systolic >= 160)) score += 8; // Eklampsia / PEB berat
  if (patient.complexCategories?.isPostpartumHemorrhage) score += 8; // HPP

  let category = 'KRR (Kehamilan Risiko Rendah)';
  let description = 'Asuhan kebidanan normal di Puskesmas / Bidan Praktik Mandiri.';

  if (score >= 12) {
    category = 'KRST (Kehamilan Risiko Sangat Tinggi)';
    description = 'Harus melahirkan di Rumah Sakit dengan fasilitas Spesialis Obstetri & Neonatologi (PONEK).';
  } else if (score >= 6) {
    category = 'KRT (Kehamilan Risiko Tinggi)';
    description = 'Memerlukan pengawasan intensif oleh Bidan dan rujukan konsultatif ke Dokter Spesialis/RS.';
  }

  return { score, category, description };
}
