/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  HelpCircle,
  Zap,
  Trash2,
  Plus,
  RotateCcw,
  Shield,
  Lock,
  X,
  RefreshCw,
} from 'lucide-react';
import { AuthUser, GameContentStore } from '../types/game';
import { apiClient } from '../services/apiClient';

interface ContentManagerViewProps {
  authUser: AuthUser;
  contentStore: GameContentStore;
  onContentChange: (updated: GameContentStore) => void;
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
  onRequestConfirm: (opts: {
    title: string;
    message: string;
    confirmLabel?: string;
    variant?: 'danger' | 'warning' | 'primary';
    onConfirm: () => Promise<void>;
  }) => void;
  onBack: () => void;
}

export const ContentManagerView: React.FC<ContentManagerViewProps> = ({
  authUser,
  contentStore,
  onContentChange,
  onNotify,
  onRequestConfirm,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'materials' | 'quizzes' | 'challenges'>('materials');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Add Material Form State
  const [matTitle, setMatTitle] = useState('');
  const [matTopic, setMatTopic] = useState('Cahaya & Alat Optik');
  const [matSummary, setMatSummary] = useState('');
  const [matPoints, setMatPoints] = useState('');
  const [matFormula, setMatFormula] = useState('');
  const [matApp, setMatApp] = useState('');
  const [matTileIndex, setMatTileIndex] = useState(1);
  const [isSavingMat, setIsSavingMat] = useState(false);

  const canManage = authUser.role === 'admin' || authUser.role === 'moderator';

  const materialsList = Object.values(contentStore.materials).sort(
    (a, b) => a.tileIndex - b.tileIndex
  );
  const quizzesList = Object.values(contentStore.quizzes).sort(
    (a, b) => a.tileIndex - b.tileIndex
  );
  const challengesList = Object.values(contentStore.challenges).sort(
    (a, b) => a.tileIndex - b.tileIndex
  );

  const handleDeleteMaterial = (id: string, title: string) => {
    onRequestConfirm({
      title: 'Hapus Materi Pembelajaran?',
      message: `Materi "${title}" akan dihapus secara permanen dari database. Data materi dan soal lainnya tidak akan terpengaruh.`,
      confirmLabel: 'Hapus Materi',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const res = await apiClient.deleteMaterial(id);
          onContentChange(res.content);
          onNotify('success', res.message || `Materi "${title}" berhasil dihapus.`);
        } catch (err: any) {
          onNotify('error', err.message || 'Gagal menghapus materi.');
        }
      },
    });
  };

  const handleDeleteQuiz = (id: string, title: string) => {
    onRequestConfirm({
      title: 'Hapus Soal Kuis?',
      message: `Soal kuis "${title}" akan dihapus dari bank soal MONOFIS. Soal kuis lainnya tetap aman tersimpan.`,
      confirmLabel: 'Hapus Soal',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const res = await apiClient.deleteQuiz(id);
          onContentChange(res.content);
          onNotify('success', res.message || `Kuis "${title}" berhasil dihapus.`);
        } catch (err: any) {
          onNotify('error', err.message || 'Gagal menghapus soal kuis.');
        }
      },
    });
  };

  const handleDeleteChallenge = (id: string, title: string) => {
    onRequestConfirm({
      title: 'Hapus Misi Tantangan?',
      message: `Tantangan "${title}" akan dihapus dari database. Tantangan lain tetap tidak berubah.`,
      confirmLabel: 'Hapus Tantangan',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const res = await apiClient.deleteChallenge(id);
          onContentChange(res.content);
          onNotify('success', res.message || `Tantangan "${title}" berhasil dihapus.`);
        } catch (err: any) {
          onNotify('error', err.message || 'Gagal menghapus tantangan.');
        }
      },
    });
  };

  const handleRestoreDefaults = () => {
    onRequestConfirm({
      title: 'Pulihkan Materi & Bank Soal Bawaan?',
      message:
        'Tindakan ini akan memulihkan seluruh 8 materi, 8 soal kuis, dan 6 tantangan bawaan MONOFIS ke database.',
      confirmLabel: 'Pulihkan Default',
      variant: 'warning',
      onConfirm: async () => {
        setIsRestoring(true);
        try {
          const res = await apiClient.restoreDefaultContent();
          onContentChange(res.content);
          onNotify('success', res.message);
        } catch (err: any) {
          onNotify('error', err.message || 'Gagal memulihkan materi bawaan.');
        } finally {
          setIsRestoring(false);
        }
      },
    });
  };

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matTitle.trim() || !matSummary.trim()) {
      onNotify('error', 'Judul dan ringkasan materi wajib diisi.');
      return;
    }
    setIsSavingMat(true);
    try {
      const keyPoints = matPoints
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      const res = await apiClient.addMaterial({
        title: matTitle.trim(),
        topic: matTopic.trim() || 'Cahaya & Alat Optik',
        summary: matSummary.trim(),
        keyPoints: keyPoints.length > 0 ? keyPoints : [matSummary.trim()],
        formula: matFormula.trim() || undefined,
        application: matApp.trim() || 'Penerapan dalam teknologi optik sehari-hari.',
        tileIndex: matTileIndex,
      });
      onContentChange(res.content);
      onNotify('success', `Materi "${res.material.title}" berhasil ditambahkan ke database.`);
      setMatTitle('');
      setMatSummary('');
      setMatPoints('');
      setMatFormula('');
      setMatApp('');
      setShowAddModal(false);
    } catch (err: any) {
      onNotify('error', err.message || 'Gagal menambahkan materi.');
    } finally {
      setIsSavingMat(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-5 px-4 space-y-4">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>

        <div className="flex items-center gap-2">
          {canManage ? (
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Hak Akses Kelola ({authUser.role.toUpperCase()})
            </span>
          ) : (
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Mode Baca Siswa (Hapus Terbatas Admin/Moderator)
            </span>
          )}
        </div>
      </div>

      {/* Title & Manager Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Bank Materi, Kuis &amp; Tantangan Fisika
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Kelola materi pembelajaran Cahaya &amp; Alat Optik yang tampil saat pion berhenti di papan.
          </p>
        </div>

        {canManage && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Materi</span>
            </button>
            <button
              onClick={handleRestoreDefaults}
              disabled={isRestoring}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRestoring ? 'animate-spin' : ''}`} />
              <span>Pulihkan Default</span>
            </button>
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-white p-1.5 rounded-2xl border-2 border-slate-200 shadow-xs text-xs font-black">
        <button
          onClick={() => setActiveTab('materials')}
          className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'materials'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Materi ({materialsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quizzes')}
          className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'quizzes'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Kuis ({quizzesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('challenges')}
          className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'challenges'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Tantangan ({challengesList.length})</span>
        </button>
      </div>

      {/* Materials List */}
      {activeTab === 'materials' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {materialsList.length === 0 ? (
            <div className="md:col-span-2 p-8 rounded-3xl bg-white border-2 border-dashed border-slate-200 text-center space-y-2">
              <p className="text-sm font-bold text-slate-700">Belum ada materi tersimpan.</p>
              <p className="text-xs text-slate-500">
                Tambahkan materi baru atau klik &quot;Pulihkan Default&quot; untuk mengembalikan materi awal.
              </p>
            </div>
          ) : (
            materialsList.map((mat) => (
              <div
                key={mat.id}
                className="p-4 rounded-2xl bg-white border-2 border-purple-100 hover:border-purple-300 shadow-sm flex flex-col justify-between gap-3 transition-all"
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                        Kotak #{mat.tileIndex} • {mat.topic}
                      </span>
                      <h3 className="font-black text-slate-900 text-sm sm:text-base mt-1">
                        {mat.title}
                      </h3>
                    </div>

                    {canManage && (
                      <button
                        onClick={() => handleDeleteMaterial(mat.id, mat.title)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer shrink-0"
                        title={`Hapus materi ${mat.title}`}
                        aria-label={`Hapus materi ${mat.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {mat.summary}
                  </p>
                </div>

                {mat.formula && (
                  <div className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 font-mono text-xs font-bold text-indigo-800">
                    {mat.formula}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Quizzes List */}
      {activeTab === 'quizzes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {quizzesList.length === 0 ? (
            <div className="md:col-span-2 p-8 rounded-3xl bg-white border-2 border-dashed border-slate-200 text-center space-y-2">
              <p className="text-sm font-bold text-slate-700">Belum ada soal kuis tersimpan.</p>
            </div>
          ) : (
            quizzesList.map((quiz) => (
              <div
                key={quiz.id}
                className="p-4 rounded-2xl bg-white border-2 border-amber-100 hover:border-amber-300 shadow-sm flex flex-col justify-between gap-2 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      Kotak #{quiz.tileIndex} • +{quiz.points} Poin
                    </span>
                    <h3 className="font-black text-slate-900 text-sm sm:text-base mt-1">
                      {quiz.title}
                    </h3>
                  </div>

                  {canManage && (
                    <button
                      onClick={() => handleDeleteQuiz(quiz.id, quiz.title)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer shrink-0"
                      title={`Hapus kuis ${quiz.title}`}
                      aria-label={`Hapus kuis ${quiz.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-700 font-medium leading-relaxed line-clamp-3">
                  {quiz.question}
                </p>
                <p className="text-[11px] text-slate-500 font-semibold">
                  Topik: {quiz.topic} ({quiz.options.length} opsi jawaban)
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Challenges List */}
      {activeTab === 'challenges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {challengesList.length === 0 ? (
            <div className="md:col-span-2 p-8 rounded-3xl bg-white border-2 border-dashed border-slate-200 text-center space-y-2">
              <p className="text-sm font-bold text-slate-700">Belum ada misi tantangan tersimpan.</p>
            </div>
          ) : (
            challengesList.map((ch) => (
              <div
                key={ch.id}
                className="p-4 rounded-2xl bg-white border-2 border-orange-100 hover:border-orange-300 shadow-sm flex flex-col justify-between gap-2 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                      Kotak #{ch.tileIndex} • +{ch.rewardPoints} Poin
                    </span>
                    <h3 className="font-black text-slate-900 text-sm sm:text-base mt-1">
                      {ch.title}
                    </h3>
                  </div>

                  {canManage && (
                    <button
                      onClick={() => handleDeleteChallenge(ch.id, ch.title)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer shrink-0"
                      title={`Hapus tantangan ${ch.title}`}
                      aria-label={`Hapus tantangan ${ch.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-700 font-medium leading-relaxed line-clamp-3">
                  {ch.description}
                </p>
                <p className="text-[11px] text-orange-800 font-bold">{ch.task}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Material Modal */}
      {showAddModal && canManage && (
        <div className="fixed inset-0 z-[65] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-purple-300 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-black text-slate-900">Tambah Materi Baru</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMaterial} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 space-y-1">
                  <label className="text-[11px] font-black text-slate-700 uppercase block">
                    Judul Materi *
                  </label>
                  <input
                    type="text"
                    value={matTitle}
                    onChange={(e) => setMatTitle(e.target.value)}
                    placeholder="Contoh: Dispersi Cahaya Prisma"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-700 uppercase block">
                    Nomor Kotak
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={matTileIndex}
                    onChange={(e) => setMatTileIndex(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-700 uppercase block">
                  Topik Pembahasan
                </label>
                <input
                  type="text"
                  value={matTopic}
                  onChange={(e) => setMatTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-700 uppercase block">
                  Ringkasan Materi *
                </label>
                <textarea
                  rows={3}
                  value={matSummary}
                  onChange={(e) => setMatSummary(e.target.value)}
                  placeholder="Jelaskan konsep utama materi fisika..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-700 uppercase block">
                  Poin Kunci (1 per baris)
                </label>
                <textarea
                  rows={2}
                  value={matPoints}
                  onChange={(e) => setMatPoints(e.target.value)}
                  placeholder="Poin 1&#10;Poin 2"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-700 uppercase block">
                    Rumus Utama (Opsional)
                  </label>
                  <input
                    type="text"
                    value={matFormula}
                    onChange={(e) => setMatFormula(e.target.value)}
                    placeholder="Contoh: n = c / v"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-700 uppercase block">
                    Aplikasi Nyata
                  </label>
                  <input
                    type="text"
                    value={matApp}
                    onChange={(e) => setMatApp(e.target.value)}
                    placeholder="Contoh: Pelangi, spektrometer"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingMat}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSavingMat && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Simpan Materi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
