export default class SeqVoice {
  constructor(tempo = 600) {
    this.audioContext = null;
    this.notesInQueue = []; // notes that have been put into the web audio and may or may not have been played yet {note, time}
    this.currentQuarterNote = 0;
    this.tempo = tempo;
    this.lookahead = 25; // How frequently to call scheduling function (in milliseconds)
    this.scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
    this.nextNoteTime = 0.0; // when the next note is due
    this.isRunning = false;
    this.intervalID = null;
    this.beatsPerBar = 8;
    this.freq = 440;
    this.array = [];
    this.shape = "square";
    this.onBeatCallback = null;
    this.noteLength = 0.05;
    this.lowPassFreq = 15000;
    this.qValue = 0;
    this.base = 110;
    this.multiplier = 2;
  }

  nextNote() {
    // Advance current note and time by a quarter note (crotchet if you're posh)
    let secondsPerBeat = 60.0 / this.tempo; // Notice this picks up the CURRENT tempo value to calculate beat length.
    this.nextNoteTime += secondsPerBeat; // Add beat length to last beat time

    this.currentQuarterNote++; // Advance the beat number, wrap to zero
    if (this.currentQuarterNote == this.beatsPerBar) {
      this.currentQuarterNote = 0;
    }
  }

  scheduleNote(beatNumber, time) {
    // push the note on the queue, even if we're not playing.
    this.notesInQueue.push({ note: beatNumber, time: time });

    // create oscillator + gain node + low pass filter
    const osc = this.audioContext.createOscillator();
    const lowpass = this.audioContext.createBiquadFilter();
    const env = this.audioContext.createGain();

    this.beatsPerBar = this.array.length;
    !this.array[beatNumber]
      ? (this.array[beatNumber] = 0)
      : this.array[beatNumber];
    this.array[beatNumber] === 1
      ? (osc.frequency.value = this.base)
      : (osc.frequency.value = this.array[beatNumber] * this.base);
    osc.type = this.shape;
    if (this.onBeatCallback) {
      this.onBeatCallback(this.array[beatNumber]);
    }

    // Manipulate the Biquad filter

    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(this.lowPassFreq, time);
    lowpass.Q.value = this.qValue;

    env.gain.value = 0.5;
    env.gain.exponentialRampToValueAtTime(0.5, time + 0.001);
    env.gain.exponentialRampToValueAtTime(0.001, time + this.noteLength);

    osc.connect(lowpass).connect(env).connect(this.audioContext.destination);
    osc.start(time);
    osc.stop(time + this.noteLength);
  }

  scheduler() {
    // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
    while (
      this.nextNoteTime <
      this.audioContext.currentTime + this.scheduleAheadTime
    ) {
      this.scheduleNote(this.currentQuarterNote, this.nextNoteTime);
      this.nextNote();
    }
  }

  start() {
    if (this.isRunning) return;

    if (this.audioContext == null) {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
    }

    this.isRunning = true;

    this.currentQuarterNote = 0;
    this.nextNoteTime = this.audioContext.currentTime + 0.05;

    this.intervalID = setInterval(() => this.scheduler(), this.lookahead);
  }

  stop() {
    this.isRunning = false;

    clearInterval(this.intervalID);
  }

  startStop(array) {
    if (this.isRunning) {
      this.stop();
    } else {
      this.array = array;
      this.start();
    }
  }
}
