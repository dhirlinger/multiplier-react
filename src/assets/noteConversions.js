export function frequencyToMidi(frequency) {
  const A4_FREQ = 440; // Frequency of A4 in Hz
  const A4_MIDI_NOTE = 69; // MIDI note number for A4
  return Math.round(12 * Math.log2(frequency / A4_FREQ) + A4_MIDI_NOTE);
}

export function midiNoteToFrequency(midiNote) {
  const a4Frequency = 440; // Frequency of A4
  const a4MidiNote = 69; // MIDI note number for A4
  return a4Frequency * Math.pow(2, (midiNote - a4MidiNote) / 12);
}

export function midiNumberToNoteName(midiNumber) {
  // Array of note names (without octave)
  const noteNames = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];

  // MIDI note 0 corresponds to C-1 (or C0 in some systems)
  // adjust for the standard C4 (middle C) being MIDI note 60.
  // The base octave for MIDI note 0 is -1.
  const baseOctave = -1;

  // Calculate the note index within the `noteNames` array (0-11)
  const noteIndex = midiNumber % 12;

  // Calculate the octave
  // Integer division by 12 gives the octave relative to the base octave.
  // Add `baseOctave` to get the actual octave number.
  const octave = Math.floor(midiNumber / 12) + baseOctave;

  // Combine the note name and the octave
  return noteNames[noteIndex] + octave;
}

export function noteNameToMidi(noteName, setFunction) {
  const noteMap = {
    C: 0,
    "C#": 1,
    Db: 1,
    D: 2,
    "D#": 3,
    Eb: 3,
    E: 4,
    F: 5,
    "F#": 6,
    Gb: 6,
    G: 7,
    "G#": 8,
    Ab: 8,
    A: 9,
    "A#": 10,
    Bb: 10,
    B: 11,
  };

  // Extract the note letter(s) and octave
  const match = noteName.match(/([A-G][b#]?)(-?\d+)/);
  if (!match) {
    console.error("Invalid note name format.");
    setFunction("Invalid note name format. Ex C4");
    return;
  }

  const note = match[1];
  const octave = parseInt(match[2], 10);

  if (!(note in noteMap)) {
    console.error("Invalid note name.");
    setFunction("Invalid note name format. Ex C4");
    return;
  } else if (match && note in noteMap) {
    // MIDI note 0 is C-1, so C4 (middle C) is 60.
    setFunction(null);
    return (octave + 1) * 12 + noteMap[note];
  }
}
