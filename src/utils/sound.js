// Web Audio API Synthesizer for 2048 Game

let audioCtx = null;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
};

// Play a quick, clean slide sound for tile movement
export const playSlideSound = () => {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.type = "triangle";
    // Gentle downward pitch sweep
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.12);

    // Soft, quick fade-out
    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) {
    console.warn("Audio error:", e);
  }
};

// Play a bright, pops/chime sound for tile merges
export const playMergeSound = () => {
  try {
    const ctx = getAudioContext();

    // Note 1: G5 (783.99 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(783.99, ctx.currentTime);
    gain1.gain.setValueAtTime(0.12, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.15);

    // Note 2: C6 (1046.50 Hz) slightly delayed
    const delay = 0.06;
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1046.50, ctx.currentTime + delay);
    gain2.gain.setValueAtTime(0.12, ctx.currentTime + delay);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.2);

    osc2.start(ctx.currentTime + delay);
    osc2.stop(ctx.currentTime + delay + 0.2);
  } catch (e) {
    console.warn("Audio error:", e);
  }
};

// Play a triumphant ascending arpeggio for victory (2048 tile reached)
export const playWinSound = () => {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, index) => {
      const delay = index * 0.1;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime + delay);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.4);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.4);
    });
  } catch (e) {
    console.warn("Audio error:", e);
  }
};

// Play a descending, somber sequence for Game Over
export const playLoseSound = () => {
  try {
    const ctx = getAudioContext();
    const notes = [392.00, 311.13, 261.63, 196.00]; // G4, Eb4, C4, G3
    notes.forEach((freq, index) => {
      const delay = index * 0.15;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.type = "sawtooth"; // Slightly retro sound
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

      // Apply low pass filter to make sawtooth softer
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, ctx.currentTime + delay);

      osc.disconnect(gainNode);
      osc.connect(filter);
      filter.connect(gainNode);

      gainNode.gain.setValueAtTime(0.06, ctx.currentTime + delay);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.5);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.5);
    });
  } catch (e) {
    console.warn("Audio error:", e);
  }
};

// Play a short start chime
export const playStartSound = () => {
  try {
    const ctx = getAudioContext();
    const notes = [261.63, 392.00, 523.25]; // C4, G4, C5
    notes.forEach((freq, index) => {
      const delay = index * 0.08;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime + delay);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.3);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.3);
    });
  } catch (e) {
    console.warn("Audio error:", e);
  }
};
