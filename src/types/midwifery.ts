export type RiskLevel = 'Rendah' | 'Sedang' | 'Tinggi' | 'Gawat Darurat';

export type CaseStatus =
  | 'Dalam Pemantauan'
  | 'Gawat Darurat PONED'
  | 'Dirujuk ke RS PONEK'
  | 'Selesai Nifas / Pulih';

export interface Vitals {
  systolic: number; // mmHg
  diastolic: number; // mmHg
  pulse: number; // bpm
  respiratoryRate: number; // x/menit
  temperature: number; // °C
  consciousness: 'Compos Mentis' | 'Apatis' | 'Somnolen' | 'Sopor' | 'Koma';
  fetalHeartRate?: number; // DJJ bpm (120-160 normal)
  fundalHeight?: number; // TFU cm
  contractions?: string; // His (mis. 3x dlm 10 menit, durasi 35 detik)
  cervicalDilation?: number; // Pembukaan serviks (cm, 0-10)
}

export interface LabResults {
  hemoglobin?: number; // g/dL
  proteinuria?: 'Negatif' | '+1' | '+2' | '+3' | '+4';
  bloodGlucose?: number; // mg/dL
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Belum Diketahui';
  hivStatus?: 'Non-reaktif' | 'Reaktif' | 'Belum Diperiksa';
  syphilisStatus?: 'Non-reaktif' | 'Reaktif' | 'Belum Diperiksa';
  hbsagStatus?: 'Non-reaktif' | 'Reaktif' | 'Belum Diperiksa';
}

export interface VulnerableFactors {
  isTeenagePregnancy: boolean; // Usia < 20 tahun
  isAdvancedMaternalAge: boolean; // Usia >= 35 tahun
  isTripleEliminationPositive: boolean; // HIV / Sifilis / Hep B
  tripleEliminationDetails?: string[];
  isDomesticViolenceVictim: boolean; // KDRT / Kekerasan Berbasis Gender
  isExtremePovertyOrPrasejahtera: boolean; // Kemiskinan / PBI JKN / Risiko Stunting
  hasDisability: boolean; // Disabilitas fisik / sensorik / mental
  isUnintendedPregnancy: boolean; // KTD / Kehamilan Tidak Diinginkan
  hasBadObstetricHistory: boolean; // Riwayat abortus berulang, stillbirth, IUFD, SC sebelumnya
}

export interface ComplexCaseCategories {
  isPreeclampsiaOrEclampsia: boolean;
  isPostpartumHemorrhage: boolean;
  isAntepartumHemorrhage: boolean;
  isSevereAnemiaOrKEK: boolean; // Hb < 8 atau LILA < 23.5 cm
  isPrematureRuptureOfMembranes: boolean; // KPD > 12 jam
  isDystociaOrObstructedLabor: boolean; // Partus macet / kelainan letak
  isMaternalInfectionOrSepsis: boolean;
  hasMedicalComorbidities: boolean; // Jantung, Hipertensi kronis, TB, Diabetes, Asma
  otherComplications?: string;
}

export interface SoapRecord {
  date: string;
  midwifeName: string;
  subjektif: string;
  objektif: string;
  analisis: string;
  penatalaksanaan: string[];
}

export interface ReferralPlan {
  destinationHospital: string;
  referralReason: string;
  transportationType: string;
  accompanyingStaff: string;
  familyContact: string;
  preparedMedications: string[];
  sbarSituation: string;
  sbarBackground: string;
  sbarAssessment: string;
  sbarRecommendation: string;
}

export interface Patient {
  id: string;
  medicalRecordNo: string;
  nik: string;
  name: string;
  age: number;
  husbandName: string;
  address: string;
  neighborhood: string; // Kelurahan di Kaluku Bodoa, misal: Kaluku Bodoa, Buloa, Tallo, dll
  phone: string;
  gravida: number; // G
  para: number; // P
  abortus: number; // A
  livingChildren: number;
  hpht: string; // YYYY-MM-DD
  hpl: string; // YYYY-MM-DD
  gestationalAgeWeeks: number;
  armCircumference: number; // LILA in cm (normal >= 23.5)
  weight: number; // kg
  height: number; // cm
  vitals: Vitals;
  labs: LabResults;
  chiefComplaint: string;
  complexCategories: ComplexCaseCategories;
  vulnerabilities: VulnerableFactors;
  status: CaseStatus;
  riskScorePoedjiRochjati: number; // KSPR score
  meowsScore: number;
  soapHistory: SoapRecord[];
  referralPlan?: ReferralPlan;
  createdAt: string;
  updatedAt: string;
}
