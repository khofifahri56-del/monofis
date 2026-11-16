/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Procedural Web Audio API sound synthesizer
let audioCtx: AudioContext | null = null;
let soundEnabled = true;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const soundManager = {
  toggleMute(): boolean {
    soundEnabled = !soundEnabled;
    return soundEnabled;
  },
  isMuted(): boolean {
    return !soundEnabled;
  },

  playDiceRoll() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    for (let i = 0; i < 6; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const time = ctx.currentTime + i * 0.06;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180 + Math.random() * 260, time);
      gain.gain.setValueAtTime(0.12, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + 0.05);
    }
  },

  playPawnMove() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(540, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  },

  playCorrectAnswer() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const time = ctx.currentTime + idx * 0.09;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.18, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + 0.25);
    });
  },

  playWrongAnswer() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [293.66, 261.63]; // D4 down to C4
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const time = ctx.currentTime + idx * 0.12;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.12, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + 0.2);
    });
  },

  playBonusChime() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const chords = [587.33, 739.99, 880.0, 1174.66, 1479.98]; // D major celebration
    chords.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const time = ctx.currentTime + i * 0.07;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + 0.5);
    });
  },

  playVictoryFanfare() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const melody = [
      { f: 523.25, d: 0.15 },
      { f: 523.25, d: 0.15 },
      { f: 523.25, d: 0.15 },
      { f: 659.25, d: 0.35 },
      { f: 587.33, d: 0.15 },
      { f: 659.25, d: 0.15 },
      { f: 783.99, d: 0.5 },
    ];

    let current = ctx.currentTime;
    melody.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, current);

      gain.gain.setValueAtTime(0.25, current);
      gain.gain.exponentialRampToValueAtTime(0.001, current + note.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(current);
      osc.stop(current + note.d);

      current += note.d * 0.95;
    });
  },
};
