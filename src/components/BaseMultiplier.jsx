import { useState, useEffect } from "react";

export default function BaseMultiplier({
  base,
  setBase,
  multiplier,
  setMultiplier,
  presetObj,
  paramsRef,
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
    console.log(`ref: ${JSON.stringify(paramsRef.current)}`);
  }, [
    multiplierMin,
    multiplierMax,
    multiplierStep,
    baseMin,
    baseMax,
    baseStep,
  ]);

  useEffect(() => {
    if (presetObj) {
      setMultiplierMin(presetObj.params_json.multiplier_min);
      setMultiplierMax(presetObj.params_json.multiplier_max);
      setMultiplierStep(presetObj.params_json.multiplier_step);
      setBaseMin(presetObj.params_json.base_min);
      setBaseMax(presetObj.params_json.base_max);
      setBaseStep(presetObj.params_json.base_step);
      // paramsRef.current = {
      //   multiplier_min: presetObj.params_json.multiplier_min,
      //   multiplier_max: presetObj.params_json.multiplier_max,
      //   multiplier_step: presetObj.params_json.multiplier_step,
      //   base_min: presetObj.params_json.base_min,
      //   base_max: presetObj.params_json.base_max,
      //   base_step: presetObj.params_json.base_step,
      // };
    }
  }, [presetObj]);

  const handleBaseChange = (e) => {
    let inputValue = e.target.value;
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
    <div style={{ margin: "15px" }}>
      <label htmlFor="base">Base: </label>
      <input
        id="base"
        type="text" // use text to fully control input
        value={base}
        maxLength={10}
        style={{ width: "100px", fontSize: "36px" }}
        onChange={handleBaseChange}
      ></input>
      <input
        type="range"
        max={baseMax}
        min={baseMin}
        step={baseStep}
        value={base}
        onChange={(e) => setBase(e.target.value)}
      />
      <div>
        <div>
          <label htmlFor="base-min">base min: </label>
          <input
            id="base-min"
            type="text" // use text to fully control input
            value={baseMin}
            // maxLength={10}
            style={{ width: "50px", fontSize: "14px" }}
            onChange={handleBaseMinChange}
          ></input>
          <label htmlFor="base-max">base max: </label>
          <input
            id="base-max"
            type="text" // use text to fully control input
            value={baseMax}
            // maxLength={10}
            style={{ width: "50px", fontSize: "14px" }}
            onChange={handleBaseMaxChange}
          ></input>
          <label htmlFor="base-step">base step: </label>
          <input
            id="base-step"
            type="text" // use text to fully control input
            value={baseStep}
            // maxLength={10}
            style={{ width: "50px", fontSize: "14px" }}
            onChange={handleBaseStepChange}
          ></input>
        </div>
        <span style={{ width: "100px" }}>Multiplier: </span>
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
          ></input>
        </div>
      </div>
    </div>
  );
}
