// ORBiALOG Scientific Interface Audio Feedback
// Synthesized using Web Audio API (Zero external assets required)

class ScientificAudioEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    // Lazy initialize upon first user gesture
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  // Subtle scientific click / selector tick
  public playClick(freq = 1200, duration = 0.02) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, this.ctx.currentTime + duration);
      
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio playback quiet failover
    }
  }

  // Target locked / state confirmed tone
  public playConfirm() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc1.type = 'triangle';
      osc2.type = 'sine';
      
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.setValueAtTime(880, now + 0.06); // A5
      
      osc2.frequency.setValueAtTime(293.66, now); // D4
      osc2.frequency.setValueAtTime(440, now + 0.06); // A4
      
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.18);
      osc2.stop(now + 0.18);
    } catch {
      // quiet failover
    }
  }

  // Telemetry scan beep
  public playScan() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2200, now);
      osc.frequency.linearRampToValueAtTime(1400, now + 0.05);
      
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // quiet failover
    }
  }
}

export const audio = new ScientificAudioEngine();

