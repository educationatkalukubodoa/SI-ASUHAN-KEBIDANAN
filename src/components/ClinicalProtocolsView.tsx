import React, { useState } from 'react';
import { CLINICAL_PROTOCOLS, ClinicalProtocol } from '../data/clinicalProtocols';
import { Search, BookOpen, AlertTriangle, ShieldCheck, ChevronDown, ChevronUp, Syringe } from 'lucide-react';

export const ClinicalProtocolsView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedProtocolId, setExpandedProtocolId] = useState<string>('protokol-mgso4-peb');

  const filteredProtocols = CLINICAL_PROTOCOLS.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.steps.some((s) => s.action.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 bg-teal-900 text-white rounded-xl shadow-xs">
        <span className="text-xs uppercase tracking-wider text-teal-300 font-semibold block">
          Pedoman Praktis Kebidanan
        </span>
        <h1 className="text-xl font-bold tracking-tight text-white mt-0.5">
          Standar Protokol Klinis & Algoritma Tata Laksana
        </h1>
        <p className="text-xs text-teal-100 mt-1 max-w-3xl">
          Disusun berdasarkan Buku Saku Pelayanan Kesehatan Ibu di Fasilitas Kesehatan Tingkat Pertama (Kemenkes RI),
          Pedoman Nasional Pelayanan Kedokteran (PNPK) POGI, dan Standar Asuhan Ikatan Bidan Indonesia (IBI).
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pedoman / obat (mis. MgSO4, Oksitosin, PPIA)..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700 bg-white"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Pedoman
          </button>
          <button
            onClick={() => setSelectedCategory('Kasus Kompleks')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              selectedCategory === 'Kasus Kompleks'
                ? 'bg-white text-rose-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kasus Kompleks
          </button>
          <button
            onClick={() => setSelectedCategory('Kelompok Rentan')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              selectedCategory === 'Kelompok Rentan'
                ? 'bg-white text-purple-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kelompok Rentan
          </button>
          <button
            onClick={() => setSelectedCategory('Rujukan & Emergensi')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              selectedCategory === 'Rujukan & Emergensi'
                ? 'bg-white text-blue-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rujukan & Emergensi
          </button>
        </div>
      </div>

      {/* Protocol List */}
      <div className="space-y-4">
        {filteredProtocols.map((protocol) => {
          const isExpanded = expandedProtocolId === protocol.id;

          return (
            <div
              key={protocol.id}
              className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs transition-all"
            >
              {/* Protocol Header (Click to expand) */}
              <div
                onClick={() => setExpandedProtocolId(isExpanded ? '' : protocol.id)}
                className="p-4 cursor-pointer hover:bg-slate-50 transition-colors flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-teal-800">{protocol.category}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500">{protocol.sourceReference}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{protocol.title}</h3>
                  <p className="text-xs text-slate-600 max-w-3xl">{protocol.summary}</p>
                </div>

                <div className="shrink-0 text-slate-400 p-1">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>

              {/* Protocol Expanded Body */}
              {isExpanded && (
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-6 text-xs">
                  {/* Indications */}
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                      Indikasi Klinis / Kapan Diberlakukan:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                      {protocol.indications.map((ind, i) => (
                        <li key={i}>{ind}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Step-by-Step Actions */}
                  <div className="space-y-3">
                    <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                      Urutan Langkah Klinis Terstruktur:
                    </span>
                    <div className="space-y-2">
                      {protocol.steps.map((st, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-3 bg-white border border-slate-200 rounded-lg space-y-1"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <strong className="text-slate-900 font-bold">{st.phase}</strong>
                            {st.drugOrTool && (
                              <span className="font-mono text-[11px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 w-fit">
                                {st.drugOrTool}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-800 font-semibold">{st.action}</p>
                          <p className="text-slate-600 whitespace-pre-line">{st.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Warning Box */}
                  {protocol.warningAlerts?.length > 0 && (
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg space-y-1 text-rose-900">
                      <strong className="flex items-center gap-1.5 font-bold text-rose-950">
                        <AlertTriangle className="w-4 h-4 text-rose-700" />
                        Peringatan Keselamatan Maternal / Hal yang Dilarang (Do Not Harm):
                      </strong>
                      <ul className="list-disc list-inside space-y-1 pt-1">
                        {protocol.warningAlerts.map((w, wIdx) => (
                          <li key={wIdx} className="font-medium">
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
