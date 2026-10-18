import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System prompt for clinical Indonesian Midwifery
const MIDWIFERY_SYSTEM_INSTRUCTION = `Anda adalah Dokter Spesialis Obstetri & Ginekologi (Sp.OG) Konsultan Fetomaternal dan Bidan Senior Konsultan Standar Kemenkes RI, IBI (Ikatan Bidan Indonesia), dan POGI.
Tugas Anda adalah mendampingi Bidan di Fasilitas Pelayanan Kesehatan (Puskesmas, Klinik Pratama, Bidan Praktik Mandiri / BPM, Rumah Sakit) dalam mengelola seluruh Model Asuhan Kebidanan, kasus kompleks kebidanan, dan kelompok rentan.

Pegang teguh prinsip:
1. Keselamatan Ibu dan Bayi (Maternal & Neonatal Safety) sebagai prioritas absolut.
2. Deteksi Dini & Triage Cepat: Identifikasi red flags (Tekanan Darah ≥ 140/90 atau ≥ 160/110, Kejang/Nyeri kepala hebat/Pandangan kabur, Perdarahan aktif, Demam tinggi, Syok, Fetal distress DJJ < 110 atau > 160).
3. Protokol Penanganan Darurat Standar Nasional (MgSO4 untuk PEB/Eklampsia, KBI/KBE & Kondom Kateter untuk Atonia Uteri, Resusitasi BBL, Asam Traneksamat, dsb.).
4. Prinsip Stabilisasi Pra-Rujukan: BAKSOKUDA (Bidan/Tenaga kesehatan, Alat, Keluarga, Surat rujukan, Obat-obatan, Kendaraan/Transportasi, Uang, Doa/Darah).
5. Pendekatan Komprehensif dan Berperspektif Gender untuk Seluruh Model Asuhan Kebidanan dan Kelompok Rentan:
   - Kehamilan Remaja (< 20 tahun): Konseling ramah remaja, pencegahan komplikasi, pendampingan psikososial.
   - Triple Eliminasi (HIV, Sifilis, Hepatitis B): Protokol PPIA/PMTCT, profilaksis ARV, Benzatin Penisilin, HBIg & vaksin HepB pada bayi baru lahir.
   - Korban KDRT / Kekerasan Berbasis Gender: Kerahasiaan, informed consent, jejaring rujukan P2TP2A/Dinas Sosial.
   - Kemiskinan Ekstrem & Stunting: PMT pemulihan, edukasi 1000 HPK, koordinasi lintas program gizi.
   - Ibu Usia Tua (≥ 35 tahun), KEK (LILA < 23.5 cm), Anemia Berat (Hb < 8 g/dL).
Gunakan bahasa medis kebidanan Indonesia baku yang jelas, terstruktur, berbasis bukti ilmiah (evidence-based).`;

