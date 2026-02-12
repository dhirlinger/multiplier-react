import { createContext, useContext, useState, useEffect, useRef } from "react";
import useMidi from "../hooks/useMidi";

const MidiContext = createContext();

export function MidiProvider({ children, onMidiAction }) {
  const midi = useMidi();
  const [learningMode, setLearningMode] = useState(null);
  // null or { type: 'note', target: 'sequencer.start_stop' }
  // or { type: 'cc', target: 'synth_params.duration' }
  const [mappings, setMappings] = useState({
    global_preset: {
      preset_recalls: {}, // Direct mappings: {"1": 60, "5": 62}
      preset_list_random: null, // Random from preset_list
      preset_list_up: null, // Next in preset_list
      preset_list_down: null, // Previous in preset_list
    },
    freq_preset: {
      preset_recalls: {},
      preset_list_random: null,
      preset_list_up: null,
      preset_list_down: null,
    },
    index_preset: {
      preset_recalls: {},
      preset_list_random: null,
      preset_list_up: null,
      preset_list_down: null,
    },
    freq_params: {
      multiplier: null,
      base: null,
    },
    synth_params: {
      duration: null,
      lowpass_freq: null,
      lowpass_q: null,
      wave_shape: null,
    },
    index_array_inputs: {
      input_0: null,
      input_1: null,
      input_2: null,
      input_3: null,
      input_4: null,
      input_5: null,
      input_6: null,
      input_7: null,
      input_8: null, // implement later
    },
    sequencer: {
      start_stop: null,
    },
    tempo_subdivision: {
      preset_recalls: {},
      subdivision_list_up: null,
      subdivision_list_down: null,
    },
  });

  const [presetLists, setPresetLists] = useState({
    global_preset: [],
    freq_preset: [],
    index_preset: [],
  });

  const [subdivisionList, setSubdivisionList] = useState([]);

  // Hardcoded test: Note 60 = start/stop
  useEffect(() => {
    setMappings((prev) => ({
      ...prev,
      sequencer: { start_stop: 60 },
      freq_preset: { preset_recalls: { 1: 61, 2: 62, 3: 63 } },
      synth_params: { duration: 1, lowpass_freq: 2, lowpass_q: 3 },
    }));
  }, []);

  const mappingsRef = useRef(mappings);

  useEffect(() => {
    mappingsRef.current = mappings;
  }, [mappings]);

  useEffect(() => {
    if (!midi.midiEnabled || !midi.selectedInput) return;

    const handleNoteOn = (e) => {
      const noteNumber = e.note.number;
      console.log("MIDI Note received:", noteNumber);

      // IMPORTANT: If learning mode is active, ignore this handler
      // Let the learning mode handler capture it instead
      if (learningMode) {
        console.log("Learning mode active - ignoring in action handler");
        return;
      }

      const currentMappings = mappingsRef.current;

      // Check preset_recalls for all categories
      for (const category of ["global_preset", "freq_preset", "index_preset"]) {
        const recalls = currentMappings[category].preset_recalls;

        // Find if this note is mapped to a preset
        for (const [presetNum, mappedNote] of Object.entries(recalls)) {
          if (mappedNote === noteNumber) {
            console.log("Match found: preset_recall", category, presetNum);
            onMidiAction?.({
              type: "preset_recall",
              category,
              presetNum: Number(presetNum),
            });
            return;
          }
        }

        // Check preset_list navigation
        if (currentMappings[category].preset_list_up === noteNumber) {
          onMidiAction?.({ type: "preset_list_up", category });
          return;
        }
        if (currentMappings[category].preset_list_down === noteNumber) {
          onMidiAction?.({ type: "preset_list_down", category });
          return;
        }
        if (currentMappings[category].preset_list_random === noteNumber) {
          onMidiAction?.({ type: "preset_list_random", category });
          return;
        }
      }

      // Check sequencer
      if (currentMappings.sequencer.start_stop === noteNumber) {
        console.log("Match found: start_stop");
        onMidiAction?.({ type: "start_stop" });
        return;
      }

      //Check waveshape
      if (currentMappings.synth_params.wave_shape === noteNumber) {
        console.log("Match found: wave_shape");
        onMidiAction?.({ type: "wave_shape" });
        return;
      }

      // Check subdivision recalls
      const subRecalls = currentMappings.tempo_subdivision.preset_recalls;
      for (const [subValue, mappedNote] of Object.entries(subRecalls)) {
        if (mappedNote === noteNumber) {
          onMidiAction?.({
            type: "subdivision_recall",
            value: Number(subValue),
          });
          return;
        }
      }

      //CHeck subdivision navigation
      if (
        currentMappings.tempo_subdivision.subdivision_list_up === noteNumber
      ) {
        onMidiAction?.({ type: "subdivision_list_up" });
        return;
      }
      if (
        currentMappings.tempo_subdivision.subdivision_list_down === noteNumber
      ) {
        onMidiAction?.({ type: "subdivision_list_down" });
        return;
      }
    };

    midi.selectedInput.channels[1].addListener("noteon", handleNoteOn);

    return () => {
      midi.selectedInput.channels[1].removeListener("noteon", handleNoteOn);
    };
  }, [midi.midiEnabled, midi.selectedInput, onMidiAction, learningMode]);

  // Listen for CC messages and check mappings
  useEffect(() => {
    if (!midi.midiEnabled || !midi.selectedInput) return;

    // IMPORTANT: If learning mode is active, ignore this handler
    if (learningMode) {
      console.log("Learning mode active - ignoring in action handler");
      return;
    }

    const handleCC = (e) => {
      const ccNumber = e.controller.number;
      const ccValue = e.rawValue; // 0-127
      console.log("CC received:", ccNumber, "Value:", ccValue);

      const currentMappings = mappingsRef.current;

      // Check freq_params
      if (currentMappings.freq_params.multiplier === ccNumber) {
        onMidiAction?.({ type: "multiplier_cc", value: ccValue });
        return;
      }
      if (currentMappings.freq_params.base === ccNumber) {
        onMidiAction?.({ type: "base_cc", value: ccValue });
        return;
      }

      // Check synth_params
      if (currentMappings.synth_params.duration === ccNumber) {
        onMidiAction?.({ type: "duration_cc", value: ccValue });
        return;
      }
      if (currentMappings.synth_params.lowpass_freq === ccNumber) {
        onMidiAction?.({ type: "lowpass_freq_cc", value: ccValue });
        return;
      }
      if (currentMappings.synth_params.lowpass_q === ccNumber) {
        onMidiAction?.({ type: "lowpass_q_cc", value: ccValue });
        return;
      }

      // Check index_array_inputs
      for (let i = 0; i < 9; i++) {
        if (currentMappings.index_array_inputs[`input_${i}`] === ccNumber) {
          onMidiAction?.({ type: "index_input_cc", index: i, value: ccValue });
          return;
        }
      }
    };

    midi.selectedInput.channels[1].addListener("controlchange", handleCC);

    return () => {
      midi.selectedInput.channels[1].removeListener("controlchange", handleCC);
    };
  }, [midi.midiEnabled, midi.selectedInput, onMidiAction, learningMode]);

  // Listen for MIDI during learning mode
  useEffect(() => {
    if (!midi.midiEnabled || !midi.selectedInput || !learningMode) return;

    const handleLearnNote = (e) => {
      const noteNumber = e.note.number;
      console.log(
        "Learning - captured note:",
        noteNumber,
        "for target:",
        learningMode.target,
      );

      const parts = learningMode.target.split(".");

      // Handle preset_recalls (3 parts: "category.preset_recalls.presetNum")
      if (parts.length === 3 && parts[1] === "preset_recalls") {
        const [category, _, presetNum] = parts;

        setMappings((prev) => ({
          ...prev,
          [category]: {
            ...prev[category],
            preset_recalls: {
              ...prev[category].preset_recalls,
              [presetNum]: noteNumber,
            },
          },
        }));
      }
      // Handle regular mappings (2 parts: "category.field")
      else {
        const [category, field] = parts;

        setMappings((prev) => ({
          ...prev,
          [category]: {
            ...prev[category],
            [field]: noteNumber,
          },
        }));
      }

      setLearningMode(null);
    };

    const handleLearnCC = (e) => {
      const ccNumber = e.controller.number;
      console.log(
        "Learning - captured CC:",
        ccNumber,
        "for target:",
        learningMode.target,
      );

      // Parse the target path (e.g., 'synth_params.duration')
      const [category, field] = learningMode.target.split(".");

      setMappings((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          [field]: ccNumber,
        },
      }));

      setLearningMode(null); // Exit learning mode
    };

    if (learningMode.type === "note") {
      midi.selectedInput.channels[1].addListener("noteon", handleLearnNote);
    } else if (learningMode.type === "cc") {
      midi.selectedInput.channels[1].addListener(
        "controlchange",
        handleLearnCC,
      );
    }

    return () => {
      midi.selectedInput.channels[1].removeListener("noteon", handleLearnNote);
      midi.selectedInput.channels[1].removeListener(
        "controlchange",
        handleLearnCC,
      );
    };
  }, [midi.midiEnabled, midi.selectedInput, learningMode]);

  const value = {
    ...midi,
    mappings,
    setMappings,
    presetLists,
    setPresetLists,
    subdivisionList,
    setSubdivisionList,
    learningMode,
    setLearningMode,
  };

  return <MidiContext.Provider value={value}>{children}</MidiContext.Provider>;
}

export function useMidiContext() {
  const context = useContext(MidiContext);
  if (!context) {
    throw new Error("useMidiContext must be used with in MidiProvider");
  }
  return context;
}
