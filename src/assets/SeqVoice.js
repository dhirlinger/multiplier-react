export default class SeqVoice {
  constructor(tempo = 600) {
    this.audioContext = null;
    this.notesInQueue = []; // notes that have been put into the web audio and may or may not have been played yet {note, time}
    this.currentQuarterNote = 0;
    this.tempo = tempo;
    this.lookahead = 25; // How frequently to call scheduling function (in milliseconds)
    this.scheduleAheadTime = 0.075; // How far ahead to schedule audio (sec)
    this.nextNoteTime = 0.0; // when the next note is due
    this.isRunning = false;
    this.intervalID = null;
    this.beatsPerBar = 0;
    this.freq = 440;
    this.array = [];
    this.arrayHold = [];
    this.shape = "square";
    this.onBeatCallback = null;
    this.arrCallback = null;
    this.statusCallback = null;
    this.seqStopCallback = null;
    this.noteLength = 0.05;
    this.lowPassFreq = 15000;
    this.qValue = 0;
    this.base = 110;
    this.multiplier = 2;
    this.playMode = "loop";

    // Update mode: 'immediate' or 'next_loop'
    this.updateMode = "immediate";
  }

  /**
   * Set the update mode for array changes
   * @param {string} mode - 'immediate' or 'next_loop'
   */
  setUpdateMode(mode) {
    if (mode === "immediate" || mode === "next_loop") {
      this.updateMode = mode;
    } else {
      console.warn("Invalid update mode. Use 'immediate' or 'next_loop'");
    }
  }

  setPlayMode(mode) {
    if (mode === "loop" || mode === "one-shot") {
      this.playMode = mode;
      console.log("play mode: " + mode);
    } else {
      console.warn("Invalid play mode. Use 'loop' or 'one-shot'");
    }
  }

  nextNote() {
    // Advance current note and time by a quarter note
    let secondsPerBeat = 60.0 / this.tempo; // Notice this picks up the CURRENT tempo value to calculate beat length.
    this.nextNoteTime += secondsPerBeat; // Add beat length to last beat time

    this.currentQuarterNote++; // Advance the beat number, wrap to zero
    if (this.currentQuarterNote == this.beatsPerBar) {
      this.currentQuarterNote = 0;
      //console.log("wrap to 0");
    }
  }

  scheduleNote(beatNumber, time) {
    // In immediate mode, update array every beat
    // In next_loop mode, only update array when we're at beat 0
    if (this.updateMode === "immediate" || beatNumber === 0) {
      this.array = this.arrayHold.filter(Boolean);
    }

    //check if array is empty if so tell user with callback
    if (this.array.length === 0) {
      // this.stop();
      this.statusCallback(0);
      return;
    }
    //status is ok
    this.statusCallback(1);
    //console.log(`arrHold: ${this.arrayHold}`);
    this.beatsPerBar = this.array.length;

    //guarding against array being out of bounds - use modulo wraparound
    if (beatNumber >= this.array.length) {
      console.warn("Beat number out of bounds, wrapping with modulo", {
        beatNumber,
        arrayLength: this.array.length,
      });
      beatNumber = beatNumber % this.array.length;
      this.currentQuarterNote = beatNumber;
    }

    //in one-shot play mode stop sequence from looping
    if (this.playMode === "one-shot" && beatNumber === this.array.length - 1) {
      this.stop();
      this.seqStopCallback("stop");
    }

    // push the note on the queue, even if we're not playing.
    //this.notesInQueue.push({ note: beatNumber, time: time });

    // create oscillator + gain node + low pass filter
    const osc = this.audioContext.createOscillator();
    const lowpass = this.audioContext.createBiquadFilter();
    const env = this.audioContext.createGain();

    //do math for freq but avoid out of range values and errors
    if (this.array[beatNumber] == 1) {
      if (this.base > -22050 && this.base < 22050) {
        osc.frequency.value = this.base;
      } else {
        osc.frequency.value = 0;
      }
    } else {
      if (
        this.multiplier * this.array[beatNumber] * this.base > -22050 &&
        this.multiplier * this.array[beatNumber] * this.base < 22050
      ) {
        osc.frequency.value =
          this.multiplier * this.array[beatNumber] * this.base;
      } else {
        osc.frequency.value = 0;
      }
    }

    osc.type = this.shape;
    if (this.onBeatCallback) {
      this.onBeatCallback(this.array[beatNumber]);
    }
    if (this.arrCallback) {
      this.arrCallback(this.array);
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
    if (this.isRunning && this.playMode === "loop") return;

    if (
      this.playMode === "loop" ||
      (this.playMode === "one-shot" && this.isRunning === false)
    ) {
      if (this.audioContext == null) {
        this.audioContext = new (
          window.AudioContext || window.webkitAudioContext
        )({ latencyHint: "interactive" });
      }

      this.isRunning = true;

      this.currentQuarterNote = 0;
      this.nextNoteTime = this.audioContext.currentTime + 0.005;

      this.intervalID = setInterval(() => this.scheduler(), this.lookahead);
      this.scheduler();
      //if in one-shot play mode and currently playing
    } else {
      this.stop();
      this.start();
    }
  }

  stop() {
    this.isRunning = false;

    clearInterval(this.intervalID);
  }

  startStop(array) {
    if (this.isRunning && this.playMode === "loop") {
      this.stop();
    } else {
      this.array = array;
      this.arrayHold = array;
      this.start();
    }
  }
}