// 1. Analyze Complex Obstetric Case & Triage
app.post('/api/midwifery/analyze-case', async (req, res) => {
  try {
    const { patientData } = req.body;

    if (!aiClient) {
      return res.status(503).json({
        error: 'Layanan AI belum terhubung dengan API key. Menggunakan mode analisis algoritma bawaan sistem.',
      });
    }

    const prompt = `Analisis kasus kebidanan berikut dan tentukan tingkat risiko klinis, diagnosis banding, tindakan segera di Puskesmas, serta instruksi stabilisasi dan rujukan:

DATA PASIEN & TEMUAN KLINIS:
${JSON.stringify(patientData, null, 2)}

Format respon dalam JSON dengan struktur:
{
  "riskLevel": "Gawat Darurat Segera / Risiko Sangat Tinggi / Risiko Tinggi / Pemantauan Khusus",
  "meowsScoreInterpretation": "Penjelasan skor peringatan dini obstetri",
  "primaryDiagnosis": "Diagnosis kebidanan utama (nomenklatur standar)",
  "differentialDiagnosis": ["Daftar diagnosis banding"],
  "immediateActions": ["Langkah emergensi 1-2-3 yang harus dilakukan di Puskesmas saat ini"],
  "emergencyMedications": [
    {
      "name": "Nama obat (mis. MgSO4, Oksitosin, dll)",
      "dosage": "Dosis dan rute pemberian standar",
      "monitoring": "Parameter pemantauan wajib"
    }
  ],
  "baksokudaReferralPlan": {
    "recommendedFacility": "PONEK RS Rujukan (Tipe B/C)",
    "stabilizationSteps": ["Langkah stabilisasi sebelum ambulans jalan"],
    "sbarSummary": "Ringkasan komunikasi SBAR untuk dokter jaga IGD RS rujukan"
  },
  "vulnerableGroupConsiderations": ["Asuhan spesifik terkait kerentanan ibu (jika ada: remaja, KDRT, triple eliminasi, dsb.)"]
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: MIDWIFERY_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      },
    });

    const resultText = response.text || '{}';
    const parsed = JSON.parse(resultText);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error analyzing case:', error);
    res.status(500).json({ error: error.message || 'Gagal menganalisis kasus' });
  }
});

// 2. Generate Standard 7-Step Varney SOAP Documentation
app.post('/api/midwifery/generate-soap', async (req, res) => {
  try {
    const { patientData, triageNotes } = req.body;

    if (!aiClient) {
      return res.status(503).json({
        error: 'Layanan AI belum tersedia. Menggunakan format template SOAP bawaan.',
      });
    }

    const prompt = `Buatlah dokumentasi Asuhan Kebidanan SOAP resmi (7 Langkah Varney yang disarikan) untuk rekam medis Fasilitas Pelayanan Kesehatan / Praktik Kebidanan berdasarkan data pasien berikut:

DATA PASIEN:
${JSON.stringify(patientData, null, 2)}

CATATAN TAMBAHAN BIDAN:
${triageNotes || 'Tidak ada catatan tambahan'}

Berikan respon JSON dengan struktur:
{
  "subjektif": "Uraian anamnesa komprehensif (keluhan, riwayat hamil/bersalin/nifas, riwayat penyakit, status sosial/kerentanan)",
  "objektif": "Uraian pemeriksaan fisik lengkap (KU, Kesadaran, TTV, BB/TB/LILA, Head-to-toe, Leopold I-IV, DJJ, His, Pemeriksaan dalam VT jika relevan, Hasil Lab Hb/Protein/Triple Eliminasi)",
  "analisis": "Diagnosis nomenklatur kebidanan lengkap (G...P...A... umur ... thn hamil ... mgg dengan ... / Ibu inpartu kala ... dengan ... / Ibu nifas hari ke-... dengan ...), Masalah Potensial, Kebutuhan Tindakan Segera",
  "penatalaksanaan": [
    "Poin 1 penatalaksanaan lengkap",
    "Poin 2...",
    "KIE dan informed consent",
    "Pemberian terapi/obat",
    "Rencana rujukan/evaluasi pemantauan"
  ]
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: MIDWIFERY_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      },
    });

    const resultText = response.text || '{}';
    const parsed = JSON.parse(resultText);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error generating SOAP:', error);
    res.status(500).json({ error: error.message || 'Gagal menyusun SOAP' });
  }
});

// 3. Clinical Midwifery Consultation Chat
app.post('/api/midwifery/consult', async (req, res) => {
  try {
    const { message, contextData } = req.body;

    if (!aiClient) {
      return res.status(503).json({
        error: 'Layanan konsultasi AI sedang tidak aktif. Pastikan API key terpasang.',
      });
    }

    const prompt = `Pertanyaan Bidan / Nakes:
"${message}"

${contextData ? `Konteks Kasus Pasien Saat Ini:\n${JSON.stringify(contextData, null, 2)}` : ''}

Jawab dengan pedoman klinis Kemenkes RI, IBI, dan POGI. Sertakan dosis obat jelas jika menanyakan tata laksana medikamentosa, parameter evaluasi, serta kriteria rujukan yang aman. Singkat, padat, dan instruktif.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: MIDWIFERY_SYSTEM_INSTRUCTION,
      },
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Error in midwifery consult:', error);
    res.status(500).json({ error: error.message || 'Gagal memproses konsultasi' });
  }
});

// Vite middleware in dev or static files in prod
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(port, () => {
  console.log(`Server SI-Asuhan Kebidanan running on port ${port}`);
});
