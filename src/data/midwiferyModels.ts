export type StandardReferenceType =
  | 'Kemenkes RI'
  | 'IBI'
  | 'POGI'
  | 'Kemenkes & IBI'
  | 'Kemenkes & POGI'
  | 'IBI & Kemenkes'
  | 'IBI & POGI'
  | 'Kemenkes, IBI & POGI';

export interface MidwiferyAction {
  id: string;
  code: string;
  title: string;
  description: string;
  standardReference: StandardReferenceType;
  isComplexOrVulnerableHighlight: boolean;
  phase: string;
  category: 'Pemeriksaan' | 'Tindakan Klinis' | 'Medikamentosa' | 'Konseling & KIE' | 'Kolaborasi & Rujukan';
}

export interface MidwiferyCareModel {
  id: string;
  title: string;
  subtitle: string;
  isHighPriorityHighlight: boolean; // Highlighted for Complex Cases & Vulnerable Groups
  philosophy: string;
  regulatoryBasics: string[];
  scopeAndPhases: string[];
  keyActions: MidwiferyAction[];
}

export const MIDWIFERY_CARE_MODELS: MidwiferyCareModel[] = [
  // 1. MODEL ASUHAN KASUS KOMPLEKS & KEGAWATDARURATAN OBSTETRI (HIGHLIGHTED)
  {
    id: 'model-kasus-kompleks',
    title: 'Model Asuhan Kebidanan Kasus Kompleks & Kegawatdaruratan Maternal',
    subtitle: 'Emergency & Complex Obstetric Care Model',
    isHighPriorityHighlight: true,
    philosophy:
      'Pendekatan asuhan klinis terstandar dan berbasis bukti untuk deteksi dini, stabilisasi cepat, pencegahan morbiditas-mortalitas, dan penatalaksanaan tepat waktu pada komplikasi obstetri patologis serta kegawatdaruratan maternal dan neonatal.',
    regulatoryBasics: [
      'Kepmenkes RI No. HK.01.07/MENKES/320/2020 tentang Standar Profesi Bidan (Kompetensi Kegawatdaruratan)',
      'Pedoman Nasional Pelayanan Kedokteran (PNPK) Preeklamsia, Perdarahan Pascapersalinan, dan Sepsis POGI',
      'Modul Pelatihan Pelayanan Obstetri Neonatal Emergensi Dasar (PONED) Kemenkes RI',
      'Buku Saku Pelayanan Kesehatan Ibu di Fasilitas Kesehatan Tingkat Pertama dan Rujukan Kemenkes RI',
    ],
    scopeAndPhases: [
      'Deteksi Dini & Triase Peringatan Dini (MEOWS)',
      'Kedaruratan Hipertensi dalam Kehamilan & Preeklampsia Berat (PEB) / Eklampsia',
      'Kedaruratan Perdarahan Obstetri (Atonia Uteri, Retensio Plasenta, Solusio, Laserasi 4T)',
      'Kedaruratan Syok Obstetrik (Hipovolemik, Septik, Anafilaktik)',
      'Distosia, Partus Macet, dan Malpresentasi Janin',
      'Infeksi Berat, Korioamnionitis, dan Sepsis Puerperalis',
      'Stabilisasi Pra-Rujukan BAKSOKUDA & Komunikasi SBAR',
    ],
    keyActions: [
      {
        id: 'act-cplx-01',
        code: 'EMG-01',
        title: 'Skrining Skor Peringatan Dini Maternal (MEOWS) Serial',
        description:
          'Pengukuran frekuensi napas, saturasi oksigen, tekanan darah, denyut nadi, suhu tubuh, kesadaran AVPU, dan DJJ. Penilaian pemicu kuning/merah setiap 15-30 menit pada pasien risiko tinggi.',
        standardReference: 'Kemenkes, IBI & POGI',
        isComplexOrVulnerableHighlight: true,
        phase: 'Triase & Deteksi Dini',
        category: 'Pemeriksaan',
      },
      {
        id: 'act-cplx-02',
        code: 'EMG-02',
        title: 'Verifikasi Syarat Mutlak & Loading Dose MgSO4 40% (4 gram IV)',
        description:
          'Memastikan refleks patella (+) kuat, laju napas >= 16x/m, dan urin via kateter >= 30 ml/jam. Memberikan 4 gram MgSO4 40% (10 ml) dilarutkan dengan 10 ml Aquabidest IV bolus perlahan dalam 5-10 menit.',
        standardReference: 'Kemenkes, IBI & POGI',
        isComplexOrVulnerableHighlight: true,
        phase: 'Preeklampsia Berat & Eklampsia',
        category: 'Medikamentosa',
      },
      {
        id: 'act-cplx-03',
        code: 'EMG-03',
        title: 'Pemeliharaan MgSO4 40% (6 gram dalam 500 ml RL 28 TPM)',
        description:
          'Infus kontinu MgSO4 40% 6 gram dalam 500 ml Ringer Laktat kecepatan 28 tetes/menit (1 gram/jam) selama 24 jam pascasalin atau kejang terakhir.',
        standardReference: 'Kemenkes, IBI & POGI',
        isComplexOrVulnerableHighlight: true,
        phase: 'Preeklampsia Berat & Eklampsia',
        category: 'Medikamentosa',
      },
      {
        id: 'act-cplx-04',
        code: 'EMG-04',
        title: 'Kesiapan Antidotum Kalsium Glukonat 10% (1 gram IV)',
        description:
          'Menyediakan Kalsium Glukonat 10% 1 ampul (10 ml) di spuit steril di samping tempat tidur. Diberikan IV bolus pelan 3 menit bila refleks patella hilang, napas < 16x/m, atau intoksikasi MgSO4.',
        standardReference: 'Kemenkes, IBI & POGI',
        isComplexOrVulnerableHighlight: true,
        phase: 'Preeklampsia Berat & Eklampsia',
        category: 'Medikamentosa',
      },
      {
        id: 'act-cplx-05',
        code: 'EMG-05',
        title: 'Antihipertensi Lini Pertama Nifedipin 10 mg Oral',
        description:
          'Pemberian tablet Nifedipin 10 mg oral (ditelan, bukan sublingual) jika TD >= 160/110 mmHg. Evaluasi tiap 30 menit maksimal 30 mg hingga target TD 140-150 / 90-100 mmHg.',
        standardReference: 'Kemenkes, IBI & POGI',
        isComplexOrVulnerableHighlight: true,
        phase: 'Preeklampsia Berat & Eklampsia',
        category: 'Medikamentosa',
      },
      {
        id: 'act-cplx-06',
        code: 'EMG-06',
        title: 'Kompresi Bimanual Interna (KBI) 5 Menit pada Atonia Uteri',
        description:
          'Memasukkan tangan ke forniks anterior, mengepalkan tinju menekan dinding anterior uterus, tangan luar menekan fundus posterior selama 5 menit. Teruskan 2 menit bila berkontraksi.',
        standardReference: 'Kemenkes & IBI',
        isComplexOrVulnerableHighlight: true,
        phase: 'Perdarahan Pascapersalinan (HPP)',
        category: 'Tindakan Klinis',
      },
      {
        id: 'act-cplx-07',
        code: 'EMG-07',
        title: 'Uterotonika Kombinasi & Asam Traneksamat 1 gram IV',
        description:
          'Oksitosin 20-40 IU dalam 1000 ml RL 60 tpm + Misoprostol 800-1000 mcg per rektal + Asam Traneksamat 1 gram (10 ml) IV bolus pelan 10 menit. (Ergometrin 0.2 mg IM HANYA bila TIDAK ada hipertensi).',
        standardReference: 'Kemenkes, IBI & POGI',
        isComplexOrVulnerableHighlight: true,
        phase: 'Perdarahan Pascapersalinan (HPP)',
        category: 'Medikamentosa',
      },
      {
        id: 'act-cplx-08',
        code: 'EMG-08',
        title: 'Pemasangan Tamponade Balon Kondom Kateter Hidrostatik',
        description:
          'Ikat kondom steril pada ujung kateter foley dengan benang sutra DTT. Masukkan ke kavum uteri, isi 300-500 ml cairan NaCl 0.9% hangat sampai perdarahan berhenti.',
        standardReference: 'Kemenkes & IBI',
        isComplexOrVulnerableHighlight: true,
        phase: 'Perdarahan Pascapersalinan (HPP)',
        category: 'Tindakan Klinis',
      },
      {
        id: 'act-cplx-09',
        code: 'EMG-09',
        title: 'Resusitasi Cairan 2 Jalur IV Jarum Besar (16G/18G)',
        description:
          'Pemasangan dua infus perifer kaliber besar pada kedua ekstremitas atas, guyur 1000 ml Ringer Laktat hangat dalam 15-20 menit pertama pada syok hipovolemik maternal.',
        standardReference: 'Kemenkes, IBI & POGI',
        isComplexOrVulnerableHighlight: true,
        phase: 'Syok Obstetrik',
        category: 'Tindakan Klinis',
      },
      {
        id: 'act-cplx-10',
        code: 'EMG-10',
        title: 'Stabilisasi Rujukan Maternal BAKSOKUDA & Komunikasi SBAR',
        description:
          'Kelengkapan Bidan, Alat, Keluarga donor, Surat rujukan SBAR, Obat kontinu, Kendaraan ambulans, Uang/Jaminan, dan Doa. Early notification ke RS rujukan sebelum ambulans berangkat.',
        standardReference: 'Kemenkes, IBI & POGI',
        isComplexOrVulnerableHighlight: true,
        phase: 'Rujukan & Transfer Pasien',
        category: 'Kolaborasi & Rujukan',
      },
    ],
  },

  // 2. MODEL ASUHAN KEBIDANAN INKLUSIF UNTUK KELOMPOK RENTAN (HIGHLIGHTED)
  {
    id: 'model-kelompok-rentan',
    title: 'Model Asuhan Kebidanan Inklusif untuk Kelompok Rentan',
    subtitle: 'Vulnerable & Inclusive Midwifery Care Model',
    isHighPriorityHighlight: true,
    philosophy:
      'Pendekatan asuhan kebidanan yang adil gender, inklusif, non-diskriminatif, dan memberdayakan bagi populasi rentan (kehamilan usia remaja, triple eliminasi, korban kekerasan berbasis gender/KDRT, kemiskinan ekstrem & risiko stunting, disabilitas, dan kehamilan tidak diinginkan) guna menjamin kesetaraan hak kesehatan reproduksi.',
    regulatoryBasics: [
      'Permenkes No. 52 Tahun 2017 tentang Eliminasi Penularan HIV, Sifilis, dan Hepatitis B dari Ibu ke Anak',
      'Pedoman Standar Nasional Pelayanan Kesehatan Peduli Remaja (PKPR) Kemenkes RI',
      'Panduan Layanan Kesehatan bagi Korban Kekerasan terhadap Perempuan dan Anak (KtP/A) Kemenkes RI & WHO',
      'Perpres No. 72 Tahun 2021 tentang Percepatan Penurunan Stunting (Intervensi Gizi Spesifik 1000 HPK)',
      'UU No. 8 Tahun 2016 tentang Penyandang Disabilitas (Aksesibilitas Layanan Kesehatan)',
    ],
    scopeAndPhases: [
      'Asuhan Kehamilan Usia Remaja (< 20 Tahun)',
      'Program Pencegahan Penularan Ibu ke Anak (PPIA / PMTCT Triple Eliminasi)',
      'Tata Laksana Trauma-Informed Care Korban KDRT & Kekerasan Seksual',
      'Intervensi Gizi Ibu Hamil KEK (LILA < 23.5 cm) & Kemiskinan Ekstrem',
      'Asuhan Persalinan dan Nifas Ramah Disabilitas (Fisik, Sensorik, Mental)',
      'Konseling Kehamilan Tidak Diinginkan (KTD) & Pasca Keguguran Komprehensif',
    ],
    keyActions: [
      {
        id: 'act-vln-01',
        code: 'VLN-01',
        title: 'Konseling PKPR Remaja Ramah, Tertutup, & Bebas Penghakiman',
        description:
          'Menciptakan ruang periksa aman tanpa stigma untuk remaja hamil. Menilai kesiapan mental, membangun kepercayaan diri ibu muda, dan melibatkan support system keluarga pendukung.',
        standardReference: 'Kemenkes & IBI',
        isComplexOrVulnerableHighlight: true,
        phase: 'Kehamilan Remaja (< 20 Tahun)',
        category: 'Konseling & KIE',
      },
      {
        id: 'act-vln-02',
        code: 'VLN-02',
        title: 'Skrining Pelvimetri Klinis & Deteksi Dini Panggul Sempit (CPD)',
        description:
          'Pengukuran tinggi badan (waspada TB < 145 cm), lingkar panggul luar, dan konjugata diagonalis pada kehamilan remaja untuk merencanakan persalinan rujukan elektif di RS.',
        standardReference: 'Kemenkes, IBI & POGI',
        isComplexOrVulnerableHighlight: true,
        phase: 'Kehamilan Remaja (< 20 Tahun)',
        category: 'Pemeriksaan',
      },
      {
        id: 'act-vln-03',
        code: 'VLN-03',
        title: 'Inisiasi Terapi ARV Kombinasi (TLD) pada Ibu HIV Reaktif',
        description:
          'Pemberian FDC Tenofovir (TDF) 300 mg + Lamivudin (3TC) 300 mg + Dolutegravir (DTG) 50 mg satu kali sehari pada malam hari segera setelah diagnosis ditegakkan tanpa memandang jumlah CD4.',
        standardReference: 'Kemenkes & POGI',
        isComplexOrVulnerableHighlight: true,
        phase: 'Triple Eliminasi (HIV)',
        category: 'Medikamentosa',
      },
      {
        id: 'act-vln-04',
        code: 'VLN-04',
        title: 'Injeksi Benzatin Benzilpenisilin G 2.4 Juta IU pada Sifilis Maternal',
        description:
          'Injeksi Benzatin Penisilin 2.4 juta IU IM dosis tunggal (1.2 juta IU pada masing-masing bokong) setelah skin test negatif. Obati dan periksa pasangan seksual secara bersamaan.',
        standardReference: 'Kemenkes & POGI',
        isComplexOrVulnerableHighlight: true,
        phase: 'Triple Eliminasi (Sifilis)',
        category: 'Medikamentosa',
      },
      {
        id: 'act-vln-05',
        code: 'VLN-05',
        title: 'Pemberian HBIg 0.5 ml & Vaksin HepB-0 < 24 Jam pada Bayi Baru Lahir',
        description:
          'Bayi dari ibu HBsAg (+) wajib diberikan Hepatitis B Immunoglobulin (HBIg) 0.5 ml IM pada paha kiri dan vaksin Hepatitis B-0 0.5 ml IM pada paha kanan simultan dalam tempo < 12-24 jam.',
        standardReference: 'Kemenkes & IBI',
        isComplexOrVulnerableHighlight: true,
        phase: 'Triple Eliminasi (Hepatitis B)',
        category: 'Tindakan Klinis',
      },
      {
        id: 'act-vln-06',
        code: 'VLN-06',
        title: 'Penerapan Pendekatan LIVES WHO pada Ibu Korban KDRT',
        description:
          'Listen (dengarkan empatik), Inquire (tanyakan kebutuhan), Validate (validasi rasa tidak bersalah), Enhance safety (susun rencana keselamatan darurat), Support (hubungkan ke lembaga bantuan).',
        standardReference: 'Kemenkes & IBI',
        isComplexOrVulnerableHighlight: true,
        phase: 'Korban Kekerasan / KDRT',
        category: 'Konseling & KIE',
      },
      {
        id: 'act-vln-07',
        code: 'VLN-07',
        title: 'Dokumentasi Medikolegal Cedera Tubuh & Skrining Solusio Tersembunyi',
        description:
          'Pencatatan ukuran, warna, dan lokasi memar luka secara objektif di rekam medis rahasia. Pemeriksaan ketegangan dinding abdomen dan DJJ untuk menyingkirkan solusio plasenta pasca trauma.',
        standardReference: 'Kemenkes, IBI & POGI',
        isComplexOrVulnerableHighlight: true,
        phase: 'Korban Kekerasan / KDRT',
        category: 'Pemeriksaan',
      },
      {
        id: 'act-vln-08',
        code: 'VLN-08',
        title: 'Penyusunan Safety Plan & Rujukan Rahasia ke UPTD PPA / Dinsos',
        description:
          'Menyepakati kode kata darurat, nomor kontak siaga (SAPA 129), dan koordinasi rujukan ke rumah perlindungan sementara (safe house) dengan izin eksplisit pasien.',
        standardReference: 'Kemenkes & IBI',
        isComplexOrVulnerableHighlight: true,
        phase: 'Korban Kekerasan / KDRT',
        category: 'Kolaborasi & Rujukan',
      },
      {
        id: 'act-vln-09',
        code: 'VLN-09',
        title: 'Pemberian Makanan Tambahan (PMT) Pemulihan 90 Hari pada Ibu KEK',
        description:
          'Pemberian PMT berbasis pangan lokal kaya protein hewani (telur, ikan, ayam, susu) minimal 90 hari bagi ibu hamil LILA < 23.5 cm disertai pemantauan kenaikan BB tiap 2 minggu.',
        standardReference: 'Kemenkes & IBI',
        isComplexOrVulnerableHighlight: true,
        phase: 'Gizi & Pencegahan Stunting',
        category: 'Tindakan Klinis',
      },
      {
        id: 'act-vln-10',
        code: 'VLN-10',
        title: 'Suplementasi Tablet Tambah Darah (TTD 90 Tablet) & Kalsium 1.5 g/hari',
        description:
          'Pemberian 1 tablet TTD (60 mg besi elemental + 400 mcg asam folat) setiap hari minimal 90 tablet selama hamil dan kalsium 1.5 gram/hari untuk pencegahan preeklampsia.',
        standardReference: 'Kemenkes & POGI',
        isComplexOrVulnerableHighlight: true,
        phase: 'Gizi & Pencegahan Stunting',
        category: 'Medikamentosa',
      },
    ],
  },

  // 3. MODEL ASUHAN KEBIDANAN BERKELANJUTAN (CONTINUITY OF CARE / CoC)
  {
    id: 'model-coc',
    title: 'Model Asuhan Kebidanan Berkelanjutan (Continuity of Care / CoC)',
    subtitle: 'Continuity of Midwifery Care Model',
    isHighPriorityHighlight: false,
    philosophy:
      'Filosofi asuhan yang menempatkan Bidan sebagai pendamping utama perempuan secara berkesinambungan sejak masa prakonsepsi, kehamilan, persalinan, nifas, hingga pelayanan neonatus dan keluarga berencana, membangun hubungan saling percaya yang menurunkan risiko komplikasi.',
    regulatoryBasics: [
      'Permenkes No. 21 Tahun 2021 tentang Pelayanan Kesehatan Masa Sebelum Hamil, Masa Hamil, Persalinan, Masa Sesudah Melahirkan, Pelayanan Kontrasepsi, dan Pelayanan Kesehatan Seksual',
      'Standar Asuhan Kebidanan Kepmenkes No. 938/Menkes/SK/VIII/2007',
      'Standar Pelayanan Minimal (SPM) Bidang Kesehatan Kabupaten/Kota',
    ],
    scopeAndPhases: [
      'Asuhan Masa Prakonsepsi & Pranikah',
      'Asuhan Antenatal Terpadu (ANC Terpadu 10T, 6 Kali Kunjungan: K1-K6)',
      'Asuhan Intranatal / Asuhan Persalinan Normal (APN 60 Langkah)',
      'Asuhan Postnatal / Nifas Lengkap (KF1 - KF4)',
      'Asuhan Bayi Baru Lahir & Neonatus (KN1 - KN3)',
      'Pelayanan KB Pascapersalinan (KBPP) & Kesehatan Reproduksi',
    ],
    keyActions: [
      {
        id: 'act-coc-01',
        code: 'COC-01',
        title: 'Skrining Prakonsepsi & Imunisasi Tetanus Toxoid (TT/Td)',
        description:
          'Pemeriksaan status imunisasi Td, skrining anemia, pengukuran LILA, dan suplementasi asam folat 400 mcg/hari sejak 3 bulan sebelum kehamilan.',
        standardReference: 'Kemenkes & IBI',
        isComplexOrVulnerableHighlight: false,
        phase: 'Prakonsepsi & Pranikah',
        category: 'Pemeriksaan',
      },
      {
        id: 'act-coc-02',
        code: 'COC-02',
        title: 'Pelaksanaan Standar ANC Terpadu 10T Lengkap',
        description:
          '1. Timbang BB & Ukur TB; 2. Ukur Tekanan Darah; 3. Nilai Status Gizi (LILA); 4. Ukur TFU; 5. Tentukan Presentasi Janin & DJJ; 6. Skrining Status Imunisasi Td; 7. Beri Tablet Tambah Darah; 8. Periksa Lab (Hb, Gol Darah, Protein Urin, Triple Eliminasi); 9. Tata Laksana Kasus; 10. Temu Wicara / Konseling.',
        standardReference: 'Kemenkes & IBI',
        isComplexOrVulnerableHighlight: false,
        phase: 'Antenatal Terpadu (ANC)',
        category: 'Pemeriksaan',
      },
      {
        id: 'act-coc-03',
        code: 'COC-03',
        title: 'Asuhan Persalinan Normal (APN) 60 Langkah Bersih & Aman',
        description:
          'Pengenalan tanda kala dua, persiapan alat, pencegahan infeksi DTT, pemantauan kemajuan persalinan dengan partograf, pertolongan kelahiran bayi, dan pencegahan hipotermia.',
        standardReference: 'Kemenkes & IBI',
        isComplexOrVulnerableHighlight: false,
        phase: 'Persalinan (Intranatal)',
        category: 'Tindakan Klinis',
      },
      {
        id: 'act-coc-04',
        code: 'COC-04',
        title: 'Manajemen Aktif Kala III (MAK III) Rutin',
        description:
          'Pemberian Oksitosin 10 IU IM dalam 1 menit setelah bayi lahir, Penegangan Tali Pusat Terkendali (PTT) saat ada kontraksi, dan Masase fundus uteri selama 15 detik setelah plasenta lahir.',
        standardReference: 'Kemenkes, IBI & POGI',
        isComplexOrVulnerableHighlight: true,
        phase: 'Persalinan Kala III',
        category: 'Tindakan Klinis',
      },
      {
        id: 'act-coc-05',
        code: 'COC-05',
        title: 'Pemantauan Kala IV Persalinan Setiap 15 Menit',
        description:
          'Pemeriksaan tekanan darah, nadi, tinggi fundus, kontraksi uterus, kandung kemih, dan jumlah perdarahan setiap 15 menit pada jam pertama dan setiap 30 menit pada jam kedua.',
        standardReference: 'Kemenkes & IBI',
        isComplexOrVulnerableHighlight: false,
        phase: 'Persalinan Kala IV',
        category: 'Pemeriksaan',
      },
      {
        id: 'act-coc-06',
        code: 'COC-06',
        title: 'Inisiasi Menyusu Dini (IMD) Minimal 1 Jam Tanpa Terputus',
        description:
          'Menaruh bayi di dada ibu kontak kulit ke kulit (skin-to-skin contact) segera setelah dikeringkan untuk merangsang refleks mengisap dan pelepasan oksitosin alami.',
        standardReference: 'Kemenkes & IBI',
        isComplexOrVulnerableHighlight: false,
        phase: 'Neonatal & Pascasalin',
        category: 'Tindakan Klinis',
      },
      {
        id: 'act-coc-07',
        code: 'COC-07',
        title: 'Kunjungan Nifas Lengkap (KF1, KF2, KF3, KF4)',
        description:
          'KF1 (6 jam-2 hari), KF2 (3-7 hari), KF3 (8-28 hari), KF4 (29-42 hari): Evaluasi involusi uterus, lokhea, luka perineum, laktasi, tekanan darah, dan tanda bahaya nifas.',
        standardReference: 'Kemenkes & IBI',
        isComplexOrVulnerableHighlight: false,
        phase: 'Nifas (Postnatal)',
        category: 'Pemeriksaan',
      },
      {
        id: 'act-coc-08',
        code: 'COC-08',
        title: 'Kunjungan Neonatus Lengkap (KN1, KN2, KN3) & Skrining SHK',
        description:
          'Pemberian salep mata antibiotik eritromisin, injeksi Vitamin K1 1 mg IM, imunisasi Hepatitis B-0, dan pengambilan sampel darah tumit untuk Skrining Hipotiroid Kongenital (SHK) usia 48-72 jam.',
        standardReference: 'Kemenkes & IBI',
        isComplexOrVulnerableHighlight: false,
        phase: 'Neonatal',
        category: 'Tindakan Klinis',
      },
      {
        id: 'act-coc-09',
        code: 'COC-09',
        title: 'Konseling & Pelayanan KB Pascapersalinan (KBPP)',
        description:
          'Pemasangan AKDR / IUD Pascaplasenta (dalam 10 menit setelah plasenta lahir) atau Implan pascasalin sebelum ibu pulang dari fasilitas kesehatan.',
        standardReference: 'Kemenkes & IBI',
        isComplexOrVulnerableHighlight: false,
        phase: 'Keluarga Berencana',
        category: 'Tindakan Klinis',
      },
    ],
  },

  // 4. MODEL ASUHAN KEBIDANAN BERPUSAT PADA PEREMPUAN (WOMAN-CENTERED CARE)
  {
    id: 'model-woman-centered',
    title: 'Model Asuhan Kebidanan Berpusat pada Perempuan',
    subtitle: 'Woman-Centered Midwifery Care Model',
    isHighPriorityHighlight: false,
    philosophy:
      'Filosofi asuhan yang menempatkan perempuan sebagai subjek aktif, menghargai otonomi tubuh, hak mengambil keputusan yang terinformasi (informed choice), mendengarkan aspirasi ibu, dan memberikan pengalaman melahirkan yang positif serta memberdayakan.',
    regulatoryBasics: [
      'Standar Kompetensi Bidan (Kepmenkes 320/2020)',
      'WHO Recommendations: Intrapartum Care for a Positive Childbirth Experience',
      'Deklarasi Hak Kesehatan Reproduksi Perempuan FIGO & ICM',
    ],
    scopeAndPhases: [
      'Informed Choice & Shared Decision Making',
      'Dukungan Emosional & Pendampingan Persalinan Berkelanjutan',
      'Manajemen Nyeri Non-Farmakologis',
      'Mobilitas dan Kebebasan Memilih Posisi Meneran',
      'Rawat Gabung (Rooming-In) dan Pemberdayaan Menyusui',
    ],
    keyActions: [
      {
        id: 'act-wcc-01',
        code: 'WCC-01',
        title: 'Informed Choice & Lembar Keputusan Bersama Pasien-Keluarga',
        description:
          'Menjelaskan manfaat, risiko, dan alternatif setiap tindakan medis sebelum meminta persetujuan tertulis secara transparan dan tanpa paksaan.',
        standardReference: 'IBI & Kemenkes',
        isComplexOrVulnerableHighlight: false,
        phase: 'Seluruh Siklus Asuhan',
        category: 'Konseling & KIE',
      },
      {
        id: 'act-wcc-02',
        code: 'WCC-02',
        title: 'Fasilitasi Pendamping Persalinan Pilihan Ibu (Suami / Keluarga)',
        description:
          'Memastikan suami atau anggota keluarga yang dipercaya ibu hadir mendampingi secara kontinu di ruang bersalin untuk menurunkan kecemasan dan lama persalinan.',
        standardReference: 'Kemenkes & IBI',
        isComplexOrVulnerableHighlight: false,
        phase: 'Persalinan',
        category: 'Tindakan Klinis',
      },
      {
        id: 'act-wcc-03',
        code: 'WCC-03',
        title: 'Manajemen Nyeri Persalinan Non-Farmakologis Komprehensif',
        description:
          'Pemberian massage punggung (endorphin & effleurage), counter-pressure sakrum, kompres hangat di punggung bawah, mobilisasi birthing ball, dan teknik pernapasan lambat.',
        standardReference: 'IBI',
        isComplexOrVulnerableHighlight: false,
        phase: 'Persalinan Kala I',
        category: 'Tindakan Klinis',
      },
      {
        id: 'act-wcc-04',
        code: 'WCC-04',
        title: 'Kebebasan Memilih Posisi Meneran yang Fisiologis',
        description:
          'Mendukung ibu memilih posisi tegak (upright), miring kiri, setengah duduk, atau merangkak; menghindari posisi litotomi telentang datar (supine) yang menekan vena kava inferior.',
        standardReference: 'IBI & POGI',
        isComplexOrVulnerableHighlight: false,
        phase: 'Persalinan Kala II',
        category: 'Tindakan Klinis',
      },
      {
        id: 'act-wcc-05',
        code: 'WCC-05',
        title: 'Rawat Gabung (Rooming-in) 24 Jam Penuh Ibu & Bayi',
        description:
          'Menempatkan bayi dalam jangkauan ibu selama 24 jam untuk memfasilitasi menyusui sesuai kebutuhan (on-demand feeding) dan membangun ikatan batin (bonding attachment).',
        standardReference: 'Kemenkes & IBI',
        isComplexOrVulnerableHighlight: false,
        phase: 'Nifas & Neonatus',
        category: 'Tindakan Klinis',
      },
    ],
  },

  // 5. MODEL ASUHAN KEBIDANAN KOMUNITAS & KEMITRAAN MASYARAKAT
  {
    id: 'model-komunitas',
    title: 'Model Asuhan Kebidanan Komunitas & Kemitraan',
    subtitle: 'Community-Based Midwifery & Partnership Model',
    isHighPriorityHighlight: false,
    philosophy:
      'Pendekatan asuhan kebidanan yang berakar di masyarakat, melibatkan peran aktif keluarga, kader posyandu, tokoh masyarakat, dan sistem rujukan berbasis komunitas untuk mengatasi hambatan sosial-ekonomi (Tiga Terlambat).',
    regulatoryBasics: [
      'Buku Panduan P4K (Program Perencanaan Persalinan dan Pencegahan Komplikasi) Kemenkes RI',
      'Petunjuk Teknis Posyandu Integrasi Layanan Primer (ILP) Kemenkes RI',
      'Pedoman Kemitraan Bidan dan Dukun Bayi Kemenkes RI',
    ],
    scopeAndPhases: [
      'P4K dengan Penempelan Stiker di Rumah Ibu Hamil',
      'Kelas Ibu Hamil dan Kelas Ibu Balita Terintegrasi',
      'Kunjungan Rumah (Home Care / PWS-KIA)',
      'Kemitraan Bidan dan Dukun Bayi',
      'Pengorganisasian Siaga Donor Darah & Transportasi Desa',
    ],
    keyActions: [
      {
        id: 'act-kmt-01',
        code: 'KMT-01',
        title: 'Pemberdayaan P4K & Penempelan Stiker Perencanaan Persalinan',
        description:
          'Menyepakati penolong persalinan, tempat persalinan, calon pendonor darah, kendaraan/ambulans siaga, dan pendamping persalinan serta menempelkan stiker P4K di depan rumah ibu.',
        standardReference: 'Kemenkes & IBI',
        isComplexOrVulnerableHighlight: true,
        phase: 'Antenatal Komunitas',
        category: 'Konseling & KIE',
      },
      {
        id: 'act-kmt-02',
        code: 'KMT-02',
        title: 'Fasilitasi Kelas Ibu Hamil dengan Demonstrasi Praktik',
        description:
          'Edukasi kelompok ibu hamil mengenai gizi seimbang, senam hamil, tanda bahaya kehamilan, persiapan persalinan, dan perawatan bayi baru lahir menggunakan Buku KIA.',
        standardReference: 'Kemenkes & IBI',
        isComplexOrVulnerableHighlight: false,
        phase: 'Edukasi Komunitas',
        category: 'Konseling & KIE',
      },
      {
        id: 'act-kmt-03',
        code: 'KMT-03',
        title: 'Kunjungan Rumah (Home Care) Ibu Nifas Risiko Tinggi & KEK',
        description:
          'Kunjungan langsung ke rumah pasien yang tidak hadir kontrol, memastikan kondisi fisik ibu dan bayi, kepatuhan minum obat/PMT, serta menilai sanitasi lingkungan rumah.',
        standardReference: 'Kemenkes & IBI',
        isComplexOrVulnerableHighlight: true,
        phase: 'Postnatal Komunitas',
        category: 'Pemeriksaan',
      },
      {
        id: 'act-kmt-04',
        code: 'KMT-04',
        title: 'Kemitraan Bidan dan Dukun Bayi / Tokoh Adat Setempat',
        description:
          'Melibatkan dukun bayi sebagai motivator rujukan ke fasyankes dan pendamping ritual adat yang aman, melarang praktik persalinan non-nakes atau pemijatan perut (sangkal putung).',
        standardReference: 'Kemenkes & IBI',
        isComplexOrVulnerableHighlight: true,
        phase: 'Komunitas & Advokasi',
        category: 'Kolaborasi & Rujukan',
      },
    ],
  },

  // 6. MODEL ASUHAN KEBIDANAN KOLABORASI INTERPROFESIONAL (INTERPROFESSIONAL COLLABORATION)
  {
    id: 'model-kolaborasi',
    title: 'Model Asuhan Kebidanan Kolaborasi Interprofesional (IPC)',
    subtitle: 'Interprofessional Collaborative Midwifery Care Model',
    isHighPriorityHighlight: true,
    philosophy:
      'Sinergi kemitraan sejawat antara Bidan, Dokter Umum, Dokter Spesialis Obstetri & Ginekologi (Sp.OG), Dokter Spesialis Anak (Sp.A), Dokter Penyakit Dalam, Nutrisionis, Apoteker, dan Pekerja Sosial untuk penanganan holistik kasus obstetri berisiko.',
    regulatoryBasics: [
      'Permenkes No. 21 Tahun 2021 (Skrining Dokter pada K1 dan K5 ANC)',
      'Standar Kerja Bersama POGI, IDAI, dan IBI dalam Penurunan AKI & AKB',
      'Petunjuk Teknis Audit Maternal Perinatal (AMP) Terintegrasi Kemenkes RI',
    ],
    scopeAndPhases: [
      'Skrining USG & Medis Trimester I oleh Dokter / Sp.OG',
      'Konsultasi Bersama Penyakit Komorbiditas Medis (DMG, Jantung, TB, Ginjal)',
      'Rencana Persalinan Terkoordinasi Trimester III di Fasilitas PONEK',
      'Audit Maternal Perinatal (AMP) Kasus Near-Miss & Morbiditas Berat',
    ],
    keyActions: [
      {
        id: 'act-ipc-01',
        code: 'IPC-01',
        title: 'Rujukan Konsultatif Terjadwal Trimester 1 (K1) ke Dokter Fasyankes',
        description:
          'Pemeriksaan medis komprehensif oleh dokter termasuk skrining USG dasar terbatas untuk konfirmasi kehamilan intrauterine, usia gestasi, dan deteksi dini komorbiditas.',
        standardReference: 'Kemenkes & POGI',
        isComplexOrVulnerableHighlight: false,
        phase: 'Trimester 1',
        category: 'Kolaborasi & Rujukan',
      },
      {
        id: 'act-ipc-02',
        code: 'IPC-02',
        title: 'Rujukan Evaluasi Trimester 3 (K5) untuk Penentuan Tempat Lahir',
        description:
          'Konsultasi dokter/Sp.OG pada usia kehamilan 32-36 minggu untuk mengevaluasi letak janin, plasenta, taksiran berat janin, dan menetapkan apakah persalinan aman di faskes primer atau RS PONEK.',
        standardReference: 'Kemenkes, IBI & POGI',
        isComplexOrVulnerableHighlight: true,
        phase: 'Trimester 3',
        category: 'Kolaborasi & Rujukan',
      },
      {
        id: 'act-ipc-03',
        code: 'IPC-03',
        title: 'Kolaborasi Lintas Program Gizi & Farmasi untuk Anemia Berat',
        description:
          'Penyusunan menu diet tinggi zat besi heme dan asam askorbat oleh petugas gizi serta evaluasi terapi besi oral dosis tinggi atau parenteral/transfusi oleh dokter spesialis.',
        standardReference: 'Kemenkes & IBI',
        isComplexOrVulnerableHighlight: true,
        phase: 'Antenatal Terintegrasi',
        category: 'Kolaborasi & Rujukan',
      },
      {
        id: 'act-ipc-04',
        code: 'IPC-04',
        title: 'Pencatatan Audit Maternal Perinatal (AMP) Kasus Komplikasi Berat',
        description:
          'Pengisian formulir investigasi kasus komplikasi berat (near miss) untuk mengidentifikasi faktor penyebab medis dan non-medis demi perbaikan sistem rujukan berkesinambungan.',
        standardReference: 'Kemenkes RI',
        isComplexOrVulnerableHighlight: true,
        phase: 'Manajemen Mutu',
        category: 'Pemeriksaan',
      },
    ],
  },

  // 7. MODEL ASUHAN KEBIDANAN HOLISTIK & HUMANIS (HOLISTIC & GENTLE MIDWIFERY)
  {
    id: 'model-holistik',
    title: 'Model Asuhan Kebidanan Holistik & Humanis',
    subtitle: 'Holistic & Gentle Midwifery Care Model',
    isHighPriorityHighlight: false,
    philosophy:
      'Pendekatan asuhan yang memandang kehamilan dan kelahiran sebagai peristiwa hidup yang sakral dan alami, memadukan ilmu medis modern dengan sentuhan kasih sayang, relaksasi pikiran, dan kenyamanan spiritual ibu.',
    regulatoryBasics: [
      'Standar Asuhan Kebidanan Filosofi Fisiologis IBI',
      'Pedoman Pelayanan Kebidanan Komplementer Terintegrasi',
    ],
    scopeAndPhases: [
      'Relaksasi Hypnobirthing & Afirmasi Kehamilan',
      'Penundaan Penjepitan Tali Pusat (Delayed Cord Clamping)',
      'Minimalkan Intervensi Medis yang Tidak Perlu',
      'Pijat Laktasi & Pijat Oksitosin Pelancar ASI',
      'Pendampingan Doa & Spiritualitas Persalinan',
    ],
    keyActions: [
      {
        id: 'act-hol-01',
        code: 'HOL-01',
        title: 'Afirmasi Positif Hypnobirthing untuk Mengatasi Siklus Takut-Tegang-Nyeri',
        description:
          'Melatih ibu teknik relaksasi visualisasi dan afirmasi rasa tenang untuk merangsang produksi endorfin alami tubuh dan melunakkan serviks.',
        standardReference: 'IBI',
        isComplexOrVulnerableHighlight: false,
        phase: 'Antenatal & Intranatal',
        category: 'Konseling & KIE',
      },
      {
        id: 'act-hol-02',
        code: 'HOL-02',
        title: 'Penundaan Penjepitan Tali Pusat (Delayed Cord Clamping 1-3 Menit)',
        description:
          'Menunda klem dan pemotongan tali pusat selama 1-3 menit setelah bayi lahir (pada bayi bugar) untuk mentransfer hingga 80-100 ml darah plasenta dan mencegah anemia defisiensi besi bayi.',
        standardReference: 'Kemenkes, IBI & POGI',
        isComplexOrVulnerableHighlight: false,
        phase: 'Persalinan Kala III',
        category: 'Tindakan Klinis',
      },
      {
        id: 'act-hol-03',
        code: 'HOL-03',
        title: 'Menghindari Episiotomi Rutin Tanpa Indikasi Medis Jelas',
        description:
          'Membiarkan perineum meregang secara bertahap dengan bimbingan meneran perlahan dan kompres hangat perineum; episiotomi hanya dilakukan bila terjadi gawat janin atau distosia bahu.',
        standardReference: 'Kemenkes, IBI & POGI',
        isComplexOrVulnerableHighlight: false,
        phase: 'Persalinan Kala II',
        category: 'Tindakan Klinis',
      },
      {
        id: 'act-hol-04',
        code: 'HOL-04',
        title: 'Pijat Oksitosin di Sepanjang Tulang Belakang Pascasalin',
        description:
          'Pemijatan tulang belakang costae 5-6 ke arah fundus untuk menstimulasi hormon prolaktin dan oksitosin, melancarkan ASI, dan membantu involusi rahim.',
        standardReference: 'IBI & Kemenkes',
        isComplexOrVulnerableHighlight: false,
        phase: 'Nifas & Laktasi',
        category: 'Tindakan Klinis',
      },
    ],
  },
];
