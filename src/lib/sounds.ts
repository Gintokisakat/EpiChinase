let ctx: AudioContext | null = null;

function getCtx() {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

export function playCorrect() {
  try {
    const c = getCtx();
    const o = c.createOscillator();
    const g = c.createGain();
    o.connect(g);
    g.connect(c.destination);
    o.type = "sine";
    o.frequency.setValueAtTime(523, c.currentTime);
    o.frequency.setValueAtTime(659, c.currentTime + 0.08);
    o.frequency.setValueAtTime(784, c.currentTime + 0.16);
    g.gain.setValueAtTime(0.3, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.4);
    o.start(c.currentTime);
    o.stop(c.currentTime + 0.4);
  } catch {}
}

export function playFanfare() {
  try {
    const c = getCtx();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.connect(g);
      g.connect(c.destination);
      o.type = "sine";
      o.frequency.setValueAtTime(freq, c.currentTime + i * 0.12);
      g.gain.setValueAtTime(0.25, c.currentTime + i * 0.12);
      g.gain.exponentialRampToValueAtTime(0.01, c.currentTime + i * 0.12 + 0.5);
      o.start(c.currentTime + i * 0.12);
      o.stop(c.currentTime + i * 0.12 + 0.5);
    });
  } catch {}
}

export function playIncorrect() {
  try {
    const c = getCtx();
    const o = c.createOscillator();
    const g = c.createGain();
    o.connect(g);
    g.connect(c.destination);
    o.type = "sawtooth";
    o.frequency.setValueAtTime(300, c.currentTime);
    o.frequency.setValueAtTime(200, c.currentTime + 0.15);
    g.gain.setValueAtTime(0.2, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.3);
    o.start(c.currentTime);
    o.stop(c.currentTime + 0.3);
  } catch {}
}
