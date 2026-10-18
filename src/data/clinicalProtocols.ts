export interface ClinicalProtocol {
  id: string;
  title: string;
  category: 'Kasus Kompleks' | 'Kelompok Rentan' | 'Rujukan & Emergensi';
  summary: string;
  indications: string[];
  steps: {
    phase: string;
    action: string;
    details: string;
    drugOrTool?: string;
  }[];
  warningAlerts: string[];
  sourceReference: string;
}

export const CLINICAL_PROTOCOLS: ClinicalProtocol[] = [
  {
    id: 'protokol-mgso4-peb',
    title: 'Tata Laksana Preeklampsia Berat (PEB) & Pemberian MgSO4',
    category: 'Kasus Kompleks',
    summary: 'Protokol pencegahan dan penghentian kejang maternal pada PEB / Eklampsia menggunakan Magnesium Sulfat sesuai standar Kemenkes RI / POGI.',
    indications: [
      'Tekanan Darah Sistolik >= 160 mmHg atau Diastolik >= 110 mmHg dengan proteinuria >= +1',
      'Tekanan Darah Sistolik >= 140/90 mmHg disertai gejala impending: nyeri kepala frontal hebat, pandangan kabur/skotoma, nyeri ulu hati/epigastrium, edema paru',
      'Terjadi kejang eklampsia (singkirkan epilepsi atau trauma capitis)',
    ],
    steps: [
      {
        phase: '1. Verifikasi Syarat Mutlak Pemberian MgSO4',
        action: 'Pemeriksaan Refleks Patella, Pernapasan, dan Output Urin',
        details: 'Refleks patella (+) kuat kanan & kiri, Frekuensi napas (RR) minimal >= 16 kali/menit, Produksi urin minimal >= 30 ml/jam (atau 0.5 ml/kgBB/jam dalam 4 jam terakhir via foley kateter menetap).',
        drugOrTool: 'Foley Kateter + Urin Bag terpasang',
      },
      {
        phase: '2. Siapkan Antidotum Wajib',
        action: 'Sediakan Kalsium Glukonat 10% di dekat tempat tidur pasien',
        details: 'Kalsium Glukonat 10% (1 gram / 10 ml) disiapkan dalam spuit 10 ml. Diberikan jika terjadi henti napas atau intoksikasi MgSO4 secara IV bolus perlahan dalam 3-5 menit.',
        drugOrTool: 'Kalsium Glukonat 10% (10 ml)',
      },
      {
        phase: '3. Dosis Awal (Loading Dose)',
        action: 'Pemberian Bolus IV MgSO4 40%',
        details: 'Ambil 4 gram MgSO4 40% (10 ml), larutkan dengan 10 ml Aquabidest steril (konsentrasi menjadi 20%). Suntikkan IV bolus perlahan selama 5 - 10 menit. Pasien akan merasakan sensasi panas (tenangkan pasien).',
        drugOrTool: 'MgSO4 40% 4 gram (10 ml) + 10 ml Aquabidest IV perlahan',
      },
      {
        phase: '4. Dosis Pemeliharaan (Maintenance Dose)',
        action: 'Infus Kontinu MgSO4 40% dalam Ringer Laktat',
        details: 'Masukkan 6 gram MgSO4 40% (15 ml) ke dalam 500 ml Ringer Laktat. Berikan dengan kecepatan 28 tetes per menit (kecepatan 1 gram per jam) selama 24 jam pascapersalinan atau kejang terakhir.',
        drugOrTool: '6 gram MgSO4 40% dalam 500 ml RL (28 tpm makro)',
      },
      {
        phase: '5. Terapi Antihipertensi Lini Pertama',
        action: 'Penurunan Tekanan Darah Terkendali',
        details: 'Jika TD >= 160/110 mmHg, berikan Nifedipin 10 mg oral (telan, BUKAN sublingual). Dapat diulang tiap 30 menit maksimal 30 mg bila TD belum turun ke target 140-150 / 90-100 mmHg.',
        drugOrTool: 'Nifedipin 10 mg tablet oral',
      },
      {
        phase: '6. Stabilisasi & Persiapan Rujukan',
        action: 'Rujuk Segera ke Rumah Sakit PONEK dengan BAKSOKUDA',
        details: 'Pasang oksigen kanul nasal 4-6 Lpm. Pertahankan posisi miring ke kiri untuk mencegah sindrom hipotensi supine dan mengoptimalkan perfusi uteroplasenta. Dampingi pasien selama perjalanan di ambulans dengan infus MgSO4 berjalan.',
        drugOrTool: 'Ambulans Puskesmas, Bidan Pendamping, O2 Nasal Kanul',
      },
    ],
    warningAlerts: [
      'JANGAN berikan Ergometrin pada kala III/IV pada pasien preeklampsia karena memicu vasospasme hebat dan krisis hipertensi fatal!',
      'Hentikan MgSO4 SEGERA bila refleks patella (-), RR < 16x/m, atau urin < 30 ml/jam. Berikan Kalsium Glukonat 10% 1 gram IV segera!',
    ],
    sourceReference: 'Pedoman Nasional Pelayanan Kedokteran (PNPK) Preeklamsia POGI & Buku Saku Pelayanan Kesehatan Ibu Kemenkes RI',
  },
  {
    id: 'protokol-atonia-uteri-hpp',
    title: 'Tata Laksana Atonia Uteri & Perdarahan Pascapersalinan (HPP)',
    category: 'Kasus Kompleks',
    summary: 'Algoritma kompresi bimanual, kondom kateter tamponade, dan uterotonika darurat untuk menghentikan perdarahan primer pascapersalinan.',
    indications: [
      'Perdarahan > 500 ml setelah persalinan pervaginam atau > 1000 ml setelah sectio caesarea',
      'Uterus lembek, tidak berkontraksi setelah kelahiran plasenta lengkap',
      'Tanda awal syok: Nadi > 100x/m, TD Sistolik < 90 mmHg, akral dingin dan pucat',
    ],
    steps: [
      {
        phase: '1. Masase Fundus Segera & Kosongkan Kandung Kemih',
        action: 'Masase fundus uteri 15 detik',
        details: 'Lakukan gerakan sirkular pada fundus uteri selama 15 detik. Pastikan kandung kemih kosong dengan memasang kateter urin foley menetap (kandung kemih penuh menghambat kontraksi miometrium).',
        drugOrTool: 'Kateter Nelaton / Foley no. 16 + Masase',
      },
      {
        phase: '2. Kompresi Bimanual Interna (KBI)',
        action: 'Lakukan KBI hingga 5 menit',
        details: 'Masukkan tangan obstetrik ke dalam lumen vagina, kepalkan tinju di forniks anterior, tekan dinding anterior uterus. Tangan luar memegang dinding posterior uterus dan menekan fundus ke arah tinju dalam. Tahan selama 5 menit.',
        drugOrTool: 'Sarung Tangan Panjang Steril (DTT)',
      },
      {
        phase: '3. Evaluasi Hasil KBI',
        action: 'Periksa kontraksi uterus',
        details: 'Jika berkontraksi kuat: pertahankan KBI selama 2 menit tambahan, perlahan keluarkan tangan, awasi kala IV ketat tiap 15 menit. Jika TIDAK berkontraksi dalam 5 menit: ajarkan keluarga melakukan Kompresi Bimanual Eksterna (KBE).',
        drugOrTool: 'Edukasi KBE pada Suami / Keluarga',
      },
      {
        phase: '4. Medikamentosa Uterotonika Kombinasi & Asam Traneksamat',
        action: 'Pemberian Uterotonika Dosis Agresif',
        details: 'Berikan Oksitosin 20-40 IU dalam 1000 ml RL tetesan cepat (60 tetes/menit). Berikan Ergometrin 0,2 mg IM (jika TIDAK ada hipertensi). Berikan Misoprostol 800 - 1000 mcg per rektal. Berikan Asam Traneksamat 1 gram (10 ml) IV bolus perlahan dalam 10 menit.',
        drugOrTool: 'Oksitosin 20-40 IU, Misoprostol 800-1000 mcg rektal, Asam Traneksamat 1 g IV',
      },
      {
        phase: '5. Tamponade Balon Kondom Kateter Hidrostatik',
        action: 'Pemasangan Balon Tamponade Intrauterin Sederhana',
        details: 'Ikat kondom steril pada ujung kateter foley dengan benang sutra DTT. Masukkan ke kavum uteri hingga melewati OUI. Isi kondom dengan 300 - 500 ml cairan NaCl 0.9% / RL hangat melalui kateter menggunakan spuit 50 ml hingga perdarahan berhenti.',
        drugOrTool: 'Kondom steril + Kateter Foley + Benang Sutra + Cairan NaCl 500 ml',
      },
      {
        phase: '6. Resusitasi Cairan 2 Jalur & Rujukan Segera',
        action: 'Infus 2 Jalur Kaliber Besar (Abocath 16G/18G)',
        details: 'Guyur Ringer Laktat 1-2 Liter pertama cepat dalam 15-20 menit bila pasien syok. Hubungi PONEK RS rujukan via Sisrute / Telepon, sertakan Bidan mendampingi dengan KBI/KBE di ambulans.',
        drugOrTool: 'Abocath 16G/18G (2 jalur) + Cairan Kristaloid RL Hangat',
      },
    ],
    warningAlerts: [
      'Jangan tunda rujukan hanya untuk menunggu obat bekerja bila perdarahan terus memancar!',
      'Periksa selalu robekan jalan lahir (laserasi perineum derajat 3/4 atau robekan porsio) yang sering luput pada HPP.',
    ],
    sourceReference: 'Modul Pelatihan PONED Kemenkes RI & Panduan Praktik Klinis POGI',
  },
  {
    id: 'protokol-triple-eliminasi',
    title: 'Tata Laksana Triple Eliminasi (HIV, Sifilis, Hepatitis B)',
    category: 'Kelompok Rentan',
    summary: 'Pedoman Pencegahan Penularan Ibu ke Anak (PPIA / PMTCT) untuk memutus rantai transmisi vertikal ketiga infeksi menular maternal.',
    indications: [
      'Ibu hamil dengan hasil tes cepat (rapid test) HIV Reaktif',
      'Ibu hamil dengan hasil tes Sifilis (TP Rapid / RPR) Reaktif',
      'Ibu hamil dengan HBsAg Reaktif pada skrining antenatal terpadu',
    ],
    steps: [
      {
        phase: '1. Konseling Non-Judgmental & Kerahasiaan Terjamin',
        action: 'Informed Consent & Pendampingan Psikologis',
        details: 'Sampaikan hasil pemeriksaan dengan empati di ruang tertutup. Jamin kerahasiaan medis. Jelaskan bahwa penularan ke bayi dapat dicegah hampir 100% dengan terapi medis yang tepat.',
        drugOrTool: 'Ruang Konseling Privasi KIA Puskesmas',
      },
      {
        phase: '2. Tatalaksana HIV Maternal (PPIA)',
        action: 'Inisiasi Terapi ARV Segera Tanpa Menunggu CD4',
        details: 'Berikan rejimen lini pertama kombinasi dosis tetap (FDC: TDF 300 mg + 3TC 300 mg + DTG 50 mg) 1 tablet sekali sehari pada malam hari. Evaluasi kepatuhan minum obat. Konseling persalinan aman dan pilihan nutrisi bayi (ASI eksklusif vs susu formula eksklusif - tidak boleh campur/mixed feeding).',
        drugOrTool: 'ARV TLD (Tenofovir + Lamivudin + Dolutegravir)',
      },
      {
        phase: '3. Tatalaksana Sifilis Maternal',
        action: 'Injeksi Benzatin Benzilpenisilin G',
        details: 'Sifilis Dini (< 1 tahun / primer / sekunder): Injeksi Benzatin Penisilin 2.4 juta IU IM dosis tunggal (1.2 juta IU pada masing-masing bokong kiri dan kanan). Sifilis Lanjut (> 1 tahun / tidak diketahui onset): 2.4 juta IU IM seminggu sekali selama 3 minggu berturut-turut. Lakukan skin test alergi terlebih dahulu. Obati pasangan seksual!',
        drugOrTool: 'Benzatin Benzilpenisilin 2.4 juta IU IM',
      },
      {
        phase: '4. Tatalaksana Hepatitis B Maternal & Penyelamatan Neonatus',
        action: 'Rencana Pemberian HBIg & Vaksin Hepatitis B-0',
        details: 'Ibu HBsAg (+): Siapkan koordinasi pengadaan HBIg (Hepatitis B Immunoglobulin). Bayi baru lahir WAJIB diberikan HBIg 0,5 ml IM pada paha kiri dan Vaksin Hepatitis B-0 (0,5 ml) pada paha kanan dalam tempo < 12 jam (maksimal 24 jam) setelah lahir. Bayi tetap dapat diberikan ASI.',
        drugOrTool: 'HBIg 0,5 ml IM + Vaksin Hepatitis B-0 (0,5 ml IM)',
      },
      {
        phase: '5. Profilaksis ARV Bayi Lahir dari Ibu HIV',
        action: 'Pemberian Zidovudin / Nevirapin pada Bayi',
        details: 'Berikan Zidovudin oral 4 mg/kgBB 2 kali sehari sejak lahir (usia < 6-12 jam) hingga usia 6 minggu. Rencanakan pemeriksaan tes virologis EID (Early Infant Diagnosis) PCR HIV pada usia 6 minggu.',
        drugOrTool: 'Sirup Zidovudin 10 mg/ml oral',
      },
    ],
    warningAlerts: [
      'Jangan lakukan tindakan invasif buatan (amniotomi dini, episiotomi rutin, ekstraksi vakum jika tidak mendesak) pada ibu HIV/HepB untuk meminimalkan paparan darah ibu ke bayi!',
    ],
    sourceReference: 'Permenkes No. 52 Tahun 2017 tentang Eliminasi Penularan HIV, Sifilis, dan Hepatitis B dari Ibu ke Anak',
  },
  {
    id: 'protokol-kehamilan-remaja',
    title: 'Asuhan Kehamilan Remaja (< 20 Tahun) & Pendampingan Komprehensif',
    category: 'Kelompok Rentan',
    summary: 'Pendekatan asuhan klinis, psikososial, dan gizi spesifik untuk ibu hamil usia remaja guna mencegah morbiditas maternal dan stunting generasi penerus.',
    indications: [
      'Ibu hamil berusia < 20 tahun (remaja awal 10-14 tahun atau remaja akhir 15-19 tahun)',
      'Risiko biologis tinggi: Panggul sempit, preeklampsia dini, BBLR, KEK (LILA < 23.5 cm)',
      'Risiko psikososial: Penolakan keluarga, putus sekolah, isolasi sosial, depresi perinatal',
    ],
    steps: [
      {
        phase: '1. Pendekatan Ramah Remaja (PKPR)',
        action: 'Membangun Trust & Komunikasi Terbuka',
        details: 'Gunakan nada bicara hangat tanpa menghakimi atau menyalahkan. Berikan ruang bertanya bebas ketakutan. Libatkan pendamping yang dipercaya oleh remaja (ibu, kerabat, atau teman).',
        drugOrTool: 'Pelayanan Ramah PKPR Puskesmas',
      },
      {
        phase: '2. Deteksi Dini Disproporsi Sefalopelvik (CPD) & Panggul Sempit',
        action: 'Pengukuran Tinggi Badan & Pelvimetri Klinis',
        details: 'Jika TB < 145 cm atau panggul belum mencapai kematangan osteologis sempurna, waspadai risiko partus macet. Rencanakan konsultasi USG dan rujukan elektif persalinan ke RS di usia kehamilan 36-37 minggu.',
        drugOrTool: 'Pita Ukur TB / Microtoise + Pelvimetri',
      },
      {
        phase: '3. Intervensi Gizi Intensif & Pencegahan Anemia/Stunting',
        action: 'Pemberian Makanan Tambahan (PMT) Pemulihan & TTD',
        details: 'Bila LILA < 23.5 cm: berikan PMT berbasis pangan lokal tinggi protein hewani (telur, ikan, daging) selama 90 hari. Berikan Tablet Tambah Darah (TTD) 60 mg besi elemental + 400 mcg asam folat setiap hari, awasi efek mual.',
        drugOrTool: 'PMT Lokal Kaya Protein + TTD 90 Tablet + Kalsium 1.5 g/hari',
      },
      {
        phase: '4. Skrining Depresi & Perlindungan Hak Pendidikan',
        action: 'Skrining Edinburgh Postnatal Depression Scale (EPDS)',
        details: 'Evaluasi risiko distres psikologis, kecemasan, ide menyakiti diri. Berikan konseling kesehatan mental bekerja sama dengan psikolog Puskesmas. Advokasi keberlanjutan sekolah atau kejar paket.',
        drugOrTool: 'Kuesioner EPDS & Jejaring Konseling Psikolog Puskesmas',
      },
    ],
    warningAlerts: [
      'Remaja memiliki angka kejadian preeklampsia 2-3 kali lipat lebih tinggi dibanding usia reproduksi sehat. Lakukan pemantauan MAP dan tensi ketat pada setiap kunjungan ANC!',
    ],
    sourceReference: 'Buku Pedoman Standar Pelayanan Kesehatan Peduli Remaja (PKPR) Kemenkes RI',
  },
  {
    id: 'protokol-kdrt-trauma',
    title: 'Tata Laksana Asuhan Ibu Hamil Korban KDRT & Trauma Fisik/Psikis',
    category: 'Kelompok Rentan',
    summary: 'Protokol asuhan kebidanan aman dan rahasia bagi ibu hamil yang mengalami kekerasan dalam rumah tangga (KDRT) atau kekerasan seksual.',
    indications: [
      'Terdapat memar, luka robek, fraktur, atau trauma tumpul abdomen yang tidak sesuai dengan riwayat jatuh biasa',
      'Pasien tampak sangat cemas, takut berlebihan bila pasangan tidak mendampingi atau pasangan menolak meninggalkan ruang periksa',
      'Pengakuan langsung ibu tentang ancaman, penganiayaan fisik, ekonomi, atau emosional',
    ],
    steps: [
      {
        phase: '1. Pastikan Ruang Periksa Terpisah & Aman',
        action: 'Pisahkan Pasien dari Pasangan dengan Dalih Klinis',
        details: 'Gunakan alasan prosedur teknis (misal: "Ibu perlu ditimbang dan dilakukan pemeriksaan dalam steril di ruang tindakan khusus tanpa pendamping") untuk berbicara berdua dengan pasien.',
        drugOrTool: 'Ruang Pemeriksaan Tertutup & Berpintu Tertutup',
      },
      {
        phase: '2. Terapkan Pendekatan LIVES WHO',
        action: 'Listen, Inquire, Validate, Enhance Safety, Support',
        details: 'Dengarkan tanpa memotong (Listen). Validasi perasaannya ("Apa yang terjadi bukan kesalahan Ibu"). Jangan mendesak jika pasien belum siap bercerita. Tanyakan apakah pasien merasa aman pulang ke rumah saat ini.',
        drugOrTool: 'Konseling Trauma-Informed Care',
      },
      {
        phase: '3. Pemeriksaan Trauma Obstetrik & Deteksi Solusio Plasenta',
        action: 'Pemeriksaan Abdomen & Denyut Jantung Janin Cermat',
        details: 'Periksa adakah tanda ketegangan dinding perut (uterus tegang seperti papan / woody hard uterus), perdarahan jalan lahir gelap, atau gawat janin (DJJ bradikardi/takikardi) yang mengarah pada solusio plasenta akibat benturan.',
        drugOrTool: 'Doppler Fetal Monitor + Spekulum Steril',
      },
      {
        phase: '4. Dokumentasi Medis Obyektif (Tanpa Kode Eksternal Mencolok)',
        action: 'Catat Temuan Fisik dengan Anatomi Body Chart',
        details: 'Dokumentasikan lokasi persis luka, ukuran, warna luka memar secara objektif tanpa opini subjektif. Dokumentasi ini dapat berguna sebagai alat bukti medikolegal (visum et repertum) bila pasien memilih jalur hukum.',
        drugOrTool: 'Rekam Medis Rahasia Bersandi Terkunci',
      },
      {
        phase: '5. Rencana Keselamatan Darurat & Jejaring Rujukan Terpadu',
        action: 'Koneksi ke UPTD PPA / P2TP2A / Dinas Sosial Setempat',
        details: 'Bantu pasien membuat "Safety Plan" (nomor darurat yang bisa dihubungi diam-diam, tempat aman sementara). Hubungi konselor UPTD Perlindungan Perempuan dan Anak / Dinas Sosial dengan izin pasien.',
        drugOrTool: 'Kontak Hotline Sahabat Perempuan dan Anak (SAPA 129 / P2TP2A)',
      },
    ],
    warningAlerts: [
      'JANGAN PERNAH mengkonfrontasi atau memarahi pasangan pelaku di fasilitas kesehatan, karena dapat membahayakan keselamatan ibu saat tiba di rumah!',
      'Kerahasiaan adalah syarat mutlak; jangan menulis informasi KDRT di Buku KIA yang dibawa pulang oleh keluarga.',
    ],
    sourceReference: 'Panduan Pelayanan Kesehatan bagi Korban Kekerasan terhadap Perempuan dan Anak Kemenkes RI & WHO Clinical Guidelines',
  },
  {
    id: 'protokol-rujukan-baksokuda',
    title: 'Standar Rujukan Maternal BAKSOKUDA & Komunikasi Efektif SBAR',
    category: 'Rujukan & Emergensi',
    summary: 'Pedoman kelengkapan rujukan maternal gawat darurat dari fasilitas primer ke RS PONEK untuk mencegah keterlambatan (3 Terlambat).',
    indications: [
      'Semua kasus gawat darurat obstetri (PEB/Eklampsia, HPP, Syok, Partus Tak Maju, Gawat Janin, Infeksi Berat)',
      'Kasus risiko tinggi yang tidak dapat ditangani tuntas di fasilitas primer',
    ],
    steps: [
      {
        phase: 'B - Bidan / Tenaga Kesehatan Terlatih',
        action: 'Pendampingan Aktif Selama Transportasi',
        details: 'Bidan atau dokter wajib mendampingi pasien di dalam ambulans. Bidan membawa partus set steril, tensimeter, stetoskop, dan perlengkapan resusitasi darurat.',
        drugOrTool: 'Bidan Pendamping Berkompetensi APN/PONED',
      },
      {
        phase: 'A - Alat Medis Siaga',
        action: 'Kelengkapan Alat di Ambulans',
        details: 'Tabung Oksigen terisi penuh dengan flowmeter & kanul/sungkup, Suction lendir bayi, Balon resusitasi (bag-valve-mask), Tensimeter, Termometer, Doppler DJJ, Sarung tangan steril, Bak instrumen.',
        drugOrTool: 'Emergency Kit Box Maternal & Neonatal',
      },
      {
        phase: 'K - Keluarga & Calon Donor Darah',
        action: 'Pendamping Keluarga Dekat',
        details: 'Suami atau anggota keluarga pembuat keputusan harus ikut serta. Minimal 2 orang calon pendonor darah dengan golongan darah sesuai ikut serta bila dicurigai perdarahan.',
        drugOrTool: 'Suami / Keluarga Penanggung Jawab',
      },
      {
        phase: 'S - Surat Rujukan Lengkap (Resume Medis SBAR)',
        action: 'Dokumentasi Resmi Terintegrasi',
        details: 'Tuliskan Situation (identitas & keluhan utama), Background (G P A, usia kehamilan, riwayat penyakit), Assessment (TTV terbaru, hasil lab, diagnosis kerja), Recommendation (terapi yang sudah diberikan & alasan rujukan).',
        drugOrTool: 'Formulir Rujukan Resmi + Buku KIA + Akun SISRUTE',
      },
      {
        phase: 'O - Obat-obatan Esensial Selama Perjalanan',
        action: 'Lanjutkan Terapi Cairan & Medikamentosa',
        details: 'Cairan infus IV tetap mengalir (misal: RL dengan drip MgSO4 atau Oksitosin). Bawa ampul cadangan MgSO4, Kalsium Glukonat, Oksitosin, Metergin, Spuit disposable 5/10 ml.',
        drugOrTool: 'Tas Obat Emergensi (Emergency Drug Kit)',
      },
      {
        phase: 'K - Kendaraan Siaga (Ambulans)',
        action: 'Ambulans Siaga 24 Jam',
        details: 'Ambulans dalam kondisi prima, bensin penuh, sirine & lampu rotator berfungsi, sopir siaga, jalur evakuasi bebas hambatan telah dikoordinasikan.',
        drugOrTool: 'Ambulans Fasilitas Kesehatan',
      },
      {
        phase: 'U - Uang / Jaminan Pembiayaan',
        action: 'Jaminan Kesehatan Pasien Siap',
        details: 'Kartu BPJS Kesehatan / KIS PBI aktif, Jampersal, KTP dan KK asli untuk mempercepat proses administrasi pendaftaran IGD RS PONEK.',
        drugOrTool: 'Kartu BPJS Kesehatan / KIS / Jampersal',
      },
      {
        phase: 'DA - Doa & Kesiapan Donor Darah',
        action: 'Dukungan Spiritual & Solidaritas Darah',
        details: 'Bimbingan doa untuk menenangkan pasien dan keluarga. Koordinasi dengan PMI atau bank darah RS rujukan bila diperlukan transfusi PRC segera.',
        drugOrTool: 'Kontak Bank Darah RSUD / PMI Setempat',
      },
    ],
    warningAlerts: [
      'Selalu hubungi rumah sakit rujukan terlebih dahulu (Early Notification via Telepon / SISRUTE) sebelum ambulans berangkat agar tim IGD PONEK RS rujukan telah bersiap menyambut pasien!',
    ],
    sourceReference: 'Pedoman Sistem Rujukan Maternal dan Neonatal Kemenkes RI',
  },
];
