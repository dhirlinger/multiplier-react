import { useState, useEffect } from "react";
import { midiNoteToFrequency, noteNameToMidi } from "../assets/noteConversions";
import { Arrow } from "./Icon";
import BaseMultiplierUI from "./BaseMultiplerUI";
export default function BaseMultiplier({
  base,
  setBase,
  multiplier,
  setMultiplier,
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

  const handleBaseChange = (e) => {
    let inputValue = e.target.value;

    if (inputValue === "") {
      setBase("");
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

    setBase(inputValue);
  };

  const handleBaseMinChange = (e) => {
    let inputValue = e.target.value;
    setBaseMin(inputValue);
  };

  const handleBaseMaxChange = (e) => {
    let inputValue = e.target.value;
    setBaseMax(inputValue);
  };

  const handleBaseStepChange = (e) => {
    let inputValue = e.target.value;
    setBaseStep(inputValue);
  };

  const handleMultiplierChange = (e) => {
    let inputValue = e.target.value;
    setMultiplier(inputValue);
  };

  const handleMultiplierMinChange = (e) => {
    let inputValue = e.target.value;
    setMultiplierMin(inputValue);
  };

  const handleMultiplierMaxChange = (e) => {
    let inputValue = e.target.value;
    setMultiplierMax(inputValue);
  };

  const handleMultiplierStepChange = (e) => {
    let inputValue = e.target.value;
    setMultiplierStep(inputValue);
  };

  return (
    <div id="base-multiplier-container">
      <BaseMultiplierUI
        value={base}
        setValue={setBase}
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
        setValue={setMultiplier}
        handleValueChange={handleMultiplierChange}
        min={multiplierMin}
        max={multiplierMax}
        step={multiplierStep}
        setMin={setMultiplierMin}
        setMax={setMultiplierMax}
        setStep={setMultiplierStep}
        category={"multiplier"}
      />
      {/* <label htmlFor="multipler" className="block font-bold">
          Multiplier
        </label>
        <input
          type="range"
          max={multiplierMax}
          min={multiplierMin}
          step={multiplierStep}
          value={multiplier}
          onChange={handleMultiplierChange}
        />
        <span style={{ width: "50px" }}>{Number(multiplier).toFixed(3)}</span>
        <div>
          <label htmlFor="multi-min">multiplier min: </label>
          <input
            id="multi-min"
            type="text" // use text to fully control input
            value={multiplierMin}
            // maxLength={10}
            style={{ width: "50px", fontSize: "14px" }}
            onChange={handleMultiplierMinChange}
          ></input>
          <label htmlFor="multi-max">multiplier max: </label>
          <input
            id="multi-max"
            type="text" // use text to fully control input
            value={multiplierMax}
            // maxLength={10}
            style={{ width: "50px", fontSize: "14px" }}
            onChange={handleMultiplierMaxChange}
          ></input>
          <label htmlFor="multi-step">multiplier step: </label>
          <input
            id="multi-step"
            type="text" // use text to fully control input
            value={multiplierStep}
            // maxLength={10}
            style={{ width: "50px", fontSize: "14px" }}
            onChange={handleMultiplierStepChange}
          ></input> */}
      {/* </div>
      </div> */}
    </div>
  );
}
