/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  GraduationCap,
  Play,
  BookOpen,
  Award,
  HelpCircle,
  Zap,
  CheckCircle2,
  ArrowRight,
  History,
  Sun,
  Eye,
  Search,
} from 'lucide-react';
import { AuthUser } from '../types/game';
import { PrismDispersionIllustration } from './OpticsIllustrations';

interface HomeViewProps {
  authUser: AuthUser;
  onSelectTeacherMode: () => void;
  onSelectStudentMode: () => void;
  onOpenHistory: () => void;
  onOpenContentManager: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  authUser,
  onSelectTeacherMode,
  onSelectStudentMode,
  onOpenHistory,
  onOpenContentManager,
}) => {
  const [showRulesModal, setShowRulesModal] = useState(false);

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-between py-6 px-4 max-w-6xl mx-auto">
      {/* Hero Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto pt-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-sky-100 via-amber-100 to-indigo-100 border border-sky-300 text-sky-800 text-xs font-black uppercase tracking-wider shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
          Halo, {authUser.name} ({authUser.role.toUpperCase()}) • Permainan Papan Fisika
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-none">
          MONOFIS{' '}
          <span className="block text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-600 mt-2">
            Monopoly Fisika: Cahaya &amp; Alat Optik
          </span>
        </h1>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium max-w-2xl mx-auto">
          Media pembelajaran sains seru berbasis 24 kotak papan edukatif. Menjawab kuis optik, menaklukkan tantangan sains,
          meraih bonus foton, dan berkompetisi secara real-time antar kelompok di kelas!
        </p>

        {/* Floating Mini Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs font-bold">
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 shadow-sm">
            <Sun className="w-3.5 h-3.5 text-amber-600" /> Sifat Cahaya
          </span>
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-300 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" /> Cermin Datar &amp; Lengkung
          </span>
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-300 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-purple-600" /> Pembiasan &amp; Lensa
          </span>
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
            <Eye className="w-3.5 h-3.5 text-emerald-600" /> Mata &amp; Lup
          </span>
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 shadow-sm">
            <Search className="w-3.5 h-3.5 text-rose-600" /> Mikroskop &amp; Teleskop
          </span>
        </div>
      </div>

      {/* Main Action Cards (One-Screen Fit) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6 max-w-4xl mx-auto w-full">
        {/* Guru / Host Card */}
        <div className="rounded-3xl bg-white border-2 border-indigo-200 hover:border-indigo-400 p-6 sm:p-7 flex flex-col justify-between shadow-xl shadow-indigo-100/70 hover:shadow-2xl transition-all transform hover:-translate-y-1">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-13 h-13 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-md">
                <GraduationCap className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Host / Papan Utama
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Buat Sesi Permainan Baru
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
                Buat kode ruang sesi unik, tambahkan kelompok, lempar dadu bersama di layar utama, dan pantau skor secara real-time.
              </p>
            </div>

            <div className="space-y-1.5 pt-1 text-xs text-slate-700 font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Kode sesi instan &amp; link gabung satu klik</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Dukungan tampilan Smart TV / Proyektor kelas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Papan peringkat otomatis &amp; ekspor laporan nilai</span>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100">
            <button
              onClick={onSelectTeacherMode}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-black text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Buka Ruang Sesi Baru</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Siswa / Kelompok Card */}
        <div className="rounded-3xl bg-white border-2 border-amber-300 hover:border-amber-400 p-6 sm:p-7 flex flex-col justify-between shadow-xl shadow-amber-100/70 hover:shadow-2xl transition-all transform hover:-translate-y-1">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-13 h-13 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-md">
                <Users className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Akses Kelompok Siswa
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Gabung Sesi Permainan
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
                Masukkan kode dari guru, daftarkan nama kelompok, pilih warna pion optik favorit, dan lempar dadu untuk menaklukkan papan MONOFIS!
              </p>
            </div>

            <div className="space-y-1.5 pt-1 text-xs text-slate-700 font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Pion bergerak real-time di layar TV dan HP</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>+10 poin kuis benar &amp; +20 poin bonus foton</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Progres aman tersimpan saat browser di-refresh</span>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100">
            <button
              onClick={onSelectStudentMode}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Gabung dengan Kode Sesi</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Feature Pills & Guide Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-slate-200">
        <button
          onClick={() => setShowRulesModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-300 shadow-sm transition-colors cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-sky-600" />
          <span>Panduan Papan (24 Kotak)</span>
        </button>

        <button
          onClick={onOpenContentManager}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200 shadow-sm transition-colors cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-purple-600" />
          <span>Kelola Materi &amp; Bank Soal</span>
        </button>

        <button
          onClick={onOpenHistory}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-300 shadow-sm transition-colors cursor-pointer"
        >
          <History className="w-4 h-4 text-indigo-600" />
          <span>Riwayat Sesi Tersimpan</span>
        </button>
      </div>

      {/* Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-sky-300 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 text-slate-900 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-sm">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-900">Panduan Papan MONOFIS</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Struktur 24 Kotak Papan &amp; Perhitungan Skor Resmi
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRulesModal(false)}
                className="text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-xl bg-slate-100 font-bold text-xs cursor-pointer"
              >
                ✕ Tutup
              </button>
            </div>

            {/* Visual Mini Banner */}
            <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200">
              <PrismDispersionIllustration className="w-full h-32" />
            </div>

            {/* Kotak Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-sky-700 uppercase tracking-wider">
                Pembagian 24 Kotak Papan:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-black text-amber-800">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>8 Kotak KUIS (+10 Poin)</span>
                  </div>
                  <p className="text-slate-600">
                    Pertanyaan materi Cahaya &amp; Alat Optik. Jawaban benar: +10 poin, Jawaban salah: 0 poin.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-black text-purple-800">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    <span>8 Kotak MATERI</span>
                  </div>
                  <p className="text-slate-600">
                    Penjelasan materi lengkap dengan rumus, ilustrasi sinar, dan fakta sains optik unik.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-black text-orange-800">
                    <Zap className="w-4 h-4 text-orange-600" />
                    <span>6 Kotak TANTANGAN (+10 Poin)</span>
                  </div>
                  <p className="text-slate-600">
                    Misi studi kasus kelompok (fokus cermin cekung, tikungan cembung, periskop, serat optik).
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-black text-emerald-800">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>1 Kotak BONUS (+20 Poin!)</span>
                  </div>
                  <p className="text-slate-600">
                    Mendarat di Kotak #6 langsung mendapatkan tambahan +20 Poin Foton Optik!
                  </p>
                </div>
              </div>
            </div>

            {/* Aturan Skor */}
            <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200 font-medium">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-1">
                Aturan Skor &amp; Keamanan Data:
              </h4>
              <p>• Poin kuis benar: <strong>+10 poin</strong></p>
              <p>• Poin kuis salah: <strong>+0 poin</strong></p>
              <p>• Kotak bonus foton: <strong>+20 poin</strong></p>
              <p>• Setiap poin divalidasi langsung di server dan hanya diberikan 1 kali per peristiwa sah.</p>
              <p>• Posisi pion tersimpan secara permanen dan otomatis pulih saat halaman dimuat ulang.</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowRulesModal(false)}
                className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
