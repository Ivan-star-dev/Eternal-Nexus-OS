import { useRef } from "react";

class SoundManager {
  private ctx: AudioContext | null = null;

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }

  playTone(freq: number, duration = 0.12, gain = 0.08, type: OscillatorType = "sine") {
    try {
      const ctx = this.getCtx();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      g.gain.setValueAtTime(gain, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(g).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }

  /** Liquid gold particle whoosh — biquad lowpass 1800Hz */
  playParticle(freq = 800) {
    try {
      const ctx = this.getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = "sine";
      osc.frequency.value = freq;
      filter.type = "lowpass";
      filter.frequency.value = 1800;
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {}
  }

  /** Sawtooth brass navigation sound */
  playNavigate() {
    try {
      const ctx = this.getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.value = 440;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {}
  }

  playClose() {
    this.playTone(440, 0.1, 0.06, "square");
  }

  playHover() {
    this.playTone(600, 0.05, 0.04, "sine");
  }

  // Aliases for compatibility
  get soundParticle() { return this.playParticle.bind(this); }
  get soundNavigate() { return this.playNavigate.bind(this); }
}

const sharedManager = new SoundManager();

export function useSoundManager() {
  return sharedManager;
}
