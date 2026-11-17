"use client";

class CinematicSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private projectorGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private droneOsc: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private isRunning = false;

  private init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();

    // Master gain with smooth ramping
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Warm deep drone (45Hz + 90Hz harmonic)
    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.045, this.ctx.currentTime);
    this.droneGain.connect(this.masterGain);

    this.droneOsc = this.ctx.createOscillator();
    this.droneOsc.type = "sine";
    this.droneOsc.frequency.setValueAtTime(48, this.ctx.currentTime);

    this.subOsc = this.ctx.createOscillator();
    this.subOsc.type = "triangle";
    this.subOsc.frequency.setValueAtTime(96, this.ctx.currentTime);

    const droneFilter = this.ctx.createBiquadFilter();
    droneFilter.type = "lowpass";
    droneFilter.frequency.setValueAtTime(120, this.ctx.currentTime);

    this.droneOsc.connect(droneFilter);
    this.subOsc.connect(droneFilter);
    droneFilter.connect(this.droneGain);

    this.droneOsc.start();
    this.subOsc.start();

    // 35mm Projector Mechanical Whir / Flutter (Band-pass filtered noise modulated at 24fps)
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = noiseBuffer;
    this.noiseNode.loop = true;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(420, this.ctx.currentTime);
    noiseFilter.Q.setValueAtTime(3.5, this.ctx.currentTime);

    // 24fps shutter modulation (12Hz - 24Hz wobble)
    const lfo = this.ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(12, this.ctx.currentTime);

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.015, this.ctx.currentTime);
    lfo.connect(lfoGain.gain);

    this.projectorGain = this.ctx.createGain();
    this.projectorGain.gain.setValueAtTime(0.02, this.ctx.currentTime);

    this.noiseNode.connect(noiseFilter);
    noiseFilter.connect(this.projectorGain);
    this.projectorGain.connect(this.masterGain);

    this.noiseNode.start();
    lfo.start();
  }

  public playClick(pitch = 640) {
    if (!this.ctx || this.ctx.state !== "running") return;
    try {
      const osc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.04);

      clickGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(clickGain);
      clickGain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio click fallback
    }
  }

  public playChime() {
    if (!this.ctx || this.ctx.state !== "running") return;
    try {
      const freqs = [330, 440, 660];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0, this.ctx!.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.04, this.ctx!.currentTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + idx * 0.08 + 0.9);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + idx * 0.08);
        osc.stop(this.ctx!.currentTime + idx * 0.08 + 0.9);
      });
    } catch {
      // Chime fallback
    }
  }

  public toggle(): boolean {
    this.init();
    if (!this.ctx || !this.masterGain) return false;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    const t = this.ctx.currentTime;
    if (this.isRunning) {
      // Fade out
      this.masterGain.gain.cancelScheduledValues(t);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, t);
      this.masterGain.gain.linearRampToValueAtTime(0.00001, t + 0.6);
      this.isRunning = false;
    } else {
      // Fade in
      this.masterGain.gain.cancelScheduledValues(t);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, t);
      this.masterGain.gain.linearRampToValueAtTime(0.7, t + 0.8);
      this.isRunning = true;
      this.playChime();
    }

    return this.isRunning;
  }

  public getStatus(): boolean {
    return this.isRunning;
  }
}

export const cinematicAudio = typeof window !== "undefined" ? new CinematicSoundEngine() : ({} as CinematicSoundEngine);
