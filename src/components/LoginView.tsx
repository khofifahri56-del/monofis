/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';
import { AuthUser, UserRole } from '../types/game';
import { apiClient } from '../services/apiClient';

interface LoginViewProps {
  pendingJoinCode?: string;
  onAuthenticated: (user: AuthUser) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  pendingJoinCode,
  onAuthenticated,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const { user } = await apiClient.login(email.trim(), password);
        onAuthenticated(user);
      } else {
        const { user } = await apiClient.register(name.trim(), email.trim(), password, role);
        onAuthenticated(user);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Autentikasi gagal. Periksa kembali data Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (presetEmail: string, presetPassword: string) => {
    setErrorMsg(null);
    setEmail(presetEmail);
    setPassword(presetPassword);
    setMode('login');
    setIsLoading(true);
    try {
      const { user } = await apiClient.login(presetEmail, presetPassword);
      onAuthenticated(user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal login cepat.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-6 px-4">
      <div className="max-w-md w-full bg-white border-2 border-sky-200 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-sky-100/80 space-y-5">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-amber-400 text-white mx-auto flex items-center justify-center shadow-lg shadow-sky-500/25">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            {mode === 'login' ? 'Masuk ke MONOFIS' : 'Daftar Akun MONOFIS'}
          </h1>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            {pendingJoinCode
              ? `Login terlebih dahulu untuk bergabung ke sesi kode ${pendingJoinCode} dan melempar dadu.`
              : 'Login diperlukan untuk melempar dadu, menyimpan progres permainan, dan mengelola sesi kelas.'}
          </p>
        </div>

        {/* Mode Switch Tabs */}
        <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-black">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
            }}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Daftar Baru</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-300 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Santoso / Ibu Ani"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:bg-white text-sm font-bold text-slate-900 outline-none transition-all"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
              Email Akun
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@monofis.id"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:bg-white text-sm font-bold text-slate-900 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 4 karakter"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:bg-white text-sm font-bold text-slate-900 outline-none transition-all"
                required
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                Peran Pengguna
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { id: 'user', label: 'User / Siswa' },
                  { id: 'moderator', label: 'Moderator' },
                  { id: 'admin', label: 'Admin / Guru' },
                ] as const).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRole(item.id)}
                    className={`py-2 px-2 rounded-xl border-2 text-[11px] font-black transition-all cursor-pointer ${
                      role === item.id
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-800 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 disabled:opacity-50 text-white font-black text-sm shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Memverifikasi Akun...</span>
              </>
            ) : (
              <>
                <span>{mode === 'login' ? 'Masuk Sekarang' : 'Buat Akun & Masuk'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Classroom Preset Accounts */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-black text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              Akses Cepat Uji Peran:
            </span>
            <span>Semua Bisa Lempar Dadu</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickLogin('admin@monofis.id', 'admin123')}
              className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 text-left transition-colors cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-1 text-[11px] font-black">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                <span>Admin</span>
              </div>
              <p className="text-[10px] text-indigo-700 truncate">admin@monofis.id</p>
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickLogin('moderator@monofis.id', 'mod123')}
              className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-left transition-colors cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-1 text-[11px] font-black">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Moderator</span>
              </div>
              <p className="text-[10px] text-purple-700 truncate">moderator@monofis.id</p>
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickLogin('siswa@monofis.id', 'siswa123')}
              className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-left transition-colors cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-1 text-[11px] font-black">
                <User className="w-3.5 h-3.5 text-amber-600" />
                <span>User</span>
              </div>
              <p className="text-[10px] text-amber-800 truncate">siswa@monofis.id</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
