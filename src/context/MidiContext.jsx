import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import useMidi from "../hooks/useMidi";
import useFetch from "../hooks/useFetch";
import { findByPresetNum } from "../assets/helpers";

const MidiContext = createContext();

export function MidiProvider({
  children,
  onMidiAction,
  presetLists,
  setPresetLists,
  subdivisionList,
  setSubdivisionList,
  loginStatusRef,
  loggedIn,
}) {
  const midi = useMidi();
  const { get, post, del } = useFetch(
    window.MultiplierAPI?.restUrl || "http://192.168.1.195:8888/wp-json/",
    window.MultiplierAPI?.nonce || "",
  );
  const [learningMode, setLearningMode] = useState(null);
  // null or { type: 'note', target: 'sequencer.start_stop' }
  // or { type: 'cc', target: 'synth_params.duration' }

  // MIDI Preset state
  const [midiPresetNum, setMidiPresetNum] = useState(1);
  const [midiPresetName, setMidiPresetName] = useState("--EMPTY--");
  const [midiPresetData, setMidiPresetData] = useState([]);

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
      subdivision_recalls: {},
      subdivision_list_up: null,
      subdivision_list_down: null,
    },
  });

  // Load MIDI presets on mount
  useEffect(() => {
    if (!loggedIn) return;

    const loadMidiPresets = async () => {
      const userID = loginStatusRef?.current?.user_id;
      if (!userID) return;

      try {
        const data = await get(`multiplier-api/v1/midi/${userID}`);
        if (data && data.length > 0) {
          setMidiPresetData(data);
        }
      } catch (err) {
        console.error("Failed to load MIDI presets:", err);
      }
    };

    loadMidiPresets();
  }, [loggedIn, get]);

  // Recall MIDI preset
  const recallMidiPreset = useCallback(
    (presetNum) => {
      const preset = findByPresetNum(midiPresetData, presetNum);
      if (!preset || !preset.mapping_data) return;

      const data = preset.mapping_data;

      if (data.mappings) {
        setMappings(data.mappings);
      }

      if (data.preset_lists) {
        setPresetLists(data.preset_lists);
      }

      if (data.subdivision_list) {
        setSubdivisionList(data.subdivision_list);
      }

      console.log("MIDI preset recalled:", presetNum);
    },
    [midiPresetData, setPresetLists, setSubdivisionList],
  );

  // Save MIDI preset
  const saveMidiPreset = useCallback(async () => {
    const userID = loginStatusRef?.current?.user_id;
    if (!userID) return;

    try {
      const result = await post("multiplier-api/v1/midi", {
        preset_number: midiPresetNum,
        name: midiPresetName,
        user_id: userID,
        mapping_data: {
          mappings,
          preset_lists: presetLists,
          subdivision_list: subdivisionList,
        },
      });

      if (result.updated_data) {
        setMidiPresetData(result.updated_data);
      }

      console.log("MIDI preset saved:", midiPresetNum);
    } catch (err) {
      console.error("Failed to save MIDI preset:", err);
    }
  }, [
    midiPresetNum,
    midiPresetName,
    mappings,
    presetLists,
    subdivisionList,
    post,
  ]);

  // Delete MIDI preset
  const deleteMidiPreset = useCallback(
    async (presetNum) => {
      const preset = findByPresetNum(midiPresetData, presetNum);
      if (!preset) return;

      const userID = loginStatusRef?.current?.user_id;
      if (!userID) return;

      try {
        const result = await del(
          `multiplier-api/v1/midi/delete/${preset.mapping_id}`,
        );

        if (result.updated_data) {
          setMidiPresetData(result.updated_data);
        }

        setMappings({
          global_preset: {
            preset_recalls: {},
            preset_list_random: null,
            preset_list_up: null,
            preset_list_down: null,
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
          freq_params: { multiplier: null, base: null },
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
            input_8: null,
          },
          sequencer: { start_stop: null },
          tempo_subdivision: {
            subdivision_recalls: {},
            subdivision_list_up: null,
            subdivision_list_down: null,
          },
          play_mode: null,
        });

        setPresetLists({
          global_preset: [],
          freq_preset: [],
          index_preset: [],
        });

        setSubdivisionList([]);

        setMidiPresetName("--EMPTY--");

        console.log("MIDI preset deleted:", presetNum);
      } catch (err) {
        console.error("Failed to delete MIDI preset:", err);
      }
    },
    [midiPresetData, del, setPresetLists, setSubdivisionList],
  );

  // Hardcoded test: Note 60 = start/stop
  // useEffect(() => {
  //   setMappings((prev) => ({
  //     ...prev,
  //     sequencer: { start_stop: 60 },
  //     freq_preset: { preset_recalls: { 1: 61, 2: 62, 3: 63 } },
  //     synth_params: { duration: 1, lowpass_freq: 2, lowpass_q: 3 },
  //   }));
  // }, []);

  const mappingsRef = useRef(mappings);

  useEffect(() => {
    mappingsRef.current = mappings;
  }, [mappings]);

  const onMidiActionRef = useRef(onMidiAction);

  useEffect(() => {
    onMidiActionRef.current = onMidiAction;
  }, [onMidiAction]);

  // Listen for Note messages and check mappings
  useEffect(() => {
    if (!midi.midiEnabled) return;

    const activeInputs = midi.getActiveInputs();
    if (activeInputs.length === 0) return;

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
            onMidiActionRef.current?.({
              type: "preset_recall",
              category,
              presetNum: Number(presetNum),
            });
            return;
          }
        }

        // Check preset_list navigation
        if (currentMappings[category].preset_list_up === noteNumber) {
          onMidiActionRef.current?.({ type: "preset_list_up", category });
          return;
        }
        if (currentMappings[category].preset_list_down === noteNumber) {
          onMidiActionRef.current?.({ type: "preset_list_down", category });
          return;
        }
        if (currentMappings[category].preset_list_random === noteNumber) {
          onMidiActionRef.current?.({ type: "preset_list_random", category });
          return;
        }
      }

      // Check sequencer
      if (currentMappings.sequencer.start_stop === noteNumber) {
        console.log("Match found: start_stop");
        onMidiActionRef.current?.({ type: "start_stop" });
        return;
      }

      //Check playmode
      if (currentMappings.sequencer.play_mode === noteNumber) {
        console.log("Match found: play_mode");
        onMidiActionRef.current?.({ type: "play_mode" });
        return;
      }

      //Check waveshape
      if (currentMappings.synth_params.wave_shape === noteNumber) {
        console.log("Match found: wave_shape");
        onMidiActionRef.current?.({ type: "wave_shape" });
        return;
      }

      // Check subdivision recalls
      const subRecalls = currentMappings.tempo_subdivision.subdivision_recalls;
      for (const [subValue, mappedNote] of Object.entries(subRecalls)) {
        if (mappedNote === noteNumber) {
          onMidiActionRef.current?.({
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
        onMidiActionRef.current?.({ type: "subdivision_list_up" });
        return;
      }
      if (
        currentMappings.tempo_subdivision.subdivision_list_down === noteNumber
      ) {
        onMidiActionRef.current?.({ type: "subdivision_list_down" });
        return;
      }
    };

    // Attach listener to all active inputs
    activeInputs.forEach((input) => {
      input.addListener("noteon", handleNoteOn);
    });

    return () => {
      activeInputs.forEach((input) => {
        input.removeListener("noteon", handleNoteOn);
      });
    };
  }, [
    midi.midiEnabled,
    midi.selectedInput,
    midi.inputs,
    onMidiAction,
    learningMode,
  ]);

  // Listen for CC messages and check mappings
  useEffect(() => {
    if (!midi.midiEnabled) return;

    const activeInputs = midi.getActiveInputs();
    if (activeInputs.length === 0) return;

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
        onMidiActionRef.current?.({ type: "multiplier_cc", value: ccValue });
        return;
      }
      if (currentMappings.freq_params.base === ccNumber) {
        onMidiActionRef.current?.({ type: "base_cc", value: ccValue });
        return;
      }

      // Check synth_params
      if (currentMappings.synth_params.duration === ccNumber) {
        onMidiActionRef.current?.({ type: "duration_cc", value: ccValue });
        return;
      }
      if (currentMappings.synth_params.lowpass_freq === ccNumber) {
        onMidiActionRef.current?.({ type: "lowpass_freq_cc", value: ccValue });
        return;
      }
      if (currentMappings.synth_params.lowpass_q === ccNumber) {
        onMidiActionRef.current?.({ type: "lowpass_q_cc", value: ccValue });
        return;
      }

      // Check index_array_inputs
      for (let i = 0; i < 9; i++) {
        if (currentMappings.index_array_inputs[`input_${i}`] === ccNumber) {
          onMidiActionRef.current?.({
            type: "index_input_cc",
            index: i,
            value: ccValue,
          });
          return;
        }
      }
    };

    // Attach listener to all active inputs
    activeInputs.forEach((input) => {
      input.addListener("controlchange", handleCC);
    });

    return () => {
      activeInputs.forEach((input) => {
        input.removeListener("controlchange", handleCC);
      });
    };
  }, [midi.midiEnabled, midi.selectedInput, midi.inputs, learningMode]);

  // Listen for MIDI during learning mode
  useEffect(() => {
    if (!midi.midiEnabled || !learningMode) return;

    const activeInputs = midi.getActiveInputs();
    if (activeInputs.length === 0) return;

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
      if (
        parts.length === 3 &&
        (parts[1] === "preset_recalls" || parts[1] === "subdivision_recalls")
      ) {
        const [category, recallKey, Num] = parts;

        setMappings((prev) => ({
          ...prev,
          [category]: {
            ...prev[category],
            [recallKey]: {
              ...prev[category][recallKey],
              [Num]: noteNumber,
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

    // Attach learning listeners to all active inputs
    activeInputs.forEach((input) => {
      if (learningMode.type === "note") {
        input.addListener("noteon", handleLearnNote);
      } else if (learningMode.type === "cc") {
        input.addListener("controlchange", handleLearnCC);
      }
    });

    return () => {
      activeInputs.forEach((input) => {
        input.removeListener("noteon", handleLearnNote);
        input.removeListener("controlchange", handleLearnCC);
      });
    };
  }, [midi.midiEnabled, midi.selectedInput, midi.inputs, learningMode]);

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
    // MIDI Preset management
    midiPresetNum,
    setMidiPresetNum,
    midiPresetName,
    setMidiPresetName,
    midiPresetData,
    recallMidiPreset,
    saveMidiPreset,
    deleteMidiPreset,
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
