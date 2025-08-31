import { useState, useEffect } from "react";

export default function BaseMultiplier({
  base,
  setBase,
  multiplier,
  setMultiplier,
  presetObj,
}) {
  const [multiplierMin, setMultiplierMin] = useState("0.1");
  const [multiplierMax, setMultiplierMax] = useState("10");
  const [multiplierStep, setMultiplierStep] = useState("0.1");

  const [baseMin, setBaseMin] = useState("40");
  const [baseMax, setBaseMax] = useState("10000");
  const [baseStep, setBaseStep] = useState("10");

  useEffect(() => {
    if (presetObj) {
      setMultiplierMin(presetObj.params_json.multiplier_min);
      setMultiplierMax(presetObj.params_json.multiplier_max);
      setMultiplierStep(presetObj.params_json.multiplier_step);
      setBaseMin(presetObj.params_json.base_min);
      setBaseMax(presetObj.params_json.base_max);
      setBaseStep(presetObj.params_json.base_step);
    }
  }, [presetObj]);

  const handleBaseChange = (e) => {
    let inputValue = e.target.value;

    // Only allow ints and floats
    //if (/^-?\d+(\.\d+)?$/.test(inputValue)) {
    //setBaseValue(inputValue);
    setBase(inputValue);
    //}
    // If input is invalid, do nothing (no update)
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
            onChange={(e) => setBaseMin(e.target.value)}
          ></input>
          <label htmlFor="base-max">base max: </label>
          <input
            id="base-max"
            type="text" // use text to fully control input
            value={baseMax}
            // maxLength={10}
            style={{ width: "50px", fontSize: "14px" }}
            onChange={(e) => setBaseMax(e.target.value)}
          ></input>
          <label htmlFor="base-step">base step: </label>
          <input
            id="base-step"
            type="text" // use text to fully control input
            value={baseStep}
            // maxLength={10}
            style={{ width: "50px", fontSize: "14px" }}
            onChange={(e) => setBaseStep(e.target.value)}
          ></input>
        </div>
        <span style={{ width: "100px" }}>Multiplier: </span>
        <input
          type="range"
          max={multiplierMax}
          min={multiplierMin}
          step={multiplierStep}
          value={multiplier}
          onChange={(e) => setMultiplier(e.target.value)}
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
            onChange={(e) => setMultiplierMin(e.target.value)}
          ></input>
          <label htmlFor="multi-max">multiplier max: </label>
          <input
            id="multi-max"
            type="text" // use text to fully control input
            value={multiplierMax}
            // maxLength={10}
            style={{ width: "50px", fontSize: "14px" }}
            onChange={(e) => setMultiplierMax(e.target.value)}
          ></input>
          <label htmlFor="multi-step">multiplier step: </label>
          <input
            id="multi-step"
            type="text" // use text to fully control input
            value={multiplierStep}
            // maxLength={10}
            style={{ width: "50px", fontSize: "14px" }}
            onChange={(e) => setMultiplierStep(e.target.value)}
          ></input>
        </div>
      </div>
    </div>
  );
}
