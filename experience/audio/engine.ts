// Procedurally-synthesized soundscape — no audio files, no CDN.
//
//  drone   : two detuned saws beating at ~55Hz + a 27.5Hz sine sub, run
//            through a low-pass filter whose cutoff *descends with scroll
//            depth* (deeper into the void = darker sound) and briefly opens
//            with scroll velocity (whoosh).
//  air     : looped noise through a band-pass — faint synthetic hiss.
//  hum     : 60/119Hz mains hum + filtered noise for the A-TIOC server rack,
//            gain driven by camera proximity, StereoPanner driven by the
//            rack's position in camera space (localized spatial audio).
//  blips   : short envelopes for hover / click / deny raycast events.
//
// Everything ramps via setTargetAtTime — no zipper noise, no clicks.

export type BlipKind = "hover" | "click" | "deny" | "open";

export class AudioEngine {
  readonly ctx: AudioContext;
  private master: GainNode;
  private droneFilter: BiquadFilterNode;
  private subGain: GainNode;
  private whooshGain: GainNode;
  private humGain: GainNode;
  private humPan: StereoPannerNode;
  private lastBlip = 0;
  enabled = false;

  constructor() {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AC();
    const t = this.ctx.currentTime;

    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.setValueAtTime(-22, t);
    comp.ratio.setValueAtTime(6, t);
    comp.connect(this.ctx.destination);

    this.master = this.ctx.createGain();
    this.master.gain.setValueAtTime(0, t);
    this.master.connect(comp);

    // ── drone ──
    this.droneFilter = this.ctx.createBiquadFilter();
    this.droneFilter.type = "lowpass";
    this.droneFilter.frequency.setValueAtTime(720, t);
    this.droneFilter.Q.setValueAtTime(0.9, t);
    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.34, t);
    this.droneFilter.connect(droneGain).connect(this.master);

    const saw = (freq: number, gain: number) => {
      const o = this.ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(freq, t);
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(gain, t);
      o.connect(g).connect(this.droneFilter);
      o.start();
      return o;
    };
    saw(54.6, 0.055);
    saw(55.4, 0.055);

    const sub = this.ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.setValueAtTime(27.5, t);
    this.subGain = this.ctx.createGain();
    this.subGain.gain.setValueAtTime(0.1, t);
    sub.connect(this.subGain).connect(this.droneFilter);
    sub.start();

    // slow LFO breathing on the filter
    const lfo = this.ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.06, t);
    const lfoAmt = this.ctx.createGain();
    lfoAmt.gain.setValueAtTime(85, t);
    lfo.connect(lfoAmt).connect(this.droneFilter.frequency);
    lfo.start();

    // ── noise bed (air + velocity whoosh) ──
    const noiseBuf = this.ctx.createBuffer(1, this.ctx.sampleRate * 2, this.ctx.sampleRate);
    const ch = noiseBuf.getChannelData(0);
    for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;

    const noise = (filter: BiquadFilterNode, gain: number) => {
      const src = this.ctx.createBufferSource();
      src.buffer = noiseBuf;
      src.loop = true;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(gain, t);
      src.connect(filter).connect(g).connect(this.master);
      src.start();
      return g;
    };

    const airBp = this.ctx.createBiquadFilter();
    airBp.type = "bandpass";
    airBp.frequency.setValueAtTime(1650, t);
    airBp.Q.setValueAtTime(1.6, t);
    noise(airBp, 0.012);

    const whooshLp = this.ctx.createBiquadFilter();
    whooshLp.type = "lowpass";
    whooshLp.frequency.setValueAtTime(480, t);
    this.whooshGain = noise(whooshLp, 0);

    // ── server-rack hum (localized) ──
    this.humGain = this.ctx.createGain();
    this.humGain.gain.setValueAtTime(0, t);
    this.humPan = this.ctx.createStereoPanner();
    this.humGain.connect(this.humPan).connect(this.master);

    const humOsc = (freq: number, gain: number) => {
      const o = this.ctx.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(freq, t);
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(gain, t);
      o.connect(g).connect(this.humGain);
      o.start();
    };
    humOsc(60, 0.5);
    humOsc(119.2, 0.16);
    const humLp = this.ctx.createBiquadFilter();
    humLp.type = "lowpass";
    humLp.frequency.setValueAtTime(240, t);
    const humNoise = this.ctx.createBufferSource();
    humNoise.buffer = noiseBuf;
    humNoise.loop = true;
    const humNoiseG = this.ctx.createGain();
    humNoiseG.gain.setValueAtTime(0.22, t);
    humNoise.connect(humLp).connect(humNoiseG).connect(this.humGain);
    humNoise.start();
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    if (on && this.ctx.state === "suspended") void this.ctx.resume();
    this.master.gain.setTargetAtTime(on ? 0.75 : 0, this.ctx.currentTime, on ? 1.2 : 0.25);
  }

  /** Called every frame from the camera rig: depth-modulated filter + whoosh. */
  update(offset: number, delta: number) {
    if (!this.enabled) return;
    const t = this.ctx.currentTime;
    const vel = Math.min(delta * 60, 1);
    const cutoff = 760 - 560 * offset + vel * 1300;
    this.droneFilter.frequency.setTargetAtTime(Math.max(150, Math.min(cutoff, 2400)), t, 0.25);
    this.whooshGain.gain.setTargetAtTime(vel * 0.07, t, 0.18);
    this.subGain.gain.setTargetAtTime(0.1 + 0.06 * offset, t, 0.4);
    this.master.gain.setTargetAtTime(0.72 + 0.16 * offset, t, 0.5);
  }

  /** level 0..1 by proximity to the rack, pan -1..1 from camera-space X. */
  setHum(level: number, pan: number) {
    const t = this.ctx.currentTime;
    this.humGain.gain.setTargetAtTime(level * 0.42, t, 0.15);
    this.humPan.pan.setTargetAtTime(Math.max(-0.85, Math.min(pan, 0.85)), t, 0.15);
  }

  blip(kind: BlipKind) {
    if (!this.enabled) return;
    const now = performance.now();
    if (now - this.lastBlip < 50) return;
    this.lastBlip = now;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.connect(g).connect(this.master);
    const conf: Record<BlipKind, [OscillatorType, number, number, number]> = {
      hover: ["sine", 1320, 0.05, 0.07],
      click: ["triangle", 880, 0.09, 0.14],
      open: ["triangle", 660, 0.1, 0.22],
      deny: ["sawtooth", 196, 0.06, 0.16],
    };
    const [type, freq, gain, dur] = conf[kind];
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (kind === "click" || kind === "open") o.frequency.exponentialRampToValueAtTime(freq * 1.5, t + dur);
    if (kind === "deny") o.frequency.exponentialRampToValueAtTime(freq * 0.6, t + dur);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0004, t + dur);
    o.start(t);
    o.stop(t + dur + 0.05);
  }
}

export function ensureAudio(): AudioEngine {
  const w = window as unknown as { __walsecAudio?: AudioEngine };
  if (!w.__walsecAudio) w.__walsecAudio = new AudioEngine();
  return w.__walsecAudio;
}
