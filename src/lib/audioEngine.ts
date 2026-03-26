/**
 * audioEngine — V5-AUDIO-SYSTEM-001
 *
 * Spatial audio design system for Eternal Nexus OS.
 * Built on Web Audio API — no external dependencies.
 *
 * Sounds:
 *   globeHover      — soft sine wave, 220 Hz, 80ms fade in/out
 *   projectClick    — confirmation triad (C4–E4–G4), fast attack
 *   dataStreamPulse — short rhythmic click, 1200 Hz, 30ms
 *   ambientDrone    — low-frequency hum (40 Hz + 80 Hz), continuous
 *   uiConfirm       — bright ping 880 Hz, 120ms
 *   uiDismiss       — descending tone 440→220 Hz, 150ms
 *   seismicAlert    — low rumble 60 Hz burst, 400ms
 *
 * Usage:
 *   import { audioEngine } from "@/lib/audioEngine";
 *   audioEngine.init(); // call once on first user interaction
 *   audioEngine.play("projectClick");
 */

type SoundName =
  | "globeHover"
  | "projectClick"
  | "dataStreamPulse"
  | "uiConfirm"
  | "uiDismiss"
  | "seismicAlert";

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private droneRunning = false;
  private enabled = true;
  private _volume = 0.5;

  // ─── Initialise (must be called from a user gesture) ─────────────────────

  init(): void {
    if (this.ctx) return;
    try {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this._volume;
      this.masterGain.connect(this.ctx.destination);
    } catch {
      // Web Audio not supported — fail silently
    }
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  play(name: SoundName): void {
    if (!this.enabled || !this.ctx || !this.masterGain) return;
    if (this.ctx.state === "suspended") {
      this.ctx.resume().then(() => this._dispatch(name));
      return;
    }
    this._dispatch(name);
  }

  startAmbient(): void {
    if (this.droneRunning || !this.ctx || !this.masterGain) return;
    this.droneRunning = true;

    const ctx = this.ctx;
    this.droneGain = ctx.createGain();
    this.droneGain.gain.value = 0;
    this.droneGain.connect(this.masterGain);

    // Two suboscillators — 40 Hz + 80 Hz
    [40, 80].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      g.gain.value = i === 0 ? 0.08 : 0.04;
      osc.connect(g);
      g.connect(this.droneGain!);
      osc.start();
    });

    // Slow fade in
    this.droneGain.gain.linearRampToValueAtTime(
      1,
      ctx.currentTime + 3,
    );
  }

  stopAmbient(): void {
    if (!this.droneGain) return;
    const now = this.ctx!.currentTime;
    this.droneGain.gain.linearRampToValueAtTime(0, now + 1.5);
    this.droneRunning = false;
  }

  setVolume(v: number): void {
    this._volume = Math.max(0, Math.min(1, v));
    if (this.masterGain) this.masterGain.gain.value = this._volume;
  }

  setEnabled(on: boolean): void {
    this.enabled = on;
    if (!on) this.stopAmbient();
  }

  get volume(): number { return this._volume; }
  get isEnabled(): boolean { return this.enabled; }

  // ─── Sound dispatch ───────────────────────────────────────────────────────

  private _dispatch(name: SoundName): void {
    switch (name) {
      case "globeHover":      return this._globeHover();
      case "projectClick":    return this._projectClick();
      case "dataStreamPulse": return this._dataStreamPulse();
      case "uiConfirm":       return this._uiConfirm();
      case "uiDismiss":       return this._uiDismiss();
      case "seismicAlert":    return this._seismicAlert();
    }
  }

  // ─── Globe hover — soft 220 Hz sine, 80ms ────────────────────────────────

  private _globeHover(): void {
    const { ctx, masterGain } = this._ctx();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 220;
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.02);
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);
    osc.connect(g);
    g.connect(masterGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  // ─── Project click — C4–E4–G4 confirmation chord ─────────────────────────

  private _projectClick(): void {
    const { ctx, masterGain } = this._ctx();
    const freqs = [261.63, 329.63, 392.0]; // C4, E4, G4
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      const t0 = ctx.currentTime + i * 0.025;
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(0.08, t0 + 0.015);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.3);
      osc.connect(g);
      g.connect(masterGain);
      osc.start(t0);
      osc.stop(t0 + 0.35);
    });
  }

  // ─── Data stream pulse — tick 1200 Hz, 30ms ──────────────────────────────

  private _dataStreamPulse(): void {
    const { ctx, masterGain } = this._ctx();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = 1200;
    g.gain.setValueAtTime(0.03, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    osc.connect(g);
    g.connect(masterGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  }

  // ─── UI confirm — 880 Hz ping, 120ms ─────────────────────────────────────

  private _uiConfirm(): void {
    const { ctx, masterGain } = this._ctx();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    g.gain.setValueAtTime(0.1, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.connect(g);
    g.connect(masterGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }

  // ─── UI dismiss — 440→220 Hz descend, 150ms ──────────────────────────────

  private _uiDismiss(): void {
    const { ctx, masterGain } = this._ctx();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.15);
    g.gain.setValueAtTime(0.08, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(g);
    g.connect(masterGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  }

  // ─── Seismic alert — 60 Hz rumble burst, 400ms ───────────────────────────

  private _seismicAlert(): void {
    const { ctx, masterGain } = this._ctx();
    const osc = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const g = ctx.createGain();

    // Low rumble
    osc.type = "sawtooth";
    osc.frequency.value = 60;

    // Tremolo LFO at 8 Hz
    lfo.frequency.value = 8;
    lfoGain.gain.value = 0.05;
    lfo.connect(lfoGain);
    lfoGain.connect(g.gain);

    g.gain.setValueAtTime(0.12, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(g);
    g.connect(masterGain);
    lfo.start();
    osc.start();
    osc.stop(ctx.currentTime + 0.42);
    lfo.stop(ctx.currentTime + 0.42);
  }

  // ─── Guard ────────────────────────────────────────────────────────────────

  private _ctx(): { ctx: AudioContext; masterGain: GainNode } {
    if (!this.ctx || !this.masterGain) throw new Error("AudioEngine not initialised");
    return { ctx: this.ctx, masterGain: this.masterGain };
  }
}

export const audioEngine = new AudioEngine();
