import React, { useState } from 'react';
import { Patient } from '../types/midwifery';
import { Send, Sparkles, AlertTriangle, ShieldCheck, UserCheck, Stethoscope } from 'lucide-react';

interface AiConsultantViewProps {
  patients: Patient[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AiConsultantView: React.FC<AiConsultantViewProps> = ({ patients }) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Halo Bidan dan Rekan Sejawat Tenaga Kesehatan. Saya siap mendampingi konsultasi tata laksana klinis seluruh Model Asuhan Kebidanan, kasus kompleks obstetri (PEB, HPP, Syok, Partus Macet, Sepsis) dan pendampingan kelompok rentan (Remaja, Triple Eliminasi HIV/Sifilis/HepB, KDRT, KEK). Anda dapat memilih pasien di atas untuk menyertakan data klinis atau bertanya langsung.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const quickQuestions = [
    'Bagaimana dosis pemeliharaan MgSO4 jika waktu tempuh rujukan ke RS PONEK memakan waktu lebih dari 2 jam?',
    'Langkah pencegahan transmisi vertikal saat persalinan pada ibu dengan hasil HBsAg reaktif?',
    'Apa saja syarat mutlak pemberian Ergometrin pada kala III/IV dan kapan dikontraindikasikan?',
    'Pendekatan informed consent dan safety plan yang aman untuk ibu hamil korban KDRT di ruang periksa?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const selectedPatient = patients.find((p) => p.id === selectedPatientId);

    const userMsg: Message = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/midwifery/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          contextData: selectedPatient
            ? {
                nama: selectedPatient.name,
                usia: selectedPatient.age,
                status: `G${selectedPatient.gravida}P${selectedPatient.para}A${selectedPatient.abortus} UK ${selectedPatient.gestationalAgeWeeks} mgg`,
                ttv: selectedPatient.vitals,
                lab: selectedPatient.labs,
                keluhan: selectedPatient.chiefComplaint,
                kategoriKomplikasi: selectedPatient.complexCategories,
                kerentanan: selectedPatient.vulnerabilities,
              }
            : null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.reply || 'Tidak ada respon yang diterima.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        // Fallback intelligent answer
        getFallbackAnswer(text);
      }
    } catch (err: any) {
      console.warn('Consult error, using clinical fallback:', err);
      getFallbackAnswer(text);
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackAnswer = (query: string) => {
    let reply = '';
    const qLower = query.toLowerCase();

    if (qLower.includes('mgso4') || qLower.includes('peb') || qLower.includes('eklampsia')) {
      reply = `**Tata Laksana MgSO4 & Preeklampsia Berat (PNPK POGI / Kemenkes RI):**\n
1. **Dosis Awal (Loading Dose)**: 4 gram MgSO4 40% (10 ml) + 10 ml Aquabidest steril IV perlahan dalam 5-10 menit.
2. **Dosis Pemeliharaan (Maintenance)**: 6 gram MgSO4 40% dalam 500 ml Ringer Laktat, berikan 28 tetes/menit (1 gram/jam) secara kontinu.
3. **Jika Rujukan Lebih dari 2 Jam**: Pertahankan infus MgSO4 berjalan di dalam ambulans. Evaluasi setiap jam: Refleks patella (+) kuat, frekuensi napas >= 16x/m, dan urin minimal 30 ml/jam via kateter.
4. **Antidotum**: Sediakan selalu Kalsium Glukonat 10% 1 gram (10 ml) IV bolus pelan 3 menit bila terjadi tanda intoksikasi/henti napas.
5. **Antihipertensi**: Berikan Nifedipin 10 mg oral jika TD >= 160/110 mmHg.`;
    } else if (qLower.includes('hbsag') || qLower.includes('hepatitis') || qLower.includes('triple')) {
      reply = `**Tata Laksana Ibu Hamil Hepatitis B (Triple Eliminasi PPIA):**\n
1. **Penyelamatan Neonatus (Golden Period < 24 jam)**:
   - Berikan **HBIg (Hepatitis B Imunoglobulin) 0,5 ml IM** pada paha anterolateral kiri.
   - Berikan **Vaksin Hepatitis B-0 (0,5 ml IM)** pada paha anterolateral kanan.
   - Keduanya diberikan simultan dalam kurun waktu < 12 jam (maksimal 24 jam) setelah lahir.
2. **Pemberian ASI**: Bayi TETAP BOLEH diberikan ASI eksklusif setelah menerima HBIg dan vaksin HepB-0.
3. **Persalinan**: Minimalkan tindakan invasif (hindari amniotomi dini atau episiotomi bila tidak darurat).`;
    } else if (qLower.includes('ergometrin')) {
      reply = `**Penggunaan Ergometrin pada HPP / Perdarahan:**\n
- **Indikasi**: Atonia uteri pascapersalinan primer.
- **Dosis**: 0,2 mg IM atau IV perlahan.
- **KONTRAINDIKASI MUTLAK**: Preeklampsia, Eklampsia, dan Hipertensi Kronik (memicu vasospasme serebral masif dan stroke maternal). Pada pasien hipertensi, gunakan **Oksitosin** 20-40 IU drip dan **Misoprostol** 800-1000 mcg per rektal serta Asam Traneksamat 1 gram IV.`;
    } else {
      reply = `**Prinsip Umum Stabilisasi Maternal (Standar Kemenkes RI):**\n
1. Selalu pastikan jalan napas (Airway), pernapasan (Breathing dengan O2 4-6 Lpm), dan sirkulasi (Circulation dengan infus 2 jalur kaliber besar).
2. Lakukan rujukan berencana dengan prinsip **BAKSOKUDA** (Bidan, Alat, Keluarga, Surat rujukan SBAR, Obat-obatan, Kendaraan siaga, Uang/Jaminan, Doa & Donor darah).
3. Lakukan Early Notification ke IGD PONEK RS rujukan via SISRUTE atau telepon sebelum ambulans berangkat.`;
    }

    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 bg-teal-900 text-white rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-teal-300 font-semibold block">
            Clinical Midwifery Decision Support
          </span>
          <h1 className="text-xl font-bold tracking-tight text-white mt-0.5">
            Konsultan Klinis AI Sp.OG & Bidan Senior
          </h1>
          <p className="text-xs text-teal-100 mt-1 max-w-2xl">
            Asisten konsultasi berbasis bukti untuk penanganan seluruh Model Asuhan Kebidanan, kasus darurat obstetri,
            dan asuhan komprehensif kelompok rentan di Fasilitas Pelayanan Kesehatan dan Praktik Mandiri Bidan.
          </p>
        </div>

        {/* Patient Context Dropdown */}
        <div className="shrink-0 bg-teal-800 p-2.5 rounded-lg border border-teal-700 text-xs text-white">
          <label className="block text-teal-200 mb-1 font-medium">Sertakan Data Pasien (Opsional):</label>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="w-full sm:w-64 p-1.5 bg-teal-950 text-white border border-teal-600 rounded text-xs"
          >
            <option value="">Pertanyaan Klinis Umum (Tanpa Pasien)</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.medicalRecordNo}) - {p.age} thn
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="space-y-1.5">
        <span className="text-xs text-slate-500 font-semibold block">Pertanyaan Klinis Cepat (Klik untuk Bertanya):</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-left p-2.5 bg-white border border-slate-200 hover:border-teal-700 rounded-lg text-xs text-slate-700 hover:text-teal-900 transition-colors shadow-xs"
            >
              · {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="bg-white border border-slate-200 rounded-lg flex flex-col h-[520px] shadow-xs overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-3xl p-3.5 rounded-lg text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-teal-800 text-white'
                    : 'bg-slate-50 text-slate-800 border border-slate-200'
                }`}
              >
                {m.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 mb-2 pb-1 border-b border-slate-200 font-bold text-teal-800 text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>Konsultan Klinis Fetomaternal & Bidan</span>
                  </div>
                )}
                <div className="whitespace-pre-line">{m.content}</div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-1 px-1">{m.timestamp}</span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-spin" />
              <span>Menganalisis pedoman klinis Kemenkes RI & POGI...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Tuliskan pertanyaan klinis / situasi kegawatdaruratan kebidanan..."
            className="flex-1 p-2.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-teal-700"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputMessage.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-teal-800 hover:bg-teal-900 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
          >
            <Send className="w-4 h-4" />
            <span>Kirim</span>
          </button>
        </div>
      </div>
    </div>
  );
};
