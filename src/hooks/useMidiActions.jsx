import { useCallback } from "react";
import {
  findByPresetNum,
  scaleMidiExp,
  scaleMidiToStep,
  scaleMidiToSteppedFloat,
} from "../assets/helpers";

export default function useMidiActions({
  toggleSequencer,
  setAudioParam,
  setWaveshape,
  setSubdivision,
  presetLists,
  subdivisionList,
  subdivision,
  globalPresetActions,
  freqActions,
  indexActions,
  presetData,
  freqData,
  indexData,
  presetObj,
  freqObj,
  indexObj,
  setGlobalPresetNum,
  setGlobalPresetName,
  setGlobalInputRecalled,
  setFreqPresetNum,
  setFreqPresetName,
  setFreqInputRecalled,
  setIndexPresetNum,
  setIndexPresetName,
  setIndexInputRecalled,
  globalPresetNum,
  freqPresetNum,
  indexPresetNum,
  updateIndexMidiRef,
  baseMultiplierParamsRef,
}) {
  //for waveshape midi control
  const WAVESHAPES = ["sine", "triangle", "square", "sawtooth"];

  const getCurrentPresetNum = (category) => {
    switch (category) {
      case "global_preset":
        return globalPresetNum;
      case "freq_preset":
        return freqPresetNum;
      case "index_preset":
        return indexPresetNum;
      default:
        return null;
    }
  };

  const recallPresetByCategory = useCallback(
    (category, presetNum) => {
      if (category === "global_preset") {
        globalPresetActions.handleSelect(presetNum, presetObj?.preset_number);
        const findBy = findByPresetNum(presetData, presetNum);
        setGlobalPresetNum(presetNum);
        setGlobalPresetName(findBy?.name || "-EMPTY-");
        setGlobalInputRecalled(true);
      } else if (category === "freq_preset") {
        freqActions.handleSelect(presetNum, freqObj?.preset_number);
        const findBy = findByPresetNum(freqData, presetNum);
        setFreqPresetNum(presetNum);
        setFreqPresetName(findBy?.name || "-EMPTY-");
        setFreqInputRecalled(true);
      } else if (category === "index_preset") {
        indexActions.handleSelect(presetNum, indexObj?.preset_number);
        const findBy = findByPresetNum(indexData, presetNum);
        setIndexPresetNum(presetNum);
        setIndexPresetName(findBy?.name || "-Empty-");
        setIndexInputRecalled(true);
      }
    },
    [
      freqActions,
      freqData,
      freqObj?.preset_number,
      globalPresetActions,
      indexActions,
      indexData,
      indexObj?.preset_number,
      presetData,
      presetObj?.preset_number,
      setFreqInputRecalled,
      setFreqPresetName,
      setFreqPresetNum,
      setGlobalInputRecalled,
      setGlobalPresetName,
      setGlobalPresetNum,
      setIndexInputRecalled,
      setIndexPresetName,
      setIndexPresetNum,
    ],
  );

  // MIDI action mapping - uses setAudioParam for high-frequency params
  const midiActions = {
    start_stop: () => toggleSequencer(),

    subdivision_recall: ({ value }) => setSubdivision(value),
    subdivision_list_up: () => {
      console.log("=== SUBDIVISION_LIST_UP DEBUG ===");
      console.log("subdivisionList:", subdivisionList);
      console.log("subdivision:", subdivision, typeof subdivision);
      if (!subdivisionList || subdivisionList.length === 0) return;
      const currentIndex = subdivisionList.indexOf(Number(subdivision));

      console.log("currentIndex:", currentIndex);

      const nextIndex =
        currentIndex === -1 ? 0 : (currentIndex + 1) % subdivisionList.length;

      setSubdivision(subdivisionList[nextIndex]);

      console.log("Subdivision list up");
    },
    subdivision_list_down: () => {
      if (!subdivisionList || subdivisionList.length === 0) return;
      const currentIndex = subdivisionList.indexOf(Number(subdivision));

      const nextIndex =
        currentIndex === -1
          ? subdivisionList.length - 1
          : (currentIndex - 1 + subdivisionList.length) %
            subdivisionList.length;

      setSubdivision(subdivisionList[nextIndex]);

      console.log("Subdivision list down");
    },

    preset_recall: ({ category, presetNum }) => {
      recallPresetByCategory(category, presetNum);
    },

    preset_list_up: ({ category }) => {
      const list = presetLists[category];
      if (!list || list.length === 0) return;

      const currentPresetNum = getCurrentPresetNum(category);
      const currentIndex = list.indexOf(currentPresetNum);

      // If current preset not in list, start from beginning (index 0)
      // Otherwise, move to next in list
      const nextIndex =
        currentIndex === -1 ? 0 : (currentIndex + 1) % list.length;

      console.log("Preset list up:", category, "next preset:", list[nextIndex]);
      recallPresetByCategory(category, list[nextIndex]);
    },
    preset_list_down: ({ category }) => {
      const list = presetLists[category];
      if (!list || list.length === 0) return;

      const currentPresetNum = getCurrentPresetNum(category);
      const currentIndex = list.indexOf(currentPresetNum);

      // If current preset not in list, start from the end
      // Otherwise, move to next in list
      const nextIndex =
        currentIndex === -1
          ? list.length - 1
          : (currentIndex - 1 + list.length) % list.length;

      console.log("Preset list down:", category);
      recallPresetByCategory(category, list[nextIndex]);
    },
    preset_list_random: ({ category }) => {
      const list = presetLists[category];
      if (!list || list.length === 0) return;
      const randomIndex = Math.floor(Math.random() * list.length);

      console.log("Preset list random:", category);
      recallPresetByCategory(category, list[randomIndex]);
    },

    wave_shape: () => {
      setWaveshape((prev) => {
        const currentIndex = WAVESHAPES.indexOf(prev);
        const nextIndex = (currentIndex + 1) % WAVESHAPES.length;
        return WAVESHAPES[nextIndex];
      });
    },

    // MIDI CC handlers now use setAudioParam for instant audio updates
    multiplier_cc: ({ value }) => {
      // TODO: Map CC value (0-127) to multiplier range using baseMultiplierParamsRef
      const scaled = scaleMidiToSteppedFloat(
        value,
        baseMultiplierParamsRef.current.multiplier_min,
        baseMultiplierParamsRef.current.multiplier_max,
      ); // Example range
      setAudioParam("multiplier", scaled);
      console.log("Multiplier CC:", value, "→", scaled);
    },
    base_cc: ({ value }) => {
      const scaled = scaleMidiExp(
        value,
        baseMultiplierParamsRef.current.base_min,
        baseMultiplierParamsRef.current.base_max,
      ); // Example range
      setAudioParam("base", scaled);
      console.log("Base CC:", value, "→", scaled);
    },
    duration_cc: ({ value }) => {
      const scaled = scaleMidiToSteppedFloat(value, 0.01, 1);
      setAudioParam("duration", scaled);
      console.log("Duration CC:", value, "→", scaled);
    },
    lowpass_freq_cc: ({ value }) => {
      const scaled = scaleMidiExp(value, 500, 15000);
      setAudioParam("lowPassFreq", scaled);
      console.log("LowPass Freq CC:", value, "→", scaled);
    },
    lowpass_q_cc: ({ value }) => {
      const scaled = scaleMidiToStep(value, 0, 22);
      setAudioParam("lowPassQ", scaled);
      console.log("LowPass Q CC:", value, "→", scaled);
    },

    index_input_cc: ({ index, value }) => {
      let scaled = scaleMidiToStep(value, 0, 8);
      if (scaled === 0) scaled = "";
      updateIndexMidiRef.current[index]?.(scaled);
      console.log(`Index input ${index} CC:`, value);
    },
  };
  return { midiActions };
}
