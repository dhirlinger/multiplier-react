import { useState, useEffect } from "react";
import { midiNoteToFrequency, noteNameToMidi } from "../assets/noteConversions";
import { Arrow } from "./Icon";
import BaseMultiplierUI from "./BaseMultiplerUI";

export default function BaseMultiplier({
  base,
  multiplier,
  setAudioParam,
  freqObj,
  presetObj,
  paramsRef,
  globalFreqRecall,
}) {
  const [multiplierMin, setMultiplierMin] = useState("0.1");
  const [multiplierMax, setMultiplierMax] = useState("10");
  const [multiplierStep, setMultiplierStep] = useState("0.1");

  const [baseMin, setBaseMin] = useState("40");
  const [baseMax, setBaseMax] = useState("10000");
  const [baseStep, setBaseStep] = useState("10");

  useEffect(() => {
    paramsRef.current = {
      multiplier_min: multiplierMin,
      multiplier_max: multiplierMax,
      multiplier_step: multiplierStep,
      base_min: baseMin,
      base_max: baseMax,
      base_step: baseStep,
    };
  }, [
    multiplierMin,
    multiplierMax,
    multiplierStep,
    baseMin,
    baseMax,
    baseStep,
  ]);

  useEffect(() => {
    if (freqObj) {
      setMultiplierMin(freqObj.params_json.multiplier_min);
      setMultiplierMax(freqObj.params_json.multiplier_max);
      setMultiplierStep(freqObj.params_json.multiplier_step);
      setBaseMin(freqObj.params_json.base_min);
      setBaseMax(freqObj.params_json.base_max);
      setBaseStep(freqObj.params_json.base_step);
    }
  }, [freqObj]);

  useEffect(() => {
    if (globalFreqRecall && presetObj && presetObj.freq_json) {
      setMultiplierMin(presetObj.freq_json.multiplier_min);
      setMultiplierMax(presetObj.freq_json.multiplier_max);
      setMultiplierStep(presetObj.freq_json.multiplier_step);
      setBaseMin(presetObj.freq_json.base_min);
      setBaseMax(presetObj.freq_json.base_max);
      setBaseStep(presetObj.freq_json.base_step);
    }
  }, [presetObj]);

  // Validation handler for base text input
  const handleBaseChange = (e) => {
    let inputValue = e.target.value;

    if (inputValue === "") {
      setAudioParam("base", "");
      return;
    }

    // positive numbers starting with 1-9 + optional decimals
    if (!/^[1-9]\d*\.?\d*$/.test(inputValue)) {
      return;
    }

    // 3 decimal places if more are entered
    const parts = inputValue.split(".");
    if (parts[1] && parts[1].length > 3) {
      inputValue = parts[0] + "." + parts[1].substring(0, 3);
    }

    setAudioParam("base", inputValue);
  };

  // Validation handler for multiplier text input
  const handleMultiplierChange = (e) => {
    let inputValue = e.target.value;
    setAudioParam("multiplier", inputValue);
  };

  // Wrapper for setAudioParam that handles direct values (for sliders)
  const setBaseValue = (value) => {
    setAudioParam("base", value);
  };

  const setMultiplierValue = (value) => {
    setAudioParam("multiplier", value);
  };

  return (
    <div id="base-multiplier-container">
      <BaseMultiplierUI
        value={base}
        setValue={setBaseValue}
        handleValueChange={handleBaseChange}
        min={baseMin}
        max={baseMax}
        step={baseStep}
        setMin={setBaseMin}
        setMax={setBaseMax}
        setStep={setBaseStep}
        category={"base"}
      />
      <div className="w-1/2 h-[.5px] bg-cyan-400"></div>
      <BaseMultiplierUI
        value={multiplier}
        setValue={setMultiplierValue}
        handleValueChange={handleMultiplierChange}
        min={multiplierMin}
        max={multiplierMax}
        step={multiplierStep}
        setMin={setMultiplierMin}
        setMax={setMultiplierMax}
        setStep={setMultiplierStep}
        category={"multiplier"}
      />
    </div>
  );
}
