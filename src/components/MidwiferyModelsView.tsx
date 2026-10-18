import React, { useState } from 'react';
import { MIDWIFERY_CARE_MODELS, MidwiferyCareModel, MidwiferyAction } from '../data/midwiferyModels';
import { Search, Sparkles, AlertTriangle, ShieldCheck, CheckCircle2, Copy, Check, BookOpen, Layers, ChevronDown, ChevronUp, Star } from 'lucide-react';

export const MidwiferyModelsView: React.FC = () => {
  const [selectedModelId, setSelectedModelId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyHighlights, setOnlyHighlights] = useState<boolean>(false);
  const [expandedModelId, setExpandedModelId] = useState<string>('model-kasus-kompleks');
  const [copiedActionId, setCopiedActionId] = useState<string | null>(null);

  // Filter models
  const filteredModels = MIDWIFERY_CARE_MODELS.filter((model) => {
    if (selectedModelId !== 'all' && model.id !== selectedModelId) return false;
    if (onlyHighlights && !model.isHighPriorityHighlight) return false;
    return true;
  });

  const handleCopyAction = (action: MidwiferyAction) => {
    const textToCopy = `[${action.code}] ${action.title}
Standar: ${action.standardReference} | Fase: ${action.phase}
Tindakan: ${action.description}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedActionId(action.id);
    setTimeout(() => setCopiedActionId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 bg-teal-900 text-white rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-teal-300 font-semibold block">
              Pedoman Nasional Kebidanan Indonesia
            </span>
            <span className="text-teal-400">·</span>
            <span className="text-xs text-teal-200">Kemenkes RI · IBI · POGI</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-1">
            Model Asuhan Kebidanan & Daftar Tindakan Klinis Terstandar
          </h1>
          <p className="text-xs text-teal-100 mt-1 max-w-3xl">
            Panduan komprehensif seluruh model asuhan kebidanan nasional dengan penekanan utama (highlight) pada
            <strong> Tata Laksana Kasus Kompleks Obstetri</strong> dan <strong>Pendampingan Kelompok Rentan</strong>.
          </p>
        </div>

        {/* Quick Highlight Toggle */}
        <div className="shrink-0 flex items-center gap-2 bg-teal-950/80 p-2 rounded-lg border border-teal-700/60">
          <button
            onClick={() => setOnlyHighlights(!onlyHighlights)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              onlyHighlights
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-teal-800 text-teal-200 hover:text-white'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyHighlights ? 'fill-current' : ''}`} />
            <span>Fokus: Kasus Kompleks & Kelompok Rentan</span>
          </button>
        </div>
      </div>

      {/* Control Strip: Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari tindakan klinis (misal: MgSO4, KBI, ARV, PMT, LIVES, MAK III)..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700 bg-white"
          />
        </div>

        {/* Model Filter Pills */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
          <button
            onClick={() => setSelectedModelId('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              selectedModelId === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Model ({MIDWIFERY_CARE_MODELS.length})
          </button>
          <button
            onClick={() => setSelectedModelId('model-kasus-kompleks')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              selectedModelId === 'model-kasus-kompleks'
                ? 'bg-white text-rose-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ★ Kasus Kompleks
          </button>
          <button
            onClick={() => setSelectedModelId('model-kelompok-rentan')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              selectedModelId === 'model-kelompok-rentan'
                ? 'bg-white text-purple-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ★ Kelompok Rentan
          </button>
          <button
            onClick={() => setSelectedModelId('model-coc')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              selectedModelId === 'model-coc'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Continuity of Care (CoC)
          </button>
          <button
            onClick={() => setSelectedModelId('model-woman-centered')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              selectedModelId === 'model-woman-centered'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Woman-Centered Care
          </button>
          <button
            onClick={() => setSelectedModelId('model-kolaborasi')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              selectedModelId === 'model-kolaborasi'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kolaborasi Interprofesional
          </button>
        </div>
      </div>

      {/* Models Display Accordion / Cards */}
      <div className="space-y-6">
        {filteredModels.map((model) => {
          const isExpanded = expandedModelId === model.id;

          // Filter actions within model by search query
          const actions = model.keyActions.filter((act) => {
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase();
            return (
              act.title.toLowerCase().includes(q) ||
              act.description.toLowerCase().includes(q) ||
              act.code.toLowerCase().includes(q) ||
              act.phase.toLowerCase().includes(q)
            );
          });

          return (
            <div
              key={model.id}
              className={`border rounded-xl overflow-hidden transition-all shadow-xs ${
                model.isHighPriorityHighlight
                  ? 'border-teal-500 bg-white ring-1 ring-teal-500/20'
                  : 'border-slate-200 bg-white'
              }`}
            >
              {/* Header Box */}
              <div
                onClick={() => setExpandedModelId(isExpanded ? '' : model.id)}
                className={`p-5 cursor-pointer transition-colors flex items-start justify-between gap-4 ${
                  model.isHighPriorityHighlight
                    ? 'bg-teal-50/40 hover:bg-teal-50/70 border-b border-teal-100'
                    : 'hover:bg-slate-50 border-b border-slate-100'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {model.isHighPriorityHighlight && (
                      <span className="font-bold text-teal-900 bg-teal-100 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                        <Star className="w-3 h-3 fill-teal-800 text-teal-800" />
                        PRIORITAS UTAMA / HIGHLIGHT
                      </span>
                    )}
                    <span className="text-slate-500 font-mono text-[11px]">{model.subtitle}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500 font-mono tabular-nums">
                      {actions.length} Tindakan Terstandar
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    {model.title}
                  </h2>

                  <p className="text-xs text-slate-600 max-w-4xl leading-relaxed">
                    {model.philosophy}
                  </p>
                </div>

                <div className="shrink-0 p-1 text-slate-400">
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-teal-700" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>

              {/* Expanded Action List & Regulatory Foundations */}
              {isExpanded && (
                <div className="p-6 space-y-6 text-xs bg-slate-50/30">
                  {/* Scope & Regulatory strip */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Dasar Regulasi */}
                    <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                      <strong className="text-slate-900 block font-semibold text-xs">
                        Dasar Regulasi & Standar Nasional:
                      </strong>
                      <ul className="space-y-1 text-slate-600">
                        {model.regulatoryBasics.map((reg, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-1.5">
                            <span className="text-teal-700 font-bold">·</span>
                            <span>{reg}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cakupan & Fase Asuhan */}
                    <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                      <strong className="text-slate-900 block font-semibold text-xs">
                        Cakupan & Fase Layanan:
                      </strong>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {model.scopeAndPhases.map((phase, pIdx) => (
                          <span
                            key={pIdx}
                            className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] border border-slate-200"
                          >
                            {phase}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Checklist */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                        Daftar Tindakan Klinis Berdasarkan Standar Kemenkes · IBI · POGI:
                      </h3>
                      <span className="text-[11px] text-slate-500">
                        Klik tombol &quot;Salin&quot; untuk menyertakan tindakan langsung ke SOAP
                      </span>
                    </div>

                    {actions.length === 0 ? (
                      <div className="p-4 bg-white border border-slate-200 rounded text-center text-slate-500">
                        Tidak ada tindakan yang cocok dengan kata kunci pencarian.
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {actions.map((act) => {
                          const isCopied = copiedActionId === act.id;

                          return (
                            <div
                              key={act.id}
                              className={`p-3.5 bg-white border rounded-lg transition-all space-y-1.5 shadow-xs ${
                                act.isComplexOrVulnerableHighlight
                                  ? 'border-teal-200 hover:border-teal-400'
                                  : 'border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                                    {act.code}
                                  </span>
                                  <h4 className="font-bold text-slate-900 text-xs">
                                    {act.title}
                                  </h4>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-[11px] text-slate-500 font-mono">
                                    {act.standardReference}
                                  </span>
                                  <span className="text-slate-300">·</span>
                                  <span className="text-[11px] text-teal-700 font-medium">
                                    {act.category}
                                  </span>
                                  <button
                                    onClick={() => handleCopyAction(act)}
                                    className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded transition-colors ml-2"
                                  >
                                    {isCopied ? (
                                      <>
                                        <Check className="w-3 h-3 text-emerald-700" />
                                        <span className="text-emerald-700">Tersalin!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3 text-slate-500" />
                                        <span>Salin</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>

                              <p className="text-xs text-slate-600 leading-relaxed pl-1">
                                {act.description}
                              </p>

                              <div className="text-[11px] text-slate-400 pl-1 font-mono">
                                Fase Asuhan: {act.phase}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
